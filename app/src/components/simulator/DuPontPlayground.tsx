import { useState, useMemo } from "react";
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Info,
  RotateCcw,
  Zap,
  ArrowRight,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

/**
 * DuPont Playground — Simulatore Interattivo di Analisi Finanziaria
 *
 * Widget didattico per esplorare in tempo reale l'impatto delle variabili
 * di bilancio su ROI, ROE e leva finanziaria (modello Modigliani-Miller).
 *
 * Formule implementate:
 * - ROS = EBIT / Fatturato
 * - Capital Turnover = Fatturato / Capitale Investito
 * - ROI = ROS × Capital Turnover = EBIT / Capitale Investito
 * - Spread = ROI - i (tasso d'interesse)
 * - ROE = ROI + (ROI - i) × D/E = ROI + Spread × Leverage
 */

interface FinancialInputs {
  fatturato: number; // Ricavi di vendita (€k)
  costiOperativi: number; // Costi operativi (€k)
  capitaleInvestito: number; // Totale Attivo (€k)
  debito: number; // Passività finanziarie (€k)
  tassoInteresse: number; // Tasso d'interesse medio sul debito (%)
}

interface DuPontMetrics {
  ebit: number;
  ros: number; // %
  capitalTurnover: number; // ratio
  roi: number; // %
  equity: number; // €k
  leverage: number; // D/E ratio
  spread: number; // ROI - i (%)
  roe: number; // %
  oneriFinanziari: number; // €k
  utileNetto: number; // €k (semplificato, no imposte)
}

const DEFAULT_INPUTS: FinancialInputs = {
  fatturato: 1000,
  costiOperativi: 850,
  capitaleInvestito: 500,
  debito: 200,
  tassoInteresse: 5,
};

// Scenari precaricati per casi studio
const PRESETS: Record<string, { name: string; inputs: FinancialInputs; description: string }> = {
  default: {
    name: "Situazione Base",
    inputs: DEFAULT_INPUTS,
    description: "Azienda equilibrata con leva moderata e spread positivo",
  },
  highLeverage: {
    name: "Alta Leva (Rischio)",
    inputs: {
      fatturato: 1000,
      costiOperativi: 880,
      capitaleInvestito: 400,
      debito: 320,
      tassoInteresse: 7,
    },
    description: "D/E = 4, spread ridotto — la leva amplifica ma il rischio è alto",
  },
  negativeSpread: {
    name: "Spread Negativo ⚠️",
    inputs: {
      fatturato: 1000,
      costiOperativi: 940,
      capitaleInvestito: 600,
      debito: 400,
      tassoInteresse: 8,
    },
    description: "ROI < i — la leva finanziaria distrugge valore per gli azionisti",
  },
  startupGrowth: {
    name: "Startup in Crescita",
    inputs: {
      fatturato: 500,
      costiOperativi: 480,
      capitaleInvestito: 800,
      debito: 100,
      tassoInteresse: 4,
    },
    description: "Margini bassi, alto capitale investito, leva contenuta",
  },
  matureBusiness: {
    name: "Azienda Matura",
    inputs: {
      fatturato: 2000,
      costiOperativi: 1600,
      capitaleInvestito: 1000,
      debito: 300,
      tassoInteresse: 4,
    },
    description: "ROS alto, capitale ben sfruttato, leva conservativa",
  },
};

function calculateMetrics(inputs: FinancialInputs): DuPontMetrics {
  const { fatturato, costiOperativi, capitaleInvestito, debito, tassoInteresse } = inputs;

  const ebit = fatturato - costiOperativi;
  const ros = fatturato > 0 ? (ebit / fatturato) * 100 : 0;
  const capitalTurnover = capitaleInvestito > 0 ? fatturato / capitaleInvestito : 0;
  const roi = capitaleInvestito > 0 ? (ebit / capitaleInvestito) * 100 : 0;

  const equity = Math.max(capitaleInvestito - debito, 1); // Evita divisione per zero
  const leverage = equity > 0 ? debito / equity : 0;
  const spread = roi - tassoInteresse;

  // ROE con formula Modigliani-Miller: ROE = ROI + (ROI - i) × D/E
  const roe = roi + spread * leverage;

  const oneriFinanziari = (debito * tassoInteresse) / 100;
  const utileNetto = ebit - oneriFinanziari; // Semplificato (no imposte)

  return {
    ebit,
    ros,
    capitalTurnover,
    roi,
    equity,
    leverage,
    spread,
    roe,
    oneriFinanziari,
    utileNetto,
  };
}

