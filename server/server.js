/**
 * EOA Exam Trainer — Activity Log Server
 *
 * Assigns a persistent deviceId to each client (stored in a cookie).
 * Writes activity records as newline-delimited JSON (JSONL) to:
 *   logs/<deviceId>/YYYYMMDD.jsonl
 *
 * Each JSONL line:
 * {"ts":"20260912 143022","ip":"1.2.3.4","deviceId":"dev_abc123","action":"navigate","detail":{...}}
 *
 * Routes:
 *   GET  /api/device-id   — returns (and sets) the deviceId for the caller
 *   POST /api/log         — accepts an array of activity events; writes them to the log
 *   GET  /api/health      — liveness probe
 */

"use strict";

const express = require("express");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { v4: uuidv4 } = require("uuid");

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------
const PORT = process.env.LOG_PORT ? parseInt(process.env.LOG_PORT, 10) : 3001;
const LOGS_ROOT = path.resolve(__dirname, "logs");
const COOKIE_NAME = "eoa_device_id";
const COOKIE_MAX_AGE_MS = 365 * 24 * 60 * 60 * 1000; // 1 year
const MAX_EVENTS_PER_REQUEST = 500;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** YYYYMMDD string for a Date */
function dateStamp(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}${m}${day}`;
}

/** YYYYMMDD hhmmss string for a Date */
function timeStamp(d = new Date()) {
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  const ss = String(d.getSeconds()).padStart(2, "0");
  return `${dateStamp(d)} ${hh}${mm}${ss}`;
}

/** Sanitise a deviceId so it can safely be used as a directory name */
function sanitiseDeviceId(raw) {
  // Allow only alphanumeric, underscore, hyphen; max 64 chars
  return String(raw)
    .replace(/[^a-zA-Z0-9_-]/g, "")
    .slice(0, 64);
}

/** Generate a new device ID in the format dev_<8-hex-chars> */
function newDeviceId() {
  return "dev_" + crypto.randomBytes(4).toString("hex");
}

/**
 * Ensure log directory for a device exists and return the path to today's log file.
 * Throws if the directory cannot be created.
 */
function getLogFilePath(deviceId) {
  const dir = path.join(LOGS_ROOT, deviceId);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return path.join(dir, `${dateStamp()}.jsonl`);
}

/**
 * Append one or more JSONL records to the appropriate log file.
 * Each record is written as a single JSON line terminated by \n.
 */
function appendLogs(deviceId, records) {
  const filePath = getLogFilePath(deviceId);
  const lines = records.map((r) => JSON.stringify(r)).join("\n") + "\n";
  fs.appendFileSync(filePath, lines, "utf8");
}

/** Extract the real client IP, respecting common reverse-proxy headers */
function clientIp(req) {
  const forwarded = req.headers["x-forwarded-for"];
  if (forwarded) return String(forwarded).split(",")[0].trim();
  return req.socket?.remoteAddress || "unknown";
}

/** Parse and validate a single event from the client payload */
function parseEvent(raw, deviceId, ip, serverTs) {
  if (!raw || typeof raw !== "object") return null;

  const action = typeof raw.action === "string" ? raw.action.slice(0, 80) : "unknown";
  const detail = raw.detail && typeof raw.detail === "object" ? raw.detail : {};

  // Accept a client-supplied timestamp if present (ISO string), else use server time
  let ts = serverTs;
  if (typeof raw.ts === "string" && raw.ts.length > 0) {
    try {
      const d = new Date(raw.ts);
      if (!isNaN(d.getTime())) ts = timeStamp(d);
    } catch {
      // ignore, fall back to server ts
    }
  }

  return { ts, ip, deviceId, action, detail };
}

// ---------------------------------------------------------------------------
// Express app
// ---------------------------------------------------------------------------
const app = express();

app.use(express.json({ limit: "256kb" }));

// CORS: allow the Vite dev server (port 5173) and any same-origin requests
app.use((req, res, next) => {
  const origin = req.headers.origin || "";
  // Allow localhost origins in development; in production same-origin requests
  // won't send an Origin header so this is safe.
  if (!origin || origin.startsWith("http://localhost") || origin.startsWith("http://127.0.0.1")) {
    res.setHeader("Access-Control-Allow-Origin", origin || "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Access-Control-Allow-Credentials", "true");
  }
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

// ---------------------------------------------------------------------------
// GET /api/health
// ---------------------------------------------------------------------------
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", ts: timeStamp() });
});

// ---------------------------------------------------------------------------
// GET /api/device-id
// Returns (and if absent, creates) the deviceId cookie.
// The client can call this once on startup to obtain its permanent ID.
// ---------------------------------------------------------------------------
app.get("/api/device-id", (req, res) => {
  let deviceId = req.cookies?.[COOKIE_NAME];

  // Cookies are not parsed automatically without cookie-parser; read manually.
  if (!deviceId) {
    const cookieHeader = req.headers.cookie || "";
    const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${COOKIE_NAME}=([^;]+)`));
    if (match) deviceId = decodeURIComponent(match[1]);
  }

  if (!deviceId || deviceId.length < 4) {
    deviceId = newDeviceId();
  } else {
    deviceId = sanitiseDeviceId(deviceId);
  }

  // Set a long-lived cookie
  res.setHeader(
    "Set-Cookie",
    `${COOKIE_NAME}=${deviceId}; Max-Age=${Math.floor(COOKIE_MAX_AGE_MS / 1000)}; Path=/; SameSite=Lax`,
  );

  // Also log the "connect" event for this device
  const ip = clientIp(req);
  const ts = timeStamp();
  try {
    appendLogs(deviceId, [{ ts, ip, deviceId, action: "device_connect", detail: { userAgent: req.headers["user-agent"] || "" } }]);
  } catch (err) {
    console.error("[log] write error on device_connect:", err);
  }

  res.json({ deviceId });
});

