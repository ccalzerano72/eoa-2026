/**
 * EOA Exam Trainer — Client Activity Logger
 *
 * Collects activity events and sends them to the log server.
 * When the server is unreachable the events are persisted in localStorage
 * and retried every 60 seconds.
 *
 * Usage:
 *   import { logger } from "./services/logger";
 *
 *   // On app boot — fetches/confirms the deviceId from the server
 *   await logger.init();
 *
 *   // Log any activity
 *   logger.log("navigate", { tab: "study", block: 2 });
 *   logger.log("quiz_start", { mode: "exam-simulation", questionCount: 28 });
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface LogEvent {
  /** Client-side ISO timestamp (server also stamps its own) */
  ts: string;
  action: string;
  detail: Record<string, unknown>;
}

/** All recognised action identifiers — extend freely */
export type LogAction =
  | "app_init"
  | "device_connect"
  | "navigate"
  | "quiz_start"
  | "quiz_finish"
  | "quiz_answer"
  | "study_open"
  | "study_topic_open"
  | "flashcard_start"
  | "flashcard_flip"
  | "flashcard_end"
  | "formula_open"
  | "formula_practice"
  | "formula_study_link"
  | "simulator_open"
  | "simulator_interact"
  | "spaced_review_start"
  | "traps_quiz_start"
  | "stats_open"
  | "theme_change"
  | "track_filter_change"
  | string; // allow ad-hoc actions without breaking type safety

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const LS_BUFFER_KEY = "eoa_log_buffer_v1";
const LS_DEVICE_KEY = "eoa_device_id_v1";
const FLUSH_INTERVAL_MS = 60_000; // 1 minute
const MAX_BUFFER_SIZE = 2_000; // drop oldest if buffer exceeds this
const LOG_ENDPOINT = "/api/log";
const DEVICE_ENDPOINT = "/api/device-id";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** ISO timestamp string suitable for log records */
function nowIso(): string {
  return new Date().toISOString();
}

/** Read the pending buffer from localStorage */
function readBuffer(): LogEvent[] {
  try {
    const raw = localStorage.getItem(LS_BUFFER_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as LogEvent[]) : [];
  } catch {
    return [];
  }
}

/** Persist the pending buffer to localStorage */
function writeBuffer(buf: LogEvent[]): void {
  try {
    // Keep only the most recent MAX_BUFFER_SIZE events to avoid unbounded growth
    const trimmed = buf.length > MAX_BUFFER_SIZE ? buf.slice(buf.length - MAX_BUFFER_SIZE) : buf;
    localStorage.setItem(LS_BUFFER_KEY, JSON.stringify(trimmed));
  } catch {
    // Quota exceeded or storage unavailable — silently discard
  }
}

/** Clear the persisted buffer */
function clearBuffer(): void {
  try {
    localStorage.removeItem(LS_BUFFER_KEY);
  } catch {
    // ignore
  }
}

/** Read the cached deviceId from localStorage */
function readDeviceId(): string | null {
  try {
    return localStorage.getItem(LS_DEVICE_KEY);
  } catch {
    return null;
  }
}

/** Persist the deviceId to localStorage */
function saveDeviceId(id: string): void {
  try {
    localStorage.setItem(LS_DEVICE_KEY, id);
  } catch {
    // ignore
  }
}

// ---------------------------------------------------------------------------
// Logger singleton
// ---------------------------------------------------------------------------

class ActivityLogger {
  private deviceId: string | null = null;
  private flushTimer: ReturnType<typeof setInterval> | null = null;
  private flushing = false;

  // In-memory queue for events accumulated since the last flush attempt
  private memQueue: LogEvent[] = [];

