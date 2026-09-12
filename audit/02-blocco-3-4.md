# Audit Blocchi 3–4 vs ground truth — Report dedicato

- Data: 2026-09-12 · Ground truth: `C:\Salvatore\sources\` via proxy `materiale/1-md/` (nessun PDF aperto con Read)
- Teoria: `blocco-3.json` (7 topic), `blocco-4.json` (5 topic), integrali · Formule: `formulas.ts` righe 200–374 (block 3–4)
- Esercizi: `block-3-templates.ts`, `block-4-templates.ts`, `working-capital.ts`, `seed-data/block-3.ts` (4 seed), `block-4.ts` (4 seed); campioni `block-3.json` (586 Q: 12+seed 45) e `block-4.json` (856 Q: 10+seed 99+2)
- Conteggi oggettivi (grep `1-md`): `FIFO`=0, `LIFO`=0, `medio ponderato`=solo De Cecco Nota, `2380-bis`=0, `Jensen/Meckling`=0, `vesting/cliff`=0, `valutazione separata`=0, `correttezza`=0, `2424/2425`=0 in Dispensa (solo De Cecco + VII + Appunti), `Rendiconto/Nota`=1 hit generica in Dispensa

## Ricalcoli (tutti corretti)

1. Startup valuation: pre 10 + inv 1 → post 11, quota 1/11 = 9,0909% → 9,1% OK (trap pre-money 10% scartata). Teoria pre 4+1=5 → 20% vs trap 25% OK.
2. Ammortamento/VNC: (85.000−8.000)/5 = 15.400; fondo 30.800; VNC 54.200 OK. Dispensa 150/10=15, VNC 135 coerente.
3. LIFO/FIFO teoria (100×10€ + 100×20€, vendute 100 a 30€): FIFO costo 1.000/rimanenze 2.000/utile 2.000; LIFO 2.000/1.000/1.000; delta 1.000; IRES 24% = 240€ OK.
4. Ratei/risconti 01/11–30/04: mensile = canone/6, competenza 2 mesi, risconto 4 mesi; 7.200 → 1.200/mese → 4.800 OK. Seed 12.000/12 → 2.000 + 10.000 OK.

## Blocco 3

- R3-01 OMISSIONE media — Azioni privilegiate assenti (`strumenti-finanziari-equity-vs-debito` + `kp-eq-deb-2`). GT `IV-26-03-26-SLIDE.md` p.9: voto solo straordinarie + privilegio utili/rimborso. Fix: aggiungere bullet. PDF: `[IV] 26.03.26 SLIDE.pdf`.
- R3-02 AMBIGUITÀ bassa — Risparmio "riservate alle quotate" non verificato nel proxy (slide p.8: nessun voto + maggiorato + priorità). Fix: rimuovere o sourcare.
- R3-03 EXTRA bassa — Maggiorato "diritto personale, non categoria" non nel proxy (plurimo ≤3 voti non quotate; maggiorato 2 voti dopo 24 mesi quotate/loyalty verificati). Fix: marcare approfondimento.
- R3-04 OMISSIONE bassa — Minibond/ENI/rating assenti (slide pp.6,11–13: minibond PMI, AAA/BBB, Eni gen-2023 2 mld € 4,30% 5 anni, "creditori non soci"). Fix: aggiungere caso Eni.
- R3-05 INCONGRUENZA media — art. 2380-bis citato ma `2380-bis`=0 in `1-md`; modelli senza articoli in SINTESI/SLIDE; virgolettata non ricorrente. Contenuti modelli fedeli. Fix: citare senza articolo o fonte fuori perimetro. PDF: `[IV] 26.03.26 SINTESI/SLIDE`.
- R3-06 EXTRA bassa — Jensen & Meckling 1976, monitoraggio/obbligazione/perdita residuale, D&O, Empire Building: 0 hit. Fix: rimuovere attribuzione o "approfondimento".
- R3-07 CONTRADDIZIONE alta — Parmalat 40.000 vs slide p.2 "135.000 Risparmiatori Truffati" (SINTESI: migliaia famiglie, bond 150 M€, Bonlat/Cayman ~4 mld, buco >14 mld, 24-12-2003, 7,5 mld/36.000 dip./30 paesi). Fix: 135.000.
- R3-08 EXTRA media — Grant Thornton/Deloitte, holding a monte, L.262/2005 (indipendenti/voto di lista/rotazione): non in SINTESI (doppia contabilità, offshore, falsi, CdA compiacente, controlli inefficaci). Fix: rimuovere o sourcare.
- R3-09 EXTRA media — Term-sheet avanzato oltre GT: participating/double-dipping, full ratchet vs weighted average, vesting 4+1 cliff, hurdle, cap table, SAFE YC, unicorno — 0 hit; base GT verificata (`V-01-04-26-Finanziamento-start-up.md` §3.4: liquidation 1x/2x, anti-dilution, drag/tag, board seat; ticket/fee/carried/LP/GP/durate/power-law/CVC/SAFE/Musixmatch/Scalapay OK). Fix: base GT + "approfondimento". PDF: `[V] 01.04.26 Finanziamento start-up.pdf`.
- R3-10 AMBIGUITÀ bassa — Scissione parziale "con opzione" non in Dispensa (integrale vs parziale con azioni beneficiarie). Fix: formulazione GT. PDF: `V-09-04-26-Dispensa-BILANCIO.pdf`.
- R3-11 EXTRA bassa — Stock-option post-operazioni non nel proxy; refuso "Eje"→"Asse". Resto straordinarie fedele (fusione propria/incorporazione, scissione, scorporo Zeta→holding, trasformazione).
- R3-12 EXTRA bassa — Esempio Zerynth/Pisa assente (`IV-26-03-26-CASO-CYBERPEAK.md`: Giulia/Marco, Snc→Srl 2 M€ CdA 3 → SpA 20 M€ CdA 5+collegio, conflitto). Fix: rimuovere o sourcare. PDF: `[IV] 26.03.26 CASO CYBERPEAK`.
- R3-13 ERRORE alta — Organizzazione/Mintzberg/span nel Blocco 3: `formulas.ts:235-267` `f-span-of-control`, `block-3-templates.ts:54-89,94-264`, `B3-ORG-SPAN-*`, `B3-COMB-*` (~270/586) — zero nei doc B3–B4 e nei topic `blocco-3.json`. Fix: spostare in Blocco 2.
- R3-14 INCONGRUENZA media — Slug generati vs teoria (`teoria-agenzia`, `finanziamento-startup`, `equity-vs-debito`, `governance-startup-funding`, `strutture-organizzative`…) vs id reali (`strumenti-finanziari-equity-vs-debito`, `modelli-governance`, …). Fix: riallineare.
- R3-15 MANCANZA media — Seed B3 (4: governance, agenzia, fasi, equity/debito) senza clausole/straordinarie/CyberPeak/speciali. Fix: aggiungere seed.

## Blocco 4

- R4-01 INCONGRUENZA bassa — "4 documenti OIC" corretto ma sourcato alla Dispensa (solo SP+CE) invece che alla Nota De Cecco (SP ex 2424/2424-bis, CE ex 2425/2425-bis, Rendiconto ex 2425-ter/OIC 10, Nota ex 2427/2427-bis; EY; utile 11.707.175 → A.IX). Fix: sourceRef → Nota De Cecco. PDF: `[V] 01.04.26 Bilancio De Cecco`.
- R4-02 EXTRA bassa — Clausola tripartita + divieto compensazioni + window dressing + deroga: solo "veritiera e corretta" (EY + Collegio, "non derogato ex 2423 co.5") verificata; `chiarezza`/`correttezza`/compensazioni = 0. Fix: formula EY + non-deroga; resto nota.
- R4-03 EXTRA bassa — "Valutazione separata" tra principi 2423-bis: 0 hit; verificati competenza/prudenza/continuità/costo storico (+"criteri invariati" De Cecco). Fix: rimuovere o sourcare. PDF: `V-09-04-26-Dispensa-BILANCIO.pdf` + De Cecco.
- R4-04 OMISSIONE media — Ratei/risconti: manca natura finanziaria (rateo=integrazione, SP) vs economica (risconto=rettifica, SP), esempi locazione 1/4, fondi spese/rischi, TFR 1/13,5 + ISTAT 75%+1,5, fatture da emettere/ricevere. Fix: integrare.
- R4-05 EXTRA bassa — Polizza 1° ottobre (3+9 mesi): esempi GT sono locazioni 1/4; ricalcolo OK. Fix: "esempio docente".
- R4-06 OMISSIONE media — Ammortamento: mancano metodi (costanti/decrescenti/crescenti non prudenziali), terreno non ammortizzato, vita economicamente utile (tecnica vs obsolescenza subita/voluta), fondo=rettifica/"non è denaro", autofinanziamento improprio; De Cecco: aliquote (fabbricati 1,5%…), residua possibilità, dimezzamento anno 1, rivalutazione DL 104/2020. Fix: integrare.
- R4-07 EXTRA media — FIFO/LIFO/CMP ex art.2426 n.9 + fisco: `FIFO/LIFO`=0 in `1-md`; unica fonte De Cecco Nota: minore costo-mercato + CMP + netto realizzo/sostituzione. Rischio esame se "il codice ammette 3 criteri". Fix: CMP De Cecco; FIFO/LIFO+IRES come approfondimento.
- R4-08 ERRORE media — CE incompleto: salto B13 Altri accantonamenti (B12 rischi + B13 + B14); C15/16/17, D18/19, EbT A−B±C±D, voce 20 (correnti/differite/anticipate) semplificati. Verificati invece macroclassi SP (A–D; A–E), riserva legale 5%→20% (2.788.992/13.944.960 = 20%), A.IX, D ratei/risconti. Fix: reintegrare B13 + C/D/imposte da De Cecco.
- R4-09 ERRORE alta — VA/MOL/EBITDA e CCN in Blocco 4: `formulas.ts:268-302` `f-valore-aggiunto-mol`, `block-4-templates.ts:10-50`, seed `B4-CE-EBITDA-003`, `B4-SP-RICLASS-002`, `working-capital.ts`, domande CCN/VA/MOL — Dispensa B4 non li tratta, topic `blocco-4.json` senza riclassificazione (De Cecco li cita come gestionale = Blocco 5/VII). Fix: spostare in Blocco 5.
- R4-10 INCONGRUENZA media — Slug B4 vs teoria (`riclassificazione-finanziaria`, `ebitda-ebit-...`, `diagnosi-contabile-avanzata`…) vs id reali (diga, 4-documenti, principi-2423-bis, ratei-..., schemi-...). Fix: riallineare (anche `f-ammortamento`, `f-ratei-risconti`).
- R4-11 MANCANZA media — Seed B4 senza diga/clausola/schemi/magazzino (solo competenza, riclassificazione, EBITDA, ratei). Fix: seed su diga, clausola+non-deroga, schemi/A−B/B13, CMP.
- R4-12 AMBIGUITÀ bassa — "Capitale di liquidazione" + avviamento in cessione: GT `V-01-04-26-SINTESI.md` funzionamento vs cessione; Dispensa liquidazione=dissoluzione; coatta sempre assoluta. Diga, Δcapitale al netto apporti/prelievi, 1/1–31/12, going concern fedeli. Fix: dicotomia GT + volontaria/coatta.

Giudizio: fedeltà sostanziale alta su equity/debito, governance, BA/VC/CVC, straordinarie, CyberPeak, diga, competenza/prudenza/continuità/costo storico, ratei/risconti, ammortamento base, macroclassi e A−B, De Cecco. Interventi richiesti: R3-07, R3-13, R4-09, R4-08, R4-07, etichettatura EXTRA, slug, seed.
