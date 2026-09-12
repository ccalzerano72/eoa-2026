import { useState, useMemo } from "react";
import {
  Scale,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RotateCcw,
  Info,
  TrendingUp,
  TrendingDown,
  ChevronDown,
  ChevronUp,
  Landmark,
  Wallet,
  Building2,
  CreditCard,
  PiggyBank,
} from "lucide-react";

/**
 * Balance Sheet Builder — Strumento Interattivo di Riclassificazione Finanziaria
 *
 * Widget didattico per compilare uno Stato Patrimoniale riclassificato
 * secondo il criterio finanziario (liquidità/esigibilità) e verificare
 * in tempo reale la quadratura e i margini di bilancio.
 */

// ============ DATA STRUCTURES ============

interface BalanceSheetData {
  liquiditaImmediate: number;
  liquiditaDifferite: number;
  rimanenze: number;
  immobilizzazioniImmateriali: number;
  immobilizzazioniMateriali: number;
  immobilizzazioniFinanziarie: number;
  debitiVersoFornitori: number;
  debitiBancariBreve: number;
  altriDebitiBreve: number;
  mutuiMLT: number;
  obbligazioni: number;
  tfr: number;
  altriDebitiMLT: number;
  capitaleSociale: number;
  riserve: number;
  utileEsercizio: number;
}

interface BalanceSheetMetrics {
  attivoCorrente: number;
  attivoFissoNetto: number;
  totaleAttivo: number;
  passivoCorriente: number;
  passivoConsolidato: number;
  patrimonioNetto: number;
  totalePassivo: number;
  capitalePermanente: number;
  ccn: number;
  margineDiTesoreria: number;
  margineStrutturaPrimario: number;
  margineStrutturaSecondario: number;
  currentRatio: number;
  quickRatio: number;
  isBalanced: boolean;
  balanceDifference: number;
}

const DEFAULT_DATA: BalanceSheetData = {
  liquiditaImmediate: 50,
  liquiditaDifferite: 150,
  rimanenze: 100,
  immobilizzazioniImmateriali: 30,
  immobilizzazioniMateriali: 400,
  immobilizzazioniFinanziarie: 20,
  debitiVersoFornitori: 120,
  debitiBancariBreve: 50,
  altriDebitiBreve: 30,
  mutuiMLT: 150,
  obbligazioni: 0,
  tfr: 50,
  altriDebitiMLT: 0,
  capitaleSociale: 200,
  riserve: 100,
  utileEsercizio: 50,
};

const PRESETS: Record<
  string,
  { name: string; data: BalanceSheetData; description: string }
