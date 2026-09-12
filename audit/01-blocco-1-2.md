# Audit Blocchi 1–2 vs ground truth — Report dedicato

- Data: 2026-09-12 · Ground truth: `C:\Salvatore\sources\` (PDF slide/appunti letti via proxy testuale `materiale/1-md/`, nessun PDF aperto con Read per limiti tecnici)
- Teoria: `app/public/data/theory/blocco-1.json`, `blocco-2.json` (lettura integrale) · Formule: `formulas.ts` righe 1–199 (block 1–2)
- Esercizi: `generator/src/templates/block-1-templates.ts` (326 righe), `block-2-templates.ts` (306 righe), `seed-data/block-1.ts` (5 Q), `block-2.ts` (5 Q), campioni `questions/blocks/block-1.json` (N=784) e `block-2.json` (N=722), 10–12 stem/blocco + 3 numeric/blocco
- Legenda: ERRORE / OMISSIONE / INCONGRUENZA / MANCANZA / AMBIGUITÀ / CONTRADDIZIONE / EXTRA · severity alta/media/bassa

## Ground truth usata (.md → PDF originale)

| .md letto | PDF ground truth |
|---|---|
| `I-04-03-26-Economia-impresa.md` | `I-04-03-26-Economia-impresa.pdf` |
| `I-05-03-26-Complicato-vs--complesso.md` | `I-05-03-26-Complicato-vs--complesso.pdf` |
| `I-05-03-26-Trade-off-vs--costo-opportunita.md` | `I-05-03-26-Trade-off-vs--costo-opportunita.pdf` |
| `I-05-03-26-Sintesi-del-documentario-Olivetti.md` | `I-05-03-26-Sintesi-del-documentario-Olivetti.pdf` |
| `I-05-03-26-SLIDE.md` | `I-05-03-26-SLIDE.pdf` |
| `II-11-03-Caso-di-studio-per-la-discussione-NOKIA.md` | `II-11-03-Caso-...-NOKIA.pdf` |
| `II-11-03-SLIDE-Caso-Ferrari.md` | `II-11-03-SLIDE-Caso-Ferrari.pdf` |
| `II-11-03-SLIDE-Trade-off-costo-opportunita-e-bias-cognitivi.md` | `II-11-03-SLIDE-Trade-off-....pdf` |
| `II-12-03-Laboratorio-forme-giuridiche.md` | `II-12-03-Laboratorio-forme-giuridiche.pdf` |
| `IV-approcci-evolutivi1.md`, `IV-approcci-evolutivi2.md` | `IV-approcci-evolutivi1.png` (+2) |
| `I-04-03-26-Modalita-esame.md` (solo formato) | `I-04-03-26-Modalita-esame.pdf` |

## Ricalcoli (tutti OK aritmeticamente)

1. `B1-PROD-LAVORO-NUM-0003`: 2.400.000/22 = 109.090,9 €/dip. — `numericAnswer 109090.9` OK.
2. `B2-STRAT-BCG-QMR-NUM-0001`: 55/160 = 0,34375 → bank 0,3 con `tolerance 0.1` — OK ma sciatto (v. A5).
3. Template curva esperienza `120×0,8²=76,8` OK; costo opportunità `120.000×5%+60.000=66.000` OK.

## A. Blocco 1

### A1. INCONGRUENZA alta — Formule produttività fuori ground truth B1–B2
Posizione: `formulas.ts` `f-prod-lavoro`, `f-prod-capitale`; `block-1-templates.ts` `B1-PROD-LAVORO`, `B1-PROD-CAPITALE`; bank 270/784 Q `topic=efficienza-produttivita`. GT: nessun .md B1–B2 contiene `Fatturato/Dipendenti` o `VA/Capitale Investito` (`I-04-03-26-Economia-impresa.pdf` p.4 solo discorsivo; `I-05-03-26-SLIDE.pdf` p.11 riepilogo senza formule). Citazione progetto: `"Prod_L = Fatturato/N.Dipendenti"`. Distorce il 34% del Blocco 1. Fix: spostare nel blocco reale o fonte extra-slide esplicita + ridurre peso.

### A2. EXTRA media — artt. 2082/2555 non nelle slide
Posizione: `blocco-1.json` topic `definizione-impresa-azienda-flussi`, `kp-imp-1`. GT p.4: `"organizzazione di persone e mezzi… creare valore"`, senza articoli. Contenuto giuridicamente esatto. Fix: `sourceRef` → `Codice Civile artt.2082/2555 + slide`.

### A3. CONTRADDIZIONE bassa (sanata) — Soggetto economico
`blocco-1.json` `soggetti-aziendali-...`: progetto definisce correttamente `Soggetto Economico = controllo capitale di voto`, mentre `I-04-03-26-Economia-impresa.pdf` p.5 scrive `"costituito dai portatori di interesse (stakeholder)"` (impreciso). Fix: nota `"la slide semplifica; vale la definizione controllo/governo"`.

### A4. AMBIGUITÀ bassa — Olivetti `"neo da estirpare"`
`blocco-1.json` `caseStudy.interactiveDilemma.historicalOutcome` vs `I-05-03-26-SLIDE.pdf` pp.4–6 `"ELETTRONICA COME NEOPLASMA / tumore che drena risorse"`. Dati sostanziali conformi (Underwood $40M, GE, P101 1965 Perotto, Elea 9003 Tchou, NASA/Apollo). Fix: uniformare a `"neoplasma/tumore"`.

### A5. AMBIGUITÀ bassa — Dettagli Ferrari/Nokia non sourced
Case `caso-olivetti-ferrari-nokia` (`"margini >25%"`, `"year 1964-2026"`): `II-11-03-SLIDE-Caso-Ferrari.pdf` dà `50.000 vs 13.000`, `"un'auto in meno"`, elettrica 2026, Purosangue — nessun 25%. Nokia (Symbian 62,5%→52,4%, 57 versioni, 51,1 mld 2007, vendita 7,2 mld 2013) riusato correttamente. Fix: sourcare margini o rimuovere 25%; QMR a 2 decimali con `tolerance 0.01`.

### A6. EXTRA media — Combinatorial microeconomia fuori perimetro
`block-1-templates.ts` `paradigmConcepts[profitto normale / efficienza tecnica vs economica / SMST vs w/r]`; bank topics `paradigmi-fondanti/sistemi-complessi` (300/784). Nelle slide B1–B2: nulla su profitto normale/contabile o remunerazioni fattoriali. Citazione: `"Profitto Economico = Ricavi − Espliciti − Impliciti"`. Fix: spostare in blocco Micro/Costi o marcare `EXTRA-micro`.

### A7. AMBIGUITÀ bassa — `sourceRef` generici B1
`B1-COMB-*`, `B1-SEED-MC-101` (`"Dispensa Teoria dell'Impresa / Slide EOA 2026"`, `"Guida EOA 2026"`) non mappano ad alcun PDF sources. Fix: `I-…pdf + sezione` reali.

### A8. ERRORE bassa — `B1-SEED-FT-101` tautologico
`seed-data/block-1.ts`: `"Secondo l'art.2082… quale articolo definisce l'imprenditore?"` — chiede ciò che fornisce. Fix: `"Quale articolo c.c. definisce l'imprenditore? Indica due requisiti"`.

Conformi B1 (no fix): complicato vs complesso; trade-off vs costo opportunità (PPF, migliore alternativa, 8/7/5, `5%×1M=50k`); bias completi (Simon 1955/satisficing, Frederick 2009 DVD 99$ + Plantinga N=2325, Kahneman-Tversky 1979 loss 2x, Asian Disease 200/600 vs 400/600, Thaler 1985 50k/30k, Iyengar-Lepper 2000 24→3%/6→30%, Samuelson-Zeckhauser status quo + sunk cost); Olivetti/Ferrari/Nokia essenziali.

## B. Blocco 2

### B1. ERRORE/INCONGRUENZA alta — Blocco 2 = Strategia, non Forme giuridiche
Posizione: `formulas.ts` `f-qmr-bcg`, `f-curva-esperienza`, `f-elasticita-domanda` (`block:2`); tutti i 3 parametric B2; `generateBlock2CombinatorialQuestions` (Porter 5 forze, strategie generiche, stuck-in-the-middle, VRIO, scala vs scopo, differenziazione vs diversificazione); bank 717/722 Q su strategia — solo 5 seed su forme giuridiche. GT `II-12-03-Laboratorio-forme-giuridiche.pdf`: SOLO impresa individuale/Snc/Sas/Srl/SpA/SRL innovativa/Benefit/B-Corp + Satispay/Exein/Davines + capitali `10.000/50.000`. Zero Porter/VRIO/BCG/esperienza/elasticità. Il titolo `blocco-2.json` dice `"Le Forme Giuridiche e l'Autonomia Patrimoniale"`. Fix: spostare asset strategici nel blocco Strategia; ricostruire B2 su autonomia/escussione/2320/capitali/startup-benefit; correggere `block` in `formulas.ts`.

### B2. INCONGRUENZA media — `sourceRef` errati seed B2
`B2-BENEFIT-CASO-004` → `"II-11-03-SLIDE-Caso-Ferrari.md"` (Davines/Benefit sono in `II-12-03-...` Caso 3, non Ferrari); `B2-STARTUP-INN-003` → `"V-01-04-26-Finanziamento-start-up.md"` (fuori perimetro B1–B2). Contenuti giusti, fonti sbagliate. Fix: entrambi → `II-12-03-Laboratorio-forme-giuridiche.md` (+ `D.L.179/2012`).

### B3. Conformità con EXTRA benigno — Teoria B2
Conformi a `Laboratorio-forme-giuridiche.pdf` + Codice: autonomia perfetta/imperfetta, impresa individuale, Snc/Sas + `beneficio escussione art.2304` + `divieto immistione art.2320`, Srl 10k (Srls 1€)/SpA 50k (ex 120k DL91/2014), startup `DL179/2012`, Benefit `L.208/2015` vs B-Corp BIA≥80, spettro for-profit→Benefit→Yunus→no-profit, Zamagni (Bentham/contrattualismo/virtù, resp. negativo/positivo, dono, `11 cammelli: 12/2=6, 12/4=3, 12/6=2`). Eccedenza lieve: `S.a.p.a.` non in slide — integrazione c.c. corretta, segnare come tale.

### B4. OMISSIONE bassa — Dettagli operativi non in quiz
`Ditta`, `divieto concorrenza Snc`, `Collegio sindacale SpA`, `Satispay Srl→SpA / Exein / Davines` in teoria ma quasi assenti nei quiz (strategici). Fix: 3–4 seed dedicati in ricostruzione B2.

### B5. MANCANZA bassa — Formato esame non riepilogato
`I-04-03-26-Modalita-esame.pdf` p.2 (PC, 25–30 Q, trentesimi, 18/30, orale 20–25 min) non riepilogato nei topic. Fix: nota in pagina esame, non nei quiz.

Sintesi severity: alta (B-B1 misallocazione; A-A1 produttività), media (A-A2/A-A6 EXTRA, B-B2 sourceRef), bassa (resto).