  /**
   * Initialise the logger.
   * Fetches (or confirms) the deviceId from the server and starts the flush loop.
   * Safe to call multiple times — subsequent calls are no-ops.
   */
  async init(): Promise<void> {
    // Restore any deviceId cached from a previous session
    this.deviceId = readDeviceId();

    try {
      const res = await fetch(DEVICE_ENDPOINT, { credentials: "include" });
      if (res.ok) {
        const data = (await res.json()) as { deviceId: string };
        if (typeof data.deviceId === "string" && data.deviceId.length > 0) {
          this.deviceId = data.deviceId;
          saveDeviceId(data.deviceId);
        }
      }
    } catch {
      // Server unreachable — keep any cached deviceId; events will be buffered
    }

    this.log("app_init", { url: window.location.href, userAgent: navigator.userAgent });

    if (!this.flushTimer) {
      // Attempt an immediate flush of any previously buffered events, then
      // set up the regular 60-second loop.
      void this.flush();
      this.flushTimer = setInterval(() => void this.flush(), FLUSH_INTERVAL_MS);
    }
  }

  /**
   * Record an activity event.
   * The event is added to the in-memory queue immediately; delivery to the
   * server happens on the next flush cycle (or immediately if the server is
   * available and the queue is large enough to warrant an early flush).
   */
  log(action: LogAction, detail: Record<string, unknown> = {}): void {
    const event: LogEvent = { ts: nowIso(), action, detail };
    this.memQueue.push(event);

    // Also append to the localStorage buffer so events survive page reloads
    // before they are confirmed as delivered.
    const buf = readBuffer();
    buf.push(event);
    writeBuffer(buf);

    // Early flush when the queue grows large (avoids stale data on long sessions)
    if (this.memQueue.length >= 50) {
      void this.flush();
    }
  }

  /**
   * Attempt to send all pending events (localStorage buffer) to the server.
   * On success the buffer is cleared.
   * On failure the buffer is left intact for the next attempt.
   */
  async flush(): Promise<void> {
    if (this.flushing) return;

    const buf = readBuffer();
    if (buf.length === 0) {
      this.memQueue = [];
      return;
    }

    if (!this.deviceId) {
      // Try to obtain a deviceId before giving up on this flush cycle
      try {
        const res = await fetch(DEVICE_ENDPOINT, { credentials: "include" });
        if (res.ok) {
          const data = (await res.json()) as { deviceId: string };
          if (typeof data.deviceId === "string" && data.deviceId.length > 0) {
            this.deviceId = data.deviceId;
            saveDeviceId(data.deviceId);
          }
        }
      } catch {
        return; // Still unreachable — try again next cycle
      }
    }

    if (!this.deviceId) return;

    this.flushing = true;
    try {
      const res = await fetch(LOG_ENDPOINT, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deviceId: this.deviceId, events: buf }),
      });

      if (res.ok) {
        // Server confirmed receipt — clear the persistent buffer
        clearBuffer();
        this.memQueue = [];
      }
      // Non-2xx: leave the buffer intact, retry next cycle
    } catch {
      // Network error — leave the buffer intact, retry next cycle
    } finally {
      this.flushing = false;
    }
  }

  /**
   * Return the current deviceId (may be null before init() completes).
   */
  getDeviceId(): string | null {
    return this.deviceId;
  }

  /**
   * Immediately flush on page unload (best-effort, uses sendBeacon when available).
   * Call this once from the app root component.
   */
  bindUnloadFlush(): void {
    const sendBeaconFlush = () => {
      const buf = readBuffer();
      if (buf.length === 0 || !this.deviceId) return;

      const payload = JSON.stringify({ deviceId: this.deviceId, events: buf });
      const sent = navigator.sendBeacon?.(LOG_ENDPOINT, new Blob([payload], { type: "application/json" }));
      if (sent) clearBuffer();
    };

    window.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") sendBeaconFlush();
    });
    window.addEventListener("pagehide", sendBeaconFlush);
  }
}

// ---------------------------------------------------------------------------
// Export a single shared instance
// ---------------------------------------------------------------------------
export const logger = new ActivityLogger();