> = {
  default: {
    name: "Azienda Equilibrata",
    data: DEFAULT_DATA,
    description: "CCN positivo, Current Ratio ~1.5, struttura finanziaria sana",
  },
  liquidityCrisis: {
    name: "Crisi di Liquidità ⚠️",
    data: {
      liquiditaImmediate: 10,
      liquiditaDifferite: 80,
      rimanenze: 200,
      immobilizzazioniImmateriali: 20,
      immobilizzazioniMateriali: 350,
      immobilizzazioniFinanziarie: 40,
      debitiVersoFornitori: 180,
      debitiBancariBreve: 120,
      altriDebitiBreve: 50,
      mutuiMLT: 100,
      obbligazioni: 0,
      tfr: 40,
      altriDebitiMLT: 10,
      capitaleSociale: 150,
      riserve: 30,
      utileEsercizio: 20,
    },
    description: "CCN negativo, Quick Ratio < 0.5, rischio insolvenza a breve",
  },
  growthCompany: {
    name: "Startup in Crescita",
    data: {
      liquiditaImmediate: 200,
      liquiditaDifferite: 100,
      rimanenze: 50,
      immobilizzazioniImmateriali: 150,
      immobilizzazioniMateriali: 100,
      immobilizzazioniFinanziarie: 0,
      debitiVersoFornitori: 60,
      debitiBancariBreve: 20,
      altriDebitiBreve: 20,
      mutuiMLT: 50,
      obbligazioni: 0,
      tfr: 10,
      altriDebitiMLT: 0,
      capitaleSociale: 300,
      riserve: 50,
      utileEsercizio: 90,
    },
    description:
      "Alta liquidità da round di finanziamento, basso debito, forti immateriali",
  },
  heavyIndustry: {
    name: "Manifatturiera",
    data: {
      liquiditaImmediate: 30,
      liquiditaDifferite: 200,
      rimanenze: 250,
      immobilizzazioniImmateriali: 10,
      immobilizzazioniMateriali: 800,
      immobilizzazioniFinanziarie: 10,
      debitiVersoFornitori: 180,
      debitiBancariBreve: 70,
      altriDebitiBreve: 50,
      mutuiMLT: 400,
      obbligazioni: 100,
      tfr: 80,
      altriDebitiMLT: 20,
      capitaleSociale: 250,
      riserve: 100,
      utileEsercizio: 50,
    },
    description:
      "Alto attivo fisso, leva finanziaria elevata, ciclo di cassa lungo",
  },
  connectaPreCrash: {
    name: "Connecta Pre-Default",
    data: {
      liquiditaImmediate: 20,
      liquiditaDifferite: 800,
      rimanenze: 500,
      immobilizzazioniImmateriali: 50,
      immobilizzazioniMateriali: 200,
      immobilizzazioniFinanziarie: 30,
      debitiVersoFornitori: 400,
      debitiBancariBreve: 200,
      altriDebitiBreve: 100,
      mutuiMLT: 150,
      obbligazioni: 0,
      tfr: 30,
      altriDebitiMLT: 20,
      capitaleSociale: 300,
      riserve: 150,
      utileEsercizio: 250,
    },
    description:
      "Caso Growth Eats Cash: utile record ma CCN insufficiente per la crescita",
  },
};

function calculateMetrics(data: BalanceSheetData): BalanceSheetMetrics {
  const attivoCorrente =
    data.liquiditaImmediate + data.liquiditaDifferite + data.rimanenze;
  const attivoFissoNetto =
    data.immobilizzazioniImmateriali +
    data.immobilizzazioniMateriali +
    data.immobilizzazioniFinanziarie;
  const totaleAttivo = attivoCorrente + attivoFissoNetto;

  const passivoCorriente =
    data.debitiVersoFornitori + data.debitiBancariBreve + data.altriDebitiBreve;
  const passivoConsolidato =
    data.mutuiMLT + data.obbligazioni + data.tfr + data.altriDebitiMLT;
  const patrimonioNetto =
    data.capitaleSociale + data.riserve + data.utileEsercizio;
  const totalePassivo = passivoCorriente + passivoConsolidato + patrimonioNetto;
  const capitalePermanente = patrimonioNetto + passivoConsolidato;

  const ccn = attivoCorrente - passivoCorriente;
  const margineDiTesoreria =
    data.liquiditaImmediate + data.liquiditaDifferite - passivoCorriente;
  const margineStrutturaPrimario = patrimonioNetto - attivoFissoNetto;
  const margineStrutturaSecondario = capitalePermanente - attivoFissoNetto;

  const currentRatio =
    passivoCorriente > 0 ? attivoCorrente / passivoCorriente : 0;
  const quickRatio =
    passivoCorriente > 0
      ? (data.liquiditaImmediate + data.liquiditaDifferite) / passivoCorriente
      : 0;

  const balanceDifference = totaleAttivo - totalePassivo;
  const isBalanced = Math.abs(balanceDifference) < 0.01;

  return {
    attivoCorrente,
    attivoFissoNetto,
    totaleAttivo,
    passivoCorriente,
    passivoConsolidato,
    patrimonioNetto,
    totalePassivo,
    capitalePermanente,
    ccn,
    margineDiTesoreria,
    margineStrutturaPrimario,
    margineStrutturaSecondario,
    currentRatio,
    quickRatio,
    isBalanced,
    balanceDifference,
  };
}

function formatNumber(value: number): string {
  return value.toLocaleString("it-IT", { maximumFractionDigits: 0 });
}

// ============ SUB-COMPONENTS ============

interface InputCellProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  helpText?: string;
}

