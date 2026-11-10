# Registro delle modifiche — app Rilievo

Le modifiche più recenti stanno in cima. Il registro completo fino al 9 novembre 2026 (valori, regole del
rilievo, simbologia, scale, script) è nel documento: https://claude.ai/artifact/KUbyUVj8aMznhWUcgayYdo

## 10 novembre 2026 — finestre incassate (palazzi antichi)

- Nel pannello della finestra, «Incassata»: No / A scalino / Strombata. La finestra ha due larghezze: la **luce**
  (parte stretta, dove sta l'infisso: è la larghezza che conta per il rapporto aeroilluminante) e la **parte larga**.
- La parte stretta è profonda 0,15 m dalla sua faccia (Impostazioni → «Finestre incassate: profondità della luce
  stretta»); il resto dello spessore è la parte larga. A scalino: due rettangoli. Strombata: i fianchi vanno in
  obliquo dal bordo largo al bordo della luce (anche nei contorni dei muri dello script).
- La parte larga sta di partenza verso la stanza; si gira con «⇅ Parte larga dall'altro lato» nel pannello o col
  tasto tondo accanto alla finestra selezionata.
- Misure: in pianta la casella della luce sta dalla sua faccia e quella della parte larga dall'altra (proposta
  20 cm per lato finché non la misuri). Le parziali sulla faccia larga arrivano al bordo largo. La **risega**
  (dal bordo largo al bordo della luce, a sinistra o in basso) si scrive nel pannello o con «Prossima»; senza
  risega la luce resta centrata.
- Simbolo: fili e vetri nella parte stretta, filo della faccia larga lungo la parte larga. Nello script la
  larghezza del vano si scrive «luce / parte larga» (es. 1.00 / 1.50). Prova `incassata`.

## 10 novembre 2026 — cambio di spessore di un muro

- Correzione: scegliendo «Altro spessore» nel pannello del muro, il muro poteva saltare da solo sull'incrocio di un
  altro muro (anche lontano) e restarci incollato; potevano rovinarsi anche gli incroci dei perimetrali. Succedeva
  perché la casella dello spessore partiva vuota e per un attimo il muro non aveva spessore.
- Ora la casella parte con lo spessore che il muro aveva (0,10 per un tramezzo, 0,30 per un perimetrale) e finché
  non c'è un numero valido il muro vale come tramezzo.
- Gli incroci doppi a pochi cm si uniscono solo quando li disegni. Se dopo rendi un muro più spesso, gli incroci
  restano dove sono: decidi tu con le misure. Prova `spessore`.

## 10 novembre 2026 — muri dritti allineati

- Un tramezzo dritto diviso da un incrocio (per esempio quello che prosegue lo spigolo del perimetrale e attraversa
  un altro tramezzo) ora ha tutti i tratti nella stessa posizione: prima il tratto attaccato al perimetrale andava
  a filo con la sua faccia e quello oltre l'incrocio restava centrato, con uno scalino di 10 cm.
- «Posizione» nel pannello del muro (Centrato / A filo a sinistra / A filo a destra) ora vale per tutto il muro
  dritto, non solo per il tratto toccato.