function formatPercent(value: number, decimals = 1): string {
  return `${value >= 0 ? "+" : ""}${value.toFixed(decimals)}%`;
}

function formatNumber(value: number): string {
  return value.toLocaleString("it-IT", { maximumFractionDigits: 0 });
}

interface SliderInputProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  onChange: (value: number) => void;
  color?: string;
  helpText?: string;
}

function SliderInput({
  label,
  value,
  min,
  max,
  step,
  unit,
  onChange,
  color = "sky",
  helpText,
}: SliderInputProps) {
  const colorClasses: Record<string, string> = {
    sky: "accent-sky-600",
    emerald: "accent-emerald-600",
    amber: "accent-amber-600",
    rose: "accent-rose-600",
    purple: "accent-purple-600",
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
          {label}
          {helpText && (
            <span title={helpText} className="cursor-help">
              <Info className="h-3 w-3 text-slate-400" />
            </span>
          )}
        </label>
        <div className="flex items-center gap-1">
          <input
            type="number"
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className="w-20 text-right text-sm font-mono font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-sky-500/30"
            min={min}
            max={max}
            step={step}
          />
          <span className="text-xs text-slate-500 w-6">{unit}</span>
        </div>
      </div>
      <input
        type="range"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        min={min}
        max={max}
        step={step}
        className={`w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer ${colorClasses[color] || colorClasses.sky}`}
      />
      <div className="flex justify-between text-[10px] text-slate-400 font-mono">
        <span>{formatNumber(min)}</span>
        <span>{formatNumber(max)}</span>
      </div>
    </div>
  );
}

interface MetricCardProps {
  label: string;
  value: string;
  sublabel?: string;
  trend?: "positive" | "negative" | "neutral" | "warning";
  large?: boolean;
  formula?: string;
}

function MetricCard({ label, value, sublabel, trend, large, formula }: MetricCardProps) {
  const trendColors: Record<string, string> = {
    positive: "text-emerald-600 bg-emerald-50 border-emerald-200",
    negative: "text-rose-600 bg-rose-50 border-rose-200",
    neutral: "text-slate-700 bg-slate-50 border-slate-200",
    warning: "text-amber-600 bg-amber-50 border-amber-200",
  };

  const trendIcons: Record<string, React.ReactNode> = {
    positive: <TrendingUp className="h-4 w-4" />,
    negative: <TrendingDown className="h-4 w-4" />,
    warning: <AlertTriangle className="h-4 w-4" />,
  };

  return (
    <div
      className={`rounded-xl border p-3 ${trendColors[trend || "neutral"]} ${large ? "col-span-2" : ""}`}
      title={formula}
    >
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] font-bold uppercase tracking-wide opacity-70">{label}</span>
        {trend && trend !== "neutral" && trendIcons[trend]}
      </div>
      <div className={`font-black ${large ? "text-2xl" : "text-xl"}`}>{value}</div>
      {sublabel && <div className="text-[10px] mt-0.5 opacity-70">{sublabel}</div>}
    </div>
  );
}