function InputCell({ label, value, onChange, helpText }: InputCellProps) {
  return (
    <div className="flex items-center justify-between py-1.5 px-2 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-lg transition group">
      <div className="flex items-center gap-1.5">
        <span className="text-sm text-slate-700 dark:text-slate-300">
          {label}
        </span>
        {helpText && (
          <span
            title={helpText}
            className="cursor-help opacity-0 group-hover:opacity-100 transition"
          >
            <Info className="h-3 w-3 text-slate-400 dark:text-slate-500" />
          </span>
        )}
      </div>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value) || 0)}
        className="w-24 text-right text-sm font-mono font-semibold text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-400"
        min={0}
        step={10}
      />
    </div>
  );
}

interface SectionTotalProps {
  label: string;
  value: number;
  variant?: "primary" | "secondary";
}

function SectionTotal({
  label,
  value,
  variant = "secondary",
}: SectionTotalProps) {
  const isPrimary = variant === "primary";
  return (
    <div
      className={`flex items-center justify-between py-2 px-2 rounded-lg ${
        isPrimary
          ? "bg-slate-800 dark:bg-slate-950 text-white"
          : "bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-100"
      }`}
    >
      <span
        className={`text-sm font-bold ${isPrimary ? "text-white" : "text-slate-700 dark:text-slate-200"}`}
      >
        {label}
      </span>
      <span className="font-mono font-black text-base">
        {formatNumber(value)} €k
      </span>
    </div>
  );
}

interface MetricBadgeProps {
  label: string;
  value: string;
  status: "positive" | "warning" | "negative" | "neutral";
  formula?: string;
}

function MetricBadge({ label, value, status, formula }: MetricBadgeProps) {
  const statusColors: Record<string, string> = {
    positive:
      "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700",
    warning:
      "bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700",
    negative:
      "bg-rose-100 dark:bg-rose-900/40 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-700",
    neutral:
      "bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-600",
  };

  const statusIcons: Record<string, React.ReactNode> = {
    positive: <TrendingUp className="h-3.5 w-3.5" />,
    warning: <AlertTriangle className="h-3.5 w-3.5" />,
    negative: <TrendingDown className="h-3.5 w-3.5" />,
    neutral: null,
  };

  return (
    <div
      className={`rounded-xl border p-3 ${statusColors[status]}`}
      title={formula}
    >
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] font-bold uppercase tracking-wide opacity-70">
          {label}
        </span>
        {statusIcons[status]}
      </div>
      <div className="text-lg font-black">{value}</div>
    </div>
  );
}

// ============ MAIN COMPONENT ============

