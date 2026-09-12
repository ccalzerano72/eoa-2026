---
title: "[XI] Lezione 21 maggio SLIDE.pdf"
pages: 8
created: 2026-09-11
updated: 2026-09-11
---

<!-- page 1 -->

Allocazione tradizionale: semplicità a costo di precisione

Il metodo tradizionale alloca tutti i costi indiretti usando un'unica base di riparto (single-rate), tipicamente le ore di manodopera diretta (MOD) o le ore (MOD) o le ore macchina.

Coefficiente di allocazione = Costi indiretti totali / Base di riparto totale

## Esempio di Allocazione

Costi indiretti totali:

600.000 €

Ore MOD totali (base di riparto):

30.000 ore

Coefficiente = 600.000 / 30.000

= 20 € / ora MOD

Prodotto A (usa 2 ore MOD):

Riceve 2 × 20 = 40 € di costi indiretti

Prodotto B (usa 0,5 ore MOD):

Riceve 0,5 × 20 = 10 € di costi indiretti

## Limite critico: Cross-subsidization

Se il Prodotto B è un prodotto custom che richiede molte attività di setup, progettazione e gestione ordini (ma poca MOD), il metodo tradizionale pochi costi indiretti.

Il Prodotto A (standard, alto volume) finisce per assorbire la maggior parte dei costi dei costi indiretti, pur non avendoli causati.

Il Prodotto A "sussidia" il Prodotto B. Questo errore porta a decisioni di pricing di pricing sbagliate: il Prodotto B sembrerà molto redditizio, spingendo l'azienda spingendo l'azienda a venderne di più (perdendo soldi).


<!-- page 2 -->

## Activity-Based Costing: le attività come ponte tra risorse e prodotti

L'ABC nasce dal lavoro di Robin Cooper e Robert Kaplan (Harvard Business School, 1988) per superare le distorsioni dell'allocation tradizionale in contesti di tradizionale in contesti di crescente complessità e diversificazione produttiva.

1

Le risorse vengono consumate dalle attività (non direttamente dai prodotti)

2

Le attività vengono consumate dai prodotti/servizi in misura diversa

3

Il costo del prodotto riflette le attività effettivamente richieste per produrre e produrre e venderlo

## Quando serve l'ABC?

Elevata incidenza dei costi indiretti (>30-40% dei costi totali)

■ Ampia diversità di prodotti/servizi (standard vs custom) custom)

■ Presenza di prodotti a basso volume che richiedono molte attività di supporto

Necessità di prendere decisioni di pricing strategiche e e accurate


<!-- page 3 -->

## Implementare l'ABC in quattro passi

L'implementazione dell'ABC segue un processo strutturato che collega le risorse aziendali ai prodotti attraverso le attività, usando driver causali.

<img src="images/bbox_53_381_88_427.jpg" />

## Identificare le attività rilevanti

Mappare le attività che consumano risorse all'interno dell'organizzazione.

Es. setup macchine, gestione ordini, controllo qualità, spedizioni.

<img src="images/bbox_513_381_547_427.jpg" />

## Attribuire i costi alle attività

Determinare quanto ogni risorsa (personale, spazi, tecnologia) è consumata da ciascuna attività tramite i resource drivers

Es. % di tempo spesa dal personale per gestire gli ordini.

<img src="images/bbox_53_571_88_617.jpg" />

## Identificare gli activity driver

Scegliere la misura che meglio spiega il consumo di ciascuna attività da parte dei prodotti.

Es. n. setup, n. ordini, n. ispezioni.

<img src="images/bbox_513_571_547_617.jpg" />

## Allocare i costi ai prodotti

Assegnare i costi ai cost objects (prodotti/servizi) moltiplicando il costo per unità di driver per la quantità di driver consumata.

Costo unitario driver × Quantità consumata.

Nota: La scelta degli activity driver è il passaggio più critico: un driver inadeguato reintroduce le stesse distorsioni del metodo tradizionale.


<!-- page 4 -->

La gerarchia delle attività: non tutti i costi variano con il volume

Cooper (1990) classifica le attività in quattro livelli gerarchici. Solo le attività unit-level/variano con il volume prodotto. Questa gerarchia spiega il perché il metodo tradizionale (basato sul volume) distorce i costi.