export function DuPontPlayground() {
  const [inputs, setInputs] = useState<FinancialInputs>(DEFAULT_INPUTS);
  const [showFormulas, setShowFormulas] = useState(false);

  const metrics = useMemo(() => calculateMetrics(inputs), [inputs]);

  const updateInput = (key: keyof FinancialInputs) => (value: number) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
  };

  const loadPreset = (presetKey: string) => {
    const preset = PRESETS[presetKey];
    if (preset) {
      setInputs(preset.inputs);
    }
  };

  const resetToDefault = () => {
    setInputs(DEFAULT_INPUTS);
  };

  // Determine spread status for visualization
  const spreadStatus: "positive" | "negative" | "warning" =
    metrics.spread > 2 ? "positive" : metrics.spread > 0 ? "warning" : "negative";

  const roeStatus: "positive" | "negative" | "warning" =
    metrics.roe > 10 ? "positive" : metrics.roe > 0 ? "warning" : "negative";

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg">
            <Zap className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900">DuPont Playground</h2>
            <p className="text-xs text-slate-500">
              Simulatore Interattivo ROI / ROE e Leva Finanziaria
            </p>
          </div>
        </div>
        <p className="text-sm text-slate-600 leading-relaxed">
          Modifica i valori di bilancio con gli slider e osserva in tempo reale l'impatto su{" "}
          <strong>ROI</strong>, <strong>ROE</strong> e lo <strong>spread (ROI − i)</strong>. Quando
          lo spread diventa negativo, la leva finanziaria distrugge valore invece di amplificarlo.
        </p>
      </div>

      {/* Preset Scenarios */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
            Scenari Precaricati
          </span>
          <button
            onClick={resetToDefault}
            className="ml-auto flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700 transition"
          >
            <RotateCcw className="h-3 w-3" />
            Reset
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {Object.entries(PRESETS).map(([key, preset]) => (
            <button
              key={key}
              onClick={() => loadPreset(key)}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 transition text-slate-700"
              title={preset.description}
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Sliders Panel */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
            <span className="h-5 w-5 rounded-md bg-sky-100 text-sky-600 flex items-center justify-center text-xs font-black">
              1
            </span>
            Variabili di Bilancio (€ migliaia)
          </h3>

          <div className="space-y-5">
            <SliderInput
              label="Fatturato (Ricavi)"
              value={inputs.fatturato}
              min={100}
              max={5000}
              step={50}
              unit="€k"
              onChange={updateInput("fatturato")}
              color="emerald"
              helpText="Ricavi netti di vendita"
            />

            <SliderInput
              label="Costi Operativi"
              value={inputs.costiOperativi}
              min={50}
              max={4500}
              step={50}
              unit="€k"
              onChange={updateInput("costiOperativi")}
              color="rose"
              helpText="Tutti i costi prima degli oneri finanziari (materie prime, personale, ammortamenti...)"
            />

            <div className="pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-slate-700">
                  EBIT (Reddito Operativo)
                </span>
                <span
                  className={`font-mono font-black ${metrics.ebit >= 0 ? "text-emerald-600" : "text-rose-600"}`}
                >
                  {formatNumber(metrics.ebit)} €k
                </span>
              </div>
            </div>

            <SliderInput
              label="Capitale Investito (Attivo)"
              value={inputs.capitaleInvestito}
              min={100}
              max={3000}
              step={50}
              unit="€k"
              onChange={updateInput("capitaleInvestito")}
              color="sky"
              helpText="Totale impieghi = Totale fonti"
            />

            <SliderInput
              label="Debito Finanziario"
              value={inputs.debito}
              min={0}
              max={Math.max(inputs.capitaleInvestito - 50, 100)}
              step={25}
              unit="€k"
              onChange={updateInput("debito")}
              color="amber"
              helpText="Passività onerose (bancarie, obbligazioni)"
            />

            <div className="pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-slate-700">Equity (Patrimonio Netto)</span>
                <span className="font-mono font-black text-indigo-600">
                  {formatNumber(metrics.equity)} €k
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-500 mt-1">
                <span>Leverage (D/E)</span>
                <span className="font-mono font-semibold">{metrics.leverage.toFixed(2)}x</span>
              </div>
            </div>

            <SliderInput
              label="Tasso d'Interesse Medio (i)"
              value={inputs.tassoInteresse}
              min={0}
              max={15}
              step={0.5}
              unit="%"
              onChange={updateInput("tassoInteresse")}
              color="purple"
              helpText="Costo medio del debito finanziario"
            />
          </div>
        </div>

        {/* Results Panel */}
        <div className="space-y-4">
          {/* Key Metrics Grid */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
              <span className="h-5 w-5 rounded-md bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-black">
                2
              </span>
              Indicatori Calcolati
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <MetricCard
                label="ROS"
                value={`${metrics.ros.toFixed(1)}%`}
                sublabel="Margine Operativo"
                trend={metrics.ros > 10 ? "positive" : metrics.ros > 0 ? "neutral" : "negative"}
                formula="ROS = EBIT / Fatturato"
              />
              <MetricCard
                label="Turnover"
                value={`${metrics.capitalTurnover.toFixed(2)}x`}
                sublabel="Rotazione Capitale"
                trend={
                  metrics.capitalTurnover > 1.5
                    ? "positive"
                    : metrics.capitalTurnover > 0.8
                      ? "neutral"
                      : "warning"
                }
                formula="Capital Turnover = Fatturato / Capitale Investito"
              />
              <MetricCard
                label="ROI"
                value={`${metrics.roi.toFixed(1)}%`}
                sublabel="Return on Investment"
                trend={metrics.roi > 8 ? "positive" : metrics.roi > 0 ? "neutral" : "negative"}
                large
                formula="ROI = EBIT / Capitale Investito = ROS × Turnover"
              />
            </div>
          </div>

          {/* Spread Visualization — The Key Insight */}
          <div
            className={`rounded-2xl border-2 p-5 transition-colors ${
              spreadStatus === "positive"
                ? "bg-emerald-50 border-emerald-300"
                : spreadStatus === "warning"
                  ? "bg-amber-50 border-amber-300"
                  : "bg-rose-50 border-rose-300"
            }`}
          >
            <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
              <span className="h-5 w-5 rounded-md bg-white/80 flex items-center justify-center text-xs font-black">
                3
              </span>
              Spread e Effetto Leva
            </h3>

            {/* Visual Spread Bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between text-xs font-semibold mb-2">
                <span>ROI: {metrics.roi.toFixed(1)}%</span>
                <span className="flex items-center gap-1">
                  <ArrowRight className="h-3 w-3" />
                  Spread (ROI − i)
                  <ArrowRight className="h-3 w-3" />
                </span>
                <span>i: {inputs.tassoInteresse}%</span>
              </div>

              <div className="relative h-8 bg-white/50 rounded-lg border overflow-hidden">
                {/* Zero line */}
                <div className="absolute left-1/2 top-0 bottom-0 w-px bg-slate-400 z-10" />

                {/* Spread indicator */}
                <div
                  className={`absolute top-1 bottom-1 rounded transition-all ${
                    metrics.spread >= 0 ? "bg-emerald-500" : "bg-rose-500"
                  }`}
                  style={{
                    left: metrics.spread >= 0 ? "50%" : `${50 + (metrics.spread / 20) * 50}%`,
                    width: `${Math.min(Math.abs(metrics.spread) / 20, 0.5) * 100}%`,
                  }}
                />

                {/* Labels */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span
                    className={`font-mono font-black text-lg ${
                      metrics.spread >= 0 ? "text-emerald-700" : "text-rose-700"
                    }`}
                  >
                    {formatPercent(metrics.spread)}
                  </span>
                </div>
              </div>

              <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                <span>−20%</span>
                <span>0</span>
                <span>+20%</span>
              </div>
            </div>

            {/* ROE Result with Modigliani-Miller Formula */}
            <div
              className={`rounded-xl p-4 ${
                roeStatus === "positive"
                  ? "bg-emerald-100"
                  : roeStatus === "warning"
                    ? "bg-amber-100"
                    : "bg-rose-100"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wide opacity-70">
                    ROE (Return on Equity)
                  </div>
                  <div className="text-3xl font-black">{metrics.roe.toFixed(1)}%</div>
                </div>
                {roeStatus === "positive" ? (
                  <TrendingUp className="h-8 w-8 opacity-50" />
                ) : roeStatus === "negative" ? (
                  <TrendingDown className="h-8 w-8 opacity-50" />
                ) : (
                  <AlertTriangle className="h-8 w-8 opacity-50" />
                )}
              </div>

              {/* Formula breakdown */}
              <div className="mt-3 pt-3 border-t border-black/10 text-xs font-mono">
                <div className="flex flex-wrap items-center gap-1">
                  <span className="font-bold">ROE</span>
                  <span>=</span>
                  <span className="px-1.5 py-0.5 rounded bg-white/50">
                    ROI ({metrics.roi.toFixed(1)}%)
                  </span>
                  <span>+</span>
                  <span className="px-1.5 py-0.5 rounded bg-white/50">
                    Spread ({formatPercent(metrics.spread)})
                  </span>
                  <span>×</span>
                  <span className="px-1.5 py-0.5 rounded bg-white/50">
                    D/E ({metrics.leverage.toFixed(2)})
                  </span>
                </div>
              </div>
            </div>

            {/* Educational Insight */}
            <div
              className={`mt-4 p-3 rounded-lg text-xs leading-relaxed ${
                spreadStatus === "positive"
                  ? "bg-emerald-100/50 text-emerald-800"
                  : spreadStatus === "warning"
                    ? "bg-amber-100/50 text-amber-800"
                    : "bg-rose-100/50 text-rose-800"
              }`}
            >
              {spreadStatus === "positive" ? (
                <>
                  <strong>✓ Leva favorevole:</strong> Lo spread positivo significa che ogni euro
                  preso in prestito genera più rendimento del suo costo. La leva{" "}
                  <em>amplifica</em> il ROE.
                </>
              ) : spreadStatus === "warning" ? (
                <>
                  <strong>⚠ Attenzione:</strong> Spread basso ma positivo. Un piccolo
                  peggioramento di ROI o aumento dei tassi potrebbe invertire l'effetto leva.
                </>
              ) : (
                <>
                  <strong>✗ Leva distruttiva:</strong> ROI &lt; i significa che il debito costa più
                  di quanto rende il capitale investito. Ogni euro di debito{" "}
                  <em>riduce</em> il ROE degli azionisti.
                </>
              )}
            </div>
          </div>

          {/* Toggle Formulas */}
          <button
            onClick={() => setShowFormulas(!showFormulas)}
            className="w-full flex items-center justify-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-700 transition py-2"
          >
            {showFormulas ? (
              <>
                <ChevronUp className="h-4 w-4" />
                Nascondi formule
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4" />
                Mostra formule DuPont
              </>
            )}
          </button>

          {showFormulas && (
            <div className="bg-slate-900 text-slate-100 rounded-2xl p-5 text-xs font-mono leading-relaxed space-y-2">
              <div className="text-slate-400 text-[10px] uppercase tracking-wider mb-3">
                Scomposizione DuPont del ROE
              </div>
              <div>
                <span className="text-amber-400">ROS</span> = EBIT / Fatturato
              </div>
              <div>
                <span className="text-sky-400">Turnover</span> = Fatturato / Capitale Investito
              </div>
              <div>
                <span className="text-emerald-400">ROI</span> ={" "}
                <span className="text-amber-400">ROS</span> ×{" "}
                <span className="text-sky-400">Turnover</span> = EBIT / CI
              </div>
              <div className="pt-2 border-t border-slate-700">
                <span className="text-purple-400">Spread</span> ={" "}
                <span className="text-emerald-400">ROI</span> − i
              </div>
              <div>
                <span className="text-rose-400">ROE</span> ={" "}
                <span className="text-emerald-400">ROI</span> +{" "}
                <span className="text-purple-400">Spread</span> × (D/E)
              </div>
              <div className="pt-2 text-slate-500 text-[10px]">
                Formula Modigliani-Miller semplificata (senza imposte)
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