export function BalanceSheetBuilder() {
  const [data, setData] = useState<BalanceSheetData>(DEFAULT_DATA);
  const [showFormulas, setShowFormulas] = useState(false);

  const metrics = useMemo(() => calculateMetrics(data), [data]);

  const updateField = (field: keyof BalanceSheetData) => (value: number) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const loadPreset = (presetKey: string) => {
    const preset = PRESETS[presetKey];
    if (preset) setData(preset.data);
  };

  const resetToDefault = () => setData(DEFAULT_DATA);

  const ccnStatus: "positive" | "warning" | "negative" =
    metrics.ccn > 50 ? "positive" : metrics.ccn > 0 ? "warning" : "negative";
  const mtStatus: "positive" | "warning" | "negative" =
    metrics.margineDiTesoreria > 0
      ? "positive"
      : metrics.margineDiTesoreria > -50
        ? "warning"
        : "negative";
  const crStatus: "positive" | "warning" | "negative" =
    metrics.currentRatio >= 1.5
      ? "positive"
      : metrics.currentRatio >= 1.0
        ? "warning"
        : "negative";
  const qrStatus: "positive" | "warning" | "negative" =
    metrics.quickRatio >= 1.0
      ? "positive"
      : metrics.quickRatio >= 0.8
        ? "warning"
        : "negative";

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 text-white shadow-lg">
            <Scale className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-slate-100">
              Schema di Bilancio Interattivo
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Riclassificazione Finanziaria dello Stato Patrimoniale
            </p>
          </div>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          Compila le voci di bilancio e verifica in tempo reale la{" "}
          <strong>quadratura</strong> (Attivo = Passivo) e i principali{" "}
          <strong>margini di solvibilità</strong> (CCN, Margine di Tesoreria).
        </p>
      </div>

      {/* Preset Scenarios — grid allineato su mobile */}
      <div className="mb-5">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
            Scenari Didattici
          </span>
          <button
            onClick={resetToDefault}
            className="ml-auto flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition"
          >
            <RotateCcw className="h-3 w-3" />
            Reset
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
          {Object.entries(PRESETS).map(([key, preset]) => (
            <button
              key={key}
              onClick={() => loadPreset(key)}
              className="px-3 py-2 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 hover:border-slate-300 dark:hover:border-slate-500 transition text-slate-700 dark:text-slate-200 text-center"
              title={preset.description}
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Balance Check Banner */}
      <div
        className={`mb-5 rounded-xl border-2 p-4 flex items-center gap-3 ${
          metrics.isBalanced
            ? "bg-emerald-50 dark:bg-emerald-900/30 border-emerald-300 dark:border-emerald-700"
            : "bg-rose-50 dark:bg-rose-900/30 border-rose-300 dark:border-rose-700"
        }`}
      >
        {metrics.isBalanced ? (
          <>
            <CheckCircle2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <div>
              <h4 className="font-bold text-emerald-800 dark:text-emerald-300 text-sm">
                ✓ Bilancio in Quadratura
              </h4>
              <p className="text-xs text-emerald-700 dark:text-emerald-400">
                Totale Attivo ({formatNumber(metrics.totaleAttivo)} €k) = Totale
                Passivo ({formatNumber(metrics.totalePassivo)} €k)
              </p>
            </div>
          </>
        ) : (
          <>
            <XCircle className="h-6 w-6 text-rose-600 dark:text-rose-400 shrink-0" />
            <div>
              <h4 className="font-bold text-rose-800 dark:text-rose-300 text-sm">
                ✗ Bilancio NON in Quadratura
              </h4>
              <p className="text-xs text-rose-700 dark:text-rose-400">
                Differenza: {formatNumber(metrics.balanceDifference)} €k —
                Attivo ({formatNumber(metrics.totaleAttivo)}) ≠ Passivo (
                {formatNumber(metrics.totalePassivo)})
              </p>
            </div>
          </>
        )}
      </div>

      {/* Main Grid: Balance Sheet + Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* ATTIVO (Impieghi) */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="bg-sky-600 dark:bg-sky-700 text-white px-4 py-3 flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-sky-200">
                Impieghi
              </span>
              <h3 className="text-sm font-bold">ATTIVO</h3>
            </div>
          </div>

          <div className="p-4 space-y-4">
            {/* Attivo Corrente */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <CreditCard className="h-4 w-4 text-sky-600 dark:text-sky-400" />
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                  Attivo Corrente (AC)
                </span>
              </div>
              <div className="space-y-1 border-l-2 border-sky-200 dark:border-sky-700 pl-3">
                <InputCell
                  label="Liquidità Immediate (Li)"
                  value={data.liquiditaImmediate}
                  onChange={updateField("liquiditaImmediate")}
                  helpText="Cassa, C/C bancari attivi, titoli prontamente liquidabili"
                />
                <InputCell
                  label="Liquidità Differite (Ld)"
                  value={data.liquiditaDifferite}
                  onChange={updateField("liquiditaDifferite")}
                  helpText="Crediti commerciali verso clienti (esigibili entro 12 mesi)"
                />
                <InputCell
                  label="Rimanenze (R)"
                  value={data.rimanenze}
                  onChange={updateField("rimanenze")}
                  helpText="Scorte di magazzino: materie prime, semilavorati, prodotti finiti"
                />
              </div>
              <div className="mt-2">
                <SectionTotal
                  label="Totale AC"
                  value={metrics.attivoCorrente}
                />
              </div>
            </div>

            {/* Attivo Fisso */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Building2 className="h-4 w-4 text-sky-600 dark:text-sky-400" />
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                  Attivo Fisso Netto (AFN)
                </span>
              </div>
              <div className="space-y-1 border-l-2 border-sky-200 dark:border-sky-700 pl-3">
                <InputCell
                  label="Immob. Immateriali"
                  value={data.immobilizzazioniImmateriali}
                  onChange={updateField("immobilizzazioniImmateriali")}
                  helpText="Brevetti, marchi, avviamento, software"
                />
                <InputCell
                  label="Immob. Materiali"
                  value={data.immobilizzazioniMateriali}
                  onChange={updateField("immobilizzazioniMateriali")}
                  helpText="Terreni, fabbricati, impianti, macchinari (al netto ammortamenti)"
                />
                <InputCell
                  label="Immob. Finanziarie"
                  value={data.immobilizzazioniFinanziarie}
                  onChange={updateField("immobilizzazioniFinanziarie")}
                  helpText="Partecipazioni, crediti oltre 12 mesi, titoli immobilizzati"
                />
              </div>
              <div className="mt-2">
                <SectionTotal
                  label="Totale AFN"
                  value={metrics.attivoFissoNetto}
                />
              </div>
            </div>

            <SectionTotal
              label="TOTALE ATTIVO"
              value={metrics.totaleAttivo}
              variant="primary"
            />
          </div>
        </div>

        {/* PASSIVO (Fonti) */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="bg-amber-600 dark:bg-amber-700 text-white px-4 py-3 flex items-center gap-2">
            <Landmark className="h-5 w-5" />
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-200">
                Fonti
              </span>
              <h3 className="text-sm font-bold">PASSIVO + NETTO</h3>
            </div>
          </div>

          <div className="p-4 space-y-4">
            {/* Passivo Corrente */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <CreditCard className="h-4 w-4 text-rose-600 dark:text-rose-400" />
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                  Passivo Corrente (PC)
                </span>
              </div>
              <div className="space-y-1 border-l-2 border-rose-200 dark:border-rose-700 pl-3">
                <InputCell
                  label="Debiti vs. Fornitori"
                  value={data.debitiVersoFornitori}
                  onChange={updateField("debitiVersoFornitori")}
                  helpText="Debiti commerciali verso fornitori"
                />
                <InputCell
                  label="Debiti Bancari Breve"
                  value={data.debitiBancariBreve}
                  onChange={updateField("debitiBancariBreve")}
                  helpText="Scoperti C/C, anticipi, quote mutui in scadenza entro 12 mesi"
                />
                <InputCell
                  label="Altri Debiti Breve"
                  value={data.altriDebitiBreve}
                  onChange={updateField("altriDebitiBreve")}
                  helpText="Debiti tributari, previdenziali, verso dipendenti"
                />
              </div>
              <div className="mt-2">
                <SectionTotal
                  label="Totale PC"
                  value={metrics.passivoCorriente}
                />
              </div>
            </div>

            {/* Passivo Consolidato */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Building2 className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                  Passivo Consolidato (MLT)
                </span>
              </div>
              <div className="space-y-1 border-l-2 border-amber-200 dark:border-amber-700 pl-3">
                <InputCell
                  label="Mutui MLT"
                  value={data.mutuiMLT}
                  onChange={updateField("mutuiMLT")}
                  helpText="Quote di mutui bancari esigibili oltre 12 mesi"
                />
                <InputCell
                  label="Obbligazioni"
                  value={data.obbligazioni}
                  onChange={updateField("obbligazioni")}
                  helpText="Prestiti obbligazionari emessi"
                />
                <InputCell
                  label="TFR"
                  value={data.tfr}
                  onChange={updateField("tfr")}
                  helpText="Trattamento di Fine Rapporto accantonato"
                />
                <InputCell
                  label="Altri Debiti MLT"
                  value={data.altriDebitiMLT}
                  onChange={updateField("altriDebitiMLT")}
                  helpText="Altri finanziamenti e debiti a medio-lungo termine"
                />
              </div>
              <div className="mt-2">
                <SectionTotal
                  label="Totale MLT"
                  value={metrics.passivoConsolidato}
                />
              </div>
            </div>

            {/* Patrimonio Netto */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <PiggyBank className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                  Patrimonio Netto (PN)
                </span>
              </div>
              <div className="space-y-1 border-l-2 border-emerald-200 dark:border-emerald-700 pl-3">
                <InputCell
                  label="Capitale Sociale"
                  value={data.capitaleSociale}
                  onChange={updateField("capitaleSociale")}
                  helpText="Capitale conferito dai soci"
                />
                <InputCell
                  label="Riserve"
                  value={data.riserve}
                  onChange={updateField("riserve")}
                  helpText="Riserva legale, straordinaria, sovrapprezzo azioni"
                />
                <InputCell
                  label="Utile d'Esercizio"
                  value={data.utileEsercizio}
                  onChange={updateField("utileEsercizio")}
                  helpText="Risultato netto dell'esercizio in corso"
                />
              </div>
              <div className="mt-2">
                <SectionTotal
                  label="Totale PN"
                  value={metrics.patrimonioNetto}
                />
              </div>
            </div>

            <SectionTotal
              label="TOTALE PASSIVO"
              value={metrics.totalePassivo}
              variant="primary"
            />
          </div>
        </div>

        {/* MARGINI & INDICI */}
        <div className="space-y-4">
          {/* Margini di Bilancio */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              Margini di Bilancio (€k)
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <MetricBadge
                label="CCN"
                value={`${metrics.ccn >= 0 ? "+" : ""}${formatNumber(metrics.ccn)}`}
                status={ccnStatus}
                formula="CCN = Attivo Corrente − Passivo Corrente"
              />
              <MetricBadge
                label="Margine Tesoreria"
                value={`${metrics.margineDiTesoreria >= 0 ? "+" : ""}${formatNumber(metrics.margineDiTesoreria)}`}
                status={mtStatus}
                formula="MT = (Li + Ld) − Passivo Corrente"
              />
              <MetricBadge
                label="MS Primario"
                value={`${metrics.margineStrutturaPrimario >= 0 ? "+" : ""}${formatNumber(metrics.margineStrutturaPrimario)}`}
                status={
                  metrics.margineStrutturaPrimario >= 0 ? "positive" : "warning"
                }
                formula="MS₁ = Patrimonio Netto − Attivo Fisso Netto"
              />
              <MetricBadge
                label="MS Secondario"
                value={`${metrics.margineStrutturaSecondario >= 0 ? "+" : ""}${formatNumber(metrics.margineStrutturaSecondario)}`}
                status={
                  metrics.margineStrutturaSecondario >= 0
                    ? "positive"
                    : "negative"
                }
                formula="MS₂ = (PN + MLT) − AFN = CCN"
              />
            </div>
          </div>

          {/* Indici di Liquidità */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
              <Scale className="h-4 w-4 text-sky-600 dark:text-sky-400" />
              Indici di Liquidità
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <MetricBadge
                label="Current Ratio"
                value={metrics.currentRatio.toFixed(2)}
                status={crStatus}
                formula="CR = AC / PC (benchmark: 1.5–2.0)"
              />
              <MetricBadge
                label="Quick Ratio"
                value={metrics.quickRatio.toFixed(2)}
                status={qrStatus}
                formula="QR = (Li + Ld) / PC (benchmark: ≥1.0)"
              />
            </div>
            {/* Interpretazione */}
            <div
              className={`mt-3 p-3 rounded-lg text-xs leading-relaxed ${
                crStatus === "positive" && qrStatus === "positive"
                  ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300"
                  : crStatus === "negative" || qrStatus === "negative"
                    ? "bg-rose-50 dark:bg-rose-900/30 text-rose-800 dark:text-rose-300"
                    : "bg-amber-50 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300"
              }`}
            >
              {crStatus === "positive" && qrStatus === "positive" ? (
                <>
                  <strong>✓ Solvibilità Adeguata:</strong> L'azienda ha risorse
                  sufficienti per far fronte ai debiti a breve termine anche
                  senza vendere le scorte di magazzino.
                </>
              ) : crStatus === "negative" ? (
                <>
                  <strong>✗ Rischio Insolvenza:</strong> Current Ratio {"<"} 1
                  indica che l'attivo a breve non copre le passività correnti.
                  L'azienda potrebbe non riuscire a pagare i debiti in scadenza.
                </>
              ) : qrStatus === "negative" ? (
                <>
                  <strong>⚠ Tensione di Liquidità:</strong> Quick Ratio {"<"}{" "}
                  0.8 indica dipendenza dalla vendita del magazzino per pagare i
                  debiti. Se le scorte non si vendono, l'azienda è a rischio.
                </>
              ) : (
                <>
                  <strong>⚠ Attenzione:</strong> Gli indici sono ai limiti della
                  soglia di sicurezza. Un ritardo negli incassi o un imprevisto
                  potrebbe generare tensione finanziaria.
                </>
              )}
            </div>
          </div>

          {/* Capitale Permanente */}
          <div className="bg-slate-800 dark:bg-slate-900 text-white rounded-2xl p-4 border border-slate-700">
            <h3 className="text-xs font-bold uppercase tracking-wide text-slate-400 mb-2">
              Capitale Permanente
            </h3>
            <div className="text-2xl font-black text-white">
              {formatNumber(metrics.capitalePermanente)} €k
            </div>
            <p className="text-xs text-slate-400 mt-1">
              PN ({formatNumber(metrics.patrimonioNetto)}) + MLT (
              {formatNumber(metrics.passivoConsolidato)})
            </p>
            <div className="mt-3 pt-3 border-t border-slate-700 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Copertura AFN:</span>
                <span
                  className={`font-bold ${metrics.capitalePermanente >= metrics.attivoFissoNetto ? "text-emerald-400" : "text-rose-400"}`}
                >
                  {metrics.attivoFissoNetto > 0
                    ? (
                        (metrics.capitalePermanente /
                          metrics.attivoFissoNetto) *
                        100
                      ).toFixed(0)
                    : "∞"}
                  %
                </span>
              </div>
            </div>
          </div>

          {/* Toggle Formulas */}
          <button
            onClick={() => setShowFormulas(!showFormulas)}
            className="w-full flex items-center justify-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition py-2"
          >
            {showFormulas ? (
              <>
                <ChevronUp className="h-4 w-4" />
                Nascondi formule
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4" />
                Mostra formule
              </>
            )}
          </button>

          {showFormulas && (
            <div className="bg-slate-900 text-slate-100 rounded-2xl p-4 text-xs font-mono leading-relaxed space-y-2">
              <div className="text-slate-400 text-[10px] uppercase tracking-wider mb-3">
                Formule della Riclassificazione Finanziaria
              </div>
              <div>
                <span className="text-sky-400">AC</span> = Li + Ld + Rimanenze
              </div>
              <div>
                <span className="text-sky-400">AFN</span> = Σ Immobilizzazioni
                (al netto ammortamenti)
              </div>
              <div className="pt-2 border-t border-slate-700">
                <span className="text-amber-400">PC</span> = Debiti esigibili
                entro 12 mesi
              </div>
              <div>
                <span className="text-amber-400">MLT</span> = Debiti esigibili
                oltre 12 mesi
              </div>
              <div>
                <span className="text-emerald-400">PN</span> = Capitale +
                Riserve + Utile
              </div>
              <div className="pt-2 border-t border-slate-700">
                <span className="text-purple-400">CCN</span> ={" "}
                <span className="text-sky-400">AC</span> −{" "}
                <span className="text-amber-400">PC</span>
              </div>
              <div>
                <span className="text-purple-400">MT</span> = (Li + Ld) −{" "}
                <span className="text-amber-400">PC</span>
              </div>
              <div>
                <span className="text-purple-400">MS₁</span> ={" "}
                <span className="text-emerald-400">PN</span> −{" "}
                <span className="text-sky-400">AFN</span>
              </div>
              <div>
                <span className="text-purple-400">MS₂</span> = (
                <span className="text-emerald-400">PN</span> +{" "}
                <span className="text-amber-400">MLT</span>) −{" "}
                <span className="text-sky-400">AFN</span> = CCN
              </div>
              <div className="pt-2 border-t border-slate-700 text-slate-500 text-[10px]">
                Valori in €k (migliaia di euro)
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