// ---------------------------------------------------------------------------
// POST /api/log
// Body: { deviceId: string, events: Array<{ action: string, detail: object, ts?: string }> }
// ---------------------------------------------------------------------------
app.post("/api/log", (req, res) => {
  const body = req.body;

  if (!body || typeof body !== "object") {
    return res.status(400).json({ error: "Invalid body" });
  }

  // Determine deviceId: prefer body, fall back to cookie
  let deviceId = typeof body.deviceId === "string" ? sanitiseDeviceId(body.deviceId) : "";
  if (!deviceId) {
    const cookieHeader = req.headers.cookie || "";
    const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${COOKIE_NAME}=([^;]+)`));
    if (match) deviceId = sanitiseDeviceId(decodeURIComponent(match[1]));
  }
  if (!deviceId || deviceId.length < 4) {
    return res.status(400).json({ error: "Missing deviceId" });
  }

  const rawEvents = Array.isArray(body.events) ? body.events : [];
  if (rawEvents.length === 0) {
    return res.status(400).json({ error: "No events provided" });
  }

  const ip = clientIp(req);
  const serverTs = timeStamp();

  const records = rawEvents
    .slice(0, MAX_EVENTS_PER_REQUEST)
    .map((e) => parseEvent(e, deviceId, ip, serverTs))
    .filter(Boolean);

  if (records.length === 0) {
    return res.status(400).json({ error: "No valid events" });
  }

  try {
    appendLogs(deviceId, records);
  } catch (err) {
    console.error("[log] write error:", err);
    return res.status(500).json({ error: "Log write failed" });
  }

  res.json({ written: records.length });
});

// ---------------------------------------------------------------------------
// Start
// ---------------------------------------------------------------------------
fs.mkdirSync(LOGS_ROOT, { recursive: true });

app.listen(PORT, () => {
  console.log(`[eoa-log-server] Listening on port ${PORT}`);
  console.log(`[eoa-log-server] Logs directory: ${LOGS_ROOT}`);
});
