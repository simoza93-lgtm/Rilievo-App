# Registro delle modifiche — app Rilievo

Le modifiche più recenti stanno in cima. Il registro completo fino al 9 novembre 2026 (valori, regole del
rilievo, simbologia, scale, script) è nel documento: https://claude.ai/artifact/KUbyUVj8aMznhWUcgayYdo

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