- Attesi aggiornati: `balc`, `balc2` (cambia solo il testo dell'avviso), `ext2`, `ext3` (il tramezzo che prosegue
  il parapetto oltre l'incrocio ora è allineato al parapetto, quindi cambiano le parziali di quel lato). Prova `linea`.

## 10 novembre 2026 — incroci doppi

- Correzione: quando un tramezzo a L girava accanto allo spigolo del perimetrale (a 5–15 cm), nascevano due
  incroci vicini invece di uno: il lato della stanza saltava il tramezzo. Ora due incroci dentro lo spessore dei muri
  diventano uno solo (si sposta quello dei muri più sottili). Vale anche per due tramezzi sfalsati di pochi cm
  sopra e sotto un altro tramezzo; da 15 cm in su restano due incroci separati.
- Correzione: il «muro a filo con lo spigolo» non parte più da uno spigolo che non ha muro dietro (prima poteva
  nascere un pezzetto di 5 cm e un muro sovrapposto a un altro).
- I rilievi già fatti si sistemano da soli all'apertura; le misure scritte restano. Prova `nodi`.

## 9 novembre 2026 — tramezzi che partono da un incrocio

- Correzione: un tramezzo che parte (o finisce) vicino a un incrocio di muri, per esempio dallo spigolo dove il
  perimetrale gira e prosegue un tramezzo, ora si attacca sempre al nodo dell'incrocio. Prima poteva restare
  «a filo con lo spigolo» con l'estremità libera a pochi cm: il lato della stanza accanto saltava il tramezzo e
  arrivava a quello dopo, e la misura lungo il tramezzo partiva 10 cm dentro il muro (es. 4,00 sopra e 3,90 sotto).
- Il «muro a filo con lo spigolo» resta solo fuori dall'edificio (parapetti, muretti che proseguono la facciata).
- Anche un tramezzo che si ferma pochi cm prima di un incrocio (fino a 20 cm dalla faccia) si attacca al nodo.
- I rilievi già fatti con questo difetto si sistemano da soli all'apertura; le misure già scritte restano.
  Prova `incrocio`.

## 9 novembre 2026 — linee dritte a mano

- Note a mano: finisci la linea e **tieni ferma la penna mezzo secondo**: la linea diventa dritta (piccola
  vibrazione). Si aggancia a orizzontale, verticale e ai multipli di 15° (45°, 30°, 60°…) se ci sei vicino
  entro 6°; tenendo premuto puoi ancora spostare la fine. Gli estremi si agganciano agli spigoli dei muri
  (l'inizio anche alle facce). La scrittura resta a mano: un tratto più corto di 30 px o troppo curvo non si
  raddrizza. Prova `orto`.

## 9 novembre 2026 — nuova grafica delle misure

- Correzione: dove un tramezzo si attacca a un perimetrale la linea del perimetrale resta chiusa (anche nello
  script: i contorni dei perimetrali sono polilinee chiuse, il tramezzo si ferma sulla faccia). Attesi di `shot35`
  aggiornati (cambia solo la lunghezza dello script).

- Correzione: la casella della larghezza di una porta che cade dentro lo spicchio dell'anta ora si tocca
  (prima vinceva la selezione della porta). Prova `boxporta`.

- Misure in pianta come linee di quota (trattini agli estremi, numero sopra, lucchetto sulle misure prese).
  I tratti ancora da misurare sono pallini arancioni; le misure ricavate e le caselle da riempire compaiono
  toccando la stanza o il muro. Valori proposti delle larghezze nascosti (pallino) finché non tocchi la stanza.
- Nomi delle stanze piazzati prima delle quote e rimpiccioliti nelle stanze strette; numeri che non entrano
  nel tratto escono con una linea di richiamo.
- «Prossima» nella barra: misura guidata stanza per stanza, in senso orario dall'alto a sinistra; la finestra
  della misura si mette dalla parte opposta al tratto, con «Salta»; ✕ ferma la guida; il numero tra parentesi
  dice quante misure interne mancano.
- Interruttore in Impostazioni → Pianta: «Misure con la grafica classica» (vale per il dispositivo).
  Le prove p1, p2, pop, bk e scp girano con la grafica classica; mn prova quella nuova.

## 9 novembre 2026 — passaggio a Claude Code

- Il progetto passa nel repository: sorgente (`index.html`), prove automatiche (`test/`), istruzioni per
  Claude (`CLAUDE.md`) e questo registro.
- Rotazione della vista a passi di 90° con le due frecce curve in alto a destra della tavola (come il cubo di
  AutoCAD); al centro l'angolo attuale, toccandolo si torna a 0°. Le scritte restano leggibili; misure, script
  ed esportazioni non cambiano; la rotazione resta salvata nel rilievo.
- Aperture che sembravano cancellarsi dopo le misure: quelle con posizione proposta rientrano nel muro,
  quelle con distanza scritta restano visibili in rosso tratteggiato con l'avviso «esce dal muro».
- Muro a filo diviso da un muro nuovo: i due tratti restano allineati; il muro che si attacca a T parte dalla
  faccia del muro a filo, senza pezzetto che sporge dall'altra parte.

## 8 novembre 2026

- Parziali dei lati con una scala accostata («dal muro alla scala», «dalla scala al muro»).
- Menu «Note» con «A mano» (penna o dito), «Testo» e «Gomma».