<table border="1"><tr><td>Livello</td><td>Definizione</td><td>Esempi</td><td>Driver tipico</td></tr><tr><td>Unit-level</td><td>Eseguite per ogni singola unità prodotta</td><td>Lavorazione, assemblaggio, energia macchina macchina</td><td>Ore macchina, ore MOD</td></tr><tr><td>Batch-level</td><td>Eseguite per ogni lotto di produzione</td><td>Setup macchine, ispezione lotto, gestione ordine ordine di produzione</td><td>N. setup, n. lotti</td></tr><tr><td>Product-level</td><td>Eseguite per mantenere un prodotto in gamma</td><td>Design, ingegneria, gestione distinta base</td><td>N. prodotti, n. modifiche</td></tr><tr><td>Facility-level</td><td>Eseguite per mantenere la capacità produttiva generale</td><td>Manutenzione stabilimento, sicurezza, direzione generale</td><td>Allocazione uniforme</td></tr></table>

Nota: I costi batch-level e product-level sono quelli più distorti dal metodo tradizionale: vengono "spalmati" sul volume anziché attribuiti ai lotti o ai prodotti che li causano. causano.


<!-- page 5 -->

## ABC vs Tradizionale: come cambia il costo del prodotto

Confrontiamo i due metodi su un caso con due prodotti: Standard (alto volume) e Custom (basso volume).

Costi indiretti totali: 400.000 €. Base tradizionale: ore macchina.

Dati di Produzione

<table border=1><tr><td>Parametro</td><td>Prodotto Standard</td><td>Prodotto Custom</td></tr><tr><td>Volume annuo</td><td>10.000 unità</td><td>500 unità</td></tr><tr><td>Ore macchina/unità</td><td>2</td><td>3</td></tr><tr><td>Ore macchina totali</td><td>20.000</td><td>1.500</td></tr><tr><td>N. setup</td><td>10</td><td>50</td></tr><tr><td>N. ordini gestiti</td><td>20</td><td>100</td></tr></table>

Risultati: Costo Indiretto per Unità

<table border=1><tr><td>Metodo</td><td>Prodotto Standard</td><td>Prodotto Custom</td></tr><tr><td>Tradizionale</td><td></td><td></td></tr><tr><td>Coeff. =400.000 / 21.500 = 18,60 €/ora€/ora</td><td>2 × 18,60 =37,21 €</td><td>3 × 18,60 =55,81 €</td></tr><tr><td>ABC</td><td>Allocazione basata su attività</td><td>Allocazione basata su attività</td></tr><tr><td>Setup 200.000 € + Ordini 200.000 €</td><td>6,67 €200.000/60 setup = 3333,343333,33*10/10.000 unità = 3,33200.000/120 ordini = 1666,67(1666,67*20)/10000 = 3, 33</td><td>666,67 €</td></tr></table>

## Impatto sul pricing

Con il metodo tradizionale, il Custom sembra costare poco (55,81 € di indiretti per unità) e viene venduto con un mark-up apparentemente adeguato. Con l'ABC, il Custom costa 12 l'ABC, il Custom costa 12 volte di più in costi indiretti (666,67 €). Il prezzo di vendita potrebbe essere inferiore al costo pieno reale → il Custom è in perdita e viene sussidiato dallo Standard.


<!-- page 6 -->

Configurazione di costo e decisione di prezzo: una guida operativa

Non esiste un'unica configurazione "giusta" per il pricing. La scelta dipende dall'orizzonte temporale, dal contesto competitivo e dal tipo di decisione.

<table border="1"><tr><td>Situazione decisionale</td><td colspan="2">Configurazione di riferimento</td><td>Logica</td></tr><tr><td>Ordine speciale (breve periodo)</td><td>Costo variabile</td><td>$\rightarrow$ MdC > 0?</td><td>Se il MdC è positivo, l'ordine contribuisce a coprire i CF. Accettare se c'è c'è capacità inutilizzata.</td></tr><tr><td>Pricing di listino</td><td colspan="2">Costo pieno aziendale<br>+ mark-up (con ABC)</td><td>Il prezzo deve coprire tutti i costi nel medio periodo. L'ABC evita cross-cross-subsidization.</td></tr><tr><td>Gara d'appalto</td><td>Costo pieno industriale</td><td>come floor</td><td>Il prezzo minimo non deve scendere sotto il costo industriale; il mark-up dipende dalla competizione.</td></tr><tr><td>Sostenibilità lungo periodo</td><td colspan="2">Costo economico-tecnico</td><td>Deve remunerare anche il capitale proprio e il lavoro dell'imprenditore.</td></tr></table>

