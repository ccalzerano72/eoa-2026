# Audit teoria + esercizi vs slide/appunti — Sintesi esecutiva

- Data: 2026-09-12 · Ground truth: `C:\Salvatore\sources\` (17 file: slide PDF + appunti + 2 PNG) letta direttamente (B7) o via proxy testuale `materiale/1-md/` (B1–B6, per limite immagini sui PDF)
- Perimetro: teoria `app/public/data/theory/blocco-1..7.json` (44 topic) · 24 formule `app/src/data/formulas.ts` · 28 template parametrici + 7 combinatoriali · ~169 seed · 6.055 domande (`block-1..7.json`) campionate + ricalcoli indipendenti (tutti OK aritmeticamente)
- Dettagli: `audit/01-blocco-1-2.md`, `02-blocco-3-4.md`, `03-blocco-5-6.md`, `04-blocco-7-trasversale.md`
- Metodo: FACT (citato) / INFERENCE (provenienza probabile) / UNKNOWN (titoli PDF inferiti dai .md dove indicato). Gli EXTRA sono arricchimenti non in slide — segnalati come tali, non come errori, salvo `sourceRef` che li attribuiscono a slide inesistenti (quelli sì errori).

## Priorità HIGH (fix raccomandati)

1. **Grading true-false rotto sul "Vero"** (trasversale, `QuizRunner.tsx` 136–141, 649–651): con opzioni a/b, `expected = id === "true"` è sempre false → ogni V/F con risposta Vero è graded errata. Fix: testo `/vero/i` o id `true|a`, o normalizzare id in engine. Dettagli: `04`, ERRORE-2.
2. **Blocco 2 misallocato a Strategia** (717/722 Q + 3 formule + template + combinatorial su Porter/VRIO/BCG/esperienza/elasticità; GT `II-12-03-...` solo forme giuridiche). Fix: spostare asset in blocco Strategia, ricostruire B2. Dettagli: `01`, B-B1.
3. **Riclassificazione/VA-MOL-CCN nel Blocco 4** (formule, template, seed, domande; GT B4 non li tratta). Fix: spostare in Blocco 5. Dettagli: `02`, R4-09. Analogo: organizzazione/Mintzberg/span nel Blocco 3 (→ Blocco 2). Dettagli: `02`, R3-13.
4. **Parmalat 40.000 vs 135.000** (slide p.2). Fix: 135.000. Dettagli: `02`, R3-07.
5. **MS2 ≡ CCN smentita da De Cecco** (−110,6 vs −111,6, delta = ratei). Fix: qualificare identità. Dettagli: `03`, B5-01.
6. **`sourceRef` B7 a file costi/ABC** (3 seed). Fix: → `IX-06-05-2026.md` / `XII-...-a`. Dettagli: `04`, ERRORE-1.
7. **~580/721 Q B7 senza deep-link** (5 topic senza override/anchor). Fix: override + anchor VAN/TIR/payback/WACC/brevetti/churn. Dettagli: `04`, OMISSIONE-1.
8. **Produttività (270/784 Q) fuori slide B1**. Fix: spostare o fonte extra + ridurre peso. Dettagli: `01`, A-A1.

## Priorità MEDIA (selezione)

- ROI su CIN/CI vs Totale Attivo (3,60% esame vs ~4,76% gestionale): dichiarare convenzione (`03` B5-02). Leva senza UN/RAI: De Cecco spread −3,43% ma ROE +4,20% via dividendi 6,9 mln (`03` B5-03). `MT` doppio senso (`03` B5-04). DIO/DSO/DPO: MP/WIP/PF, consumi, segni A2/A3/B11 (`03` B5-05). Connecta: cifre annuali non in fonte + fusione con De Cecco (`03` B5-06). Constraint che escludono i casi d'esame: spread negativo, QR 0,36, GLO→∞, MS<20% (`03` B5-07/B6-07). Tolleranza R* 0,1 € su 693k (`03` B6-02). Case CloudTech 24/4/6000 vs canonico 45/15/4000 (`03` B6-01). GLO/MS=1/GLO/Q_target senza fonte (`03` B6-03). CE senza B13; C/D/imposte semplificate (`02` R4-08). FIFO/LIFO/2426 n.9 fuori GT → CMP De Cecco (`02` R4-07). Ammortamento: metodi/terreno/obsolescenza/autofinanziamento (`02` R4-06). Ratei/risconti: natura finanziaria/economica + fondi/TFR (`02` R4-04). Clausola/deroga, valutazione separata, 2380-bis, Jensen&Meckling, term-sheet avanzato, L.262/2005: etichettare approfondimenti (`02`). Azioni privilegiate, minibond/Eni: aggiungere (`02` R3-01/R3-04). Slug topic generati vs id teoria (B3/B4) (`02` R3-14/R4-10). Seed mancanti B3/B4 (`02` R3-15/R4-11). Microeconomia EXTRA in B1, artt. 2082/2555, sourceRef generici, QMR 1 decimale, FT-101 tautologico (`01`). Porter "Vantaggio di Prezzo" (`04` §2c). Canali 5-fasi vs 4-categorie (`04` INCONGRUENZA-2). Nokia platform-framing (`04` §2d). DESIGN_SPEC 25–40 vs slide 25–30: disambiguare (`04` §4).

## Priorità LOW (cosmetica/documentale)

Wording Olivetti neo→neoplasma; Ferrari 25%; S.a.p.a.; polizza 1° ottobre; capitale liquidazione/avviamento; scissione "con opzione"; Zerynth; "Eje"; unità (" €", GLO "", Quick ""); MS assoluto oltre %; esempio ABC 400k; CCN totale vs commerciale; spartiacque 12 mesi; outside-in costi; formule B7 orfane; mapping seed B7; soglie free-text/CLV-CAC/timer; orale/SID/smartphone fuori scopo.

## Conformità confermate (campione verificato)

B1: complicato/complesso, trade-off/costo opp., bias completi, Olivetti/Ferrari/Nokia essenziali. B2: autonomia, Snc/Sas/2304/2320, capitali 10k/50k, DL179/2012, L.208/2015 vs B-Corp, Zamagni/11 cammelli. B3: equity/debito, 3 governance, BA/VC/CVC, straordinarie, CyberPeak. B4: diga, competenza/prudenza/continuità/costo storico, ratei/risconti meccanica, ammortamento base, macroclassi SP/CE, A−B, De Cecco 4 documenti. B5/B6: tutti i 15 ricalcoli OK (leva, DuPont, QR, CCC, BEP Q*/R*, GLO, MS, ΔRO, De Cecco, SaaS). B7: Canvas 9 blocchi, prezzi fissi/dinamici, Freemium, esca-e-amo, multi-sided/rete, CLV/CAC/payback/WACC corrette. Esame: 6/6 tipi, MTF punitivo, sequenzialità, risposta obbligatoria, timer/auto-finish, /30 e 18.