Nota: Il mark-up non è un numero arbitrario: deve riflettere il valore percepito dal cliente, la pressione competitiva e il rendimento atteso sul capitale investito.


<!-- page 7 -->

## Caso TechMilano S.r.l.: quando l'ABC rivela la verità sui margini

TechMilano S.r.l. è una PMI cloud milanese che offre due servizi: CloudBase (hosting standard, 500 clienti) e CloudPro (soluzioni personalizzate, 30 clienti). I costi indiretti totali ammontano a 600.000€/anno.

<table border=1><tr><td></td><td>Metodo Tradizionale(base: n. clienti)</td><td>Metodo ABC</td></tr><tr><td>Coefficiente</td><td>600.000 / 530 =1.132€/cliente</td><td>Basato su attività effettive</td></tr><tr><td>Costi indirettiCloudBase(500 clienti)</td><td>500 ×1.132 =566.038€</td><td>180.000€ (30%)</td></tr><tr><td>Costi indiretti CloudPro(30 clienti)</td><td>30 ×1.132 =33.962€</td><td>420.000€ (70%)</td></tr><tr><td>Costo indiretto per cliente CloudBase</td><td>1.132€</td><td>360€ (= 180.000/500 clienti)</td></tr><tr><td>Costo indiretto per cliente CloudPro</td><td>1.132€</td><td>14.000€</td></tr></table>

## Risultato ABC

CloudPro assorbe il 70% dei costi indiretti (personalizzazioni, supporto dedicato, gestione SLA, sviluppo custom) pur rappresentando solo il 5,7% dei clienti.

Il margine di CloudPro, che appariva positivo con il metodo tradizionale, è in realtà quasi nullo o negativo.

## Decisioni possibili

coun

Aumentare il prezzo di CloudPro per riflettere il costo reale delle delle attività assorbite.

coun

Standardizzare CloudPro riducendo le personalizzazioni e le di supporto.

coun

Abbandonare CloudPro e concentrarsi sul servizio CloudBase (più (più redditorial).


<!-- page 8 -->

## Sintesi: dalla classificazione dei costi alla decisione di prezzo

Il percorso logico della lezione collega quattro passaggi fondamentali: classificare i costi, scegliere la configurazione, allocare con il metodo appropriato e prendere decisioni di prezzo informate.

1

Classificazione

Diretti/Indiretti

Fissi/Variabili

→

2

Configurazione

Primo, Industriale

Pieno, Eco-Tecnico

→

3

Allocazione

Tradizionale

vs ABC

→

4

Decisione

Ordine speciale, Listino

Gara, Lungo periodo

<img src="images/bbox_53_590_81_626.jpg" />

## Relatività dei costi

La classificazione dei costi non è assoluta: dipende dall'oggetto di costo scelto e dall'orizzonte temporale di temporale di riferimento.

<img src="images/bbox_360_590_390_626.jpg" />

## Potenza dell'ABC

L'ABC supera i limiti dell'allocazione tradizionale attribuendo attribuendo i costi in base alle attività effettivamente consumate dai prodotti.

<img src="images/bbox_667_590_696_626.jpg" />

## Pericolo sussidi incrociati

Il cross-subsidization è il nemico silenzioso del pricing: senza pricing: senza ABC, i prodotti complessi vengono sotto-sotto-prezzati e quelli standard sopra-prezzati.

Riferimenti bibliografici:

• Cooper, R. & Kaplan, R.S. (1988). "Measure Costs Right: Make the Right Decisions." Harvard Business Review.

• Horngren, C.T., Datar, S.M. & Rajan, M.V. (2021). Cost Accounting: A Managerial Emphasis. Pearson.
