# Rilievo sopralluogo — istruzioni per Claude

App per i rilievi sul campo dello studio tecnico di Simone (geometra, Tortoreto, studio di 2 persone).
Si usa sul tablet Xiaomi Pad 8, con la penna o il dito, installata come PWA da GitHub Pages:
https://simoza93-lgtm.github.io/Rilievo-App/

Simone non è un programmatore. Parla e scrivi sempre in **italiano semplice**, con parole da cantiere e da
studio tecnico, non da informatico. Misure sempre in **metri con due decimali** (es. 1,20 m).

## Come lavorare con Simone

- Prima di un lavoro grande fai **tutte le domande insieme, all'inizio**. Poi lavora a tappe e fagli vedere
  il risultato a ogni tappa.
- Quando fa domande («si può fare…?», «conviene…?») cerca online prima di rispondere e cita le fonti.
- Bug trovati sul campo: rifai il caso con una prova in `test/`, correggi e verifica che la prova passi.
- A fine lavoro: lancia le prove, fai il commit con un messaggio in italiano e il push su `main`
  (GitHub Pages pubblica da `main`, cartella principale). Dopo il push l'app sul tablet si aggiorna
  riaprendola con internet attivo.
- Annota ogni modifica in `REGISTRO.md` (in cima, con la data): cosa cambia per chi usa l'app e i valori nuovi.
  Il registro storico fino al 9 novembre 2026 è qui: https://claude.ai/artifact/KUbyUVj8aMznhWUcgayYdo

## File

- `index.html` — **tutta l'app** in un solo file (HTML, CSS e JavaScript, senza librerie e senza build).
  Contiene anche il collegamento al manifest e la registrazione del service worker (attiva solo in https o localhost).
- `sw.js` — service worker: l'app funziona anche offline. Per la pagina usa `fetch(..., {cache:'no-cache'})`,
  quindi un nuovo `index.html` arriva da solo. Cambia `CACHE` (oggi `rilievo-v2`) solo se cambiano icone o manifest.
- `manifest.webmanifest`, `icons/` — installazione come app (nome «Rilievo sopralluogo», colore #1f5fbf).
- `_config.yml`, `.nojekyll` — impostazioni di GitHub Pages.
- `test/` — prove automatiche (vedi sotto).

## Prove automatiche

    npm install
    npx playwright install chromium
    npm test                      # tutte le prove (2-3 minuti)
    node test/run.js p1 rot       # solo alcune

Ogni prova apre `index.html` in Chromium, fa delle azioni e stampa dei risultati. `test/run.js` confronta
l'uscita con `test/attesi/<nome>.txt`; gli id casuali vengono normalizzati. Immagini e script di prova
finiscono in `test/out/` (non va nel repository).

- **Prima di ogni commit tutte le prove devono risultare «ok».**
- Se una prova cambia perché il comportamento è cambiato **di proposito**, controlla la differenza, spiegala
  a Simone e solo dopo aggiorna gli attesi con `node test/run.js --aggiorna <nome>`.
- Per ogni funzione nuova o bug corretto aggiungi una prova nuova (copia lo schema di `split.js` o `apfit.js`).
- Le prove `shot35`–`shot41` riguardano le scale, `p1`–`p5` le parziali, `ang*` gli angoli disegnati in due
  tratti, `balc*` i balconi e i parapetti a filo, `rot` la rotazione della vista, `mano` le note a mano, `orto` le linee a mano raddrizzate,
  `scp` le parziali delle scale, `split*` i muri divisi, `apfit` le aperture che non entrano nel muro.

## Regole del rilievo (non cambiarle senza chiedere)

- **Lo schizzo dà solo la forma**: quali muri, come sono collegati, da che parte stanno. Le lunghezze disegnate
  non diventano mai numeri: i numeri vengono solo dalle misure scritte.
- **Le misure interne comandano** sempre su quelle esterne; le esterne servono solo da verifica
  (avviso «Verifica esterna»).
- Le misure già inserite restano bloccate nell'ordine di inserimento; una nuova misura che non torna con le
  precedenti non sposta niente e compare in rosso «NON APPLICATA».
- Tolleranza perché una misura «torni»: **0,03 m** (`TOL`); sotto è fuori squadra accettato.
- Sui lati interni con porte o finestre si scrivono le **parziali** (spigolo → vano → vano → spigolo);
  il totale interno si mette a parte con «Quota». Una scala accostata a un lato lo divide allo stesso modo.
- Posizione e larghezza di un'apertura appena posata sono **proposte** (`ap.dp`, `ap.lp`) finché non si
  scrivono le misure; le proposte possono essere spostate dall'app, le misure no.
- Spessori predefiniti: perimetrali 0,30 m, tramezzi 0,10 m.

## Regole dello script AutoCAD (.scr per AutoCAD LT 2022, niente AutoLISP, niente DXF)

- Unità metri, stampa 1:100. Layer `PLAN_MURI_PERIM` (colore 7, 0,30), `PLAN_MURI_INT` (colore 2, 0,13),
  `PLAN_INFISSI_TESTI` (colore 1, 0,05). Stile di testo e di quota `STUDIO` (Arial).
- Quote: testo 0,17, freccia 0,13, offset testo 0,09, estensione 0,18 e 0,06, linee di estensione soppresse,
  2 decimali. Parziali a 0,40 m dentro l'ambiente; quote esterne d'ingombro a 1,00 m.
- Infissi: finestra = due linee sui fili + linee a 0,125 verso il centro; porta-finestra = linea esterna,
  linea centrale, offset 0,125 e linea perpendicolare lunga 1,00 a metà vano; ingresso = linea esterna +
  triangolo d'entrata; porta = anta 0,06 e arco a 90°, girate come in pianta (opzione nelle Impostazioni).
- Scale: oltre 1,40 m dal pavimento tratteggiate; numeri dei gradini solo nello schizzo, mai nello script.
- In chiusura lo script riattiva gli osnap dello studio (OSMODE 1703, AUTOSNAP 63).

## Come è fatto il codice (in `index.html`)

Lo stato è nell'oggetto `R` (il rilievo, con `R.piani`) e `ui` (la vista). `piano()` è il piano aperto.
Muri `pl.walls` (nodi `a`/`b`, `tipo` P/T/X, `sp`, `filo`, aperture `ap`), nodi `pl.nodes`, scale
`pl.stairs`, quote libere `pl.dims`, note `pl.notes`, note a mano `pl.ink`, Nord `pl.nord`, sfondo `pl.bg`.
Tutti i muri sono orizzontali o verticali (le coordinate del mondo hanno la y verso l'alto).

- `topo(pl)` — collegamenti tra muri, spostamento dei muri a filo (`offs`), estensioni agli spigoli (`da`/`db`).
- `runsOf(pl, T)` — i «lati»: file di muri allineati misurate da un muro all'altro, per ciascuna faccia.
- `solve(pl, ext)` — minimi quadrati per asse con le misure in ordine (`mord`, `REJ`, `detD`).
- `apAnchors` / `placeAps` — posizione delle aperture da parziali (`ap.pos`), dalla fine del lato (`pl.fl`)
  o proposta (`ap.d`); `placeAps` riporta dentro il muro le aperture proposte che non ci stanno più.
- `geometry(pl)` → `G` — rettangoli dei muri, aperture (`G.ops`), lati con parziali (`r.chain.pcs`),
  ambienti (`G.comps`), avvisi (`G.warns`, `G.errs`). `update(true)` ricalcola tutto e ridisegna.
- `draw()` — disegna l'SVG dentro il gruppo `#vg` (ruotato con `rotT()` se la vista è girata);
  `pos(e)` riporta i tocchi nelle coordinate della vista con `rotPt`. `SX/SY/WX/WY` convertono mondo ↔ vista.
- `mbox` / `freeAt` — caselle delle misure (scala `ui.bk` legata allo zoom); `openInline(hb)` — finestra
  «Modifica misura» con tastierino.
- `finishStroke` — trasforma il tratto disegnato in muri (agganci, `autoFilo`, `splitWall`, `fixCapGlue`).
- `stairPrims`, `anchorStair`, `applyAnchor`, `stairHits` — scale, aggancio ai muri e parziali delle scale.
- `measItems()` — tutti i tratti interni da quotare (lati, parziali, larghezze) con stato `m` misurato,
  `d` ricavato, `x` da misurare; li usano la grafica nuova delle misure (`ui.mnew`, preferenza
  `rilievo-mstile` nel localStorage, «classico» per la grafica a caselle) e la misura guidata
  (`startGuide`, `guideNext`, `ui.guide`). `focusComps()` dice quali stanze mostrano anche ricavate e caselle.
- `genScript(pl)` — lo script `.scr`.

Salvataggio: `localStorage` per i rilievi, IndexedDB `rilievo-foto` (store foto e `sfondi`) per foto e
planimetrie di sfondo. Non cambiare i formati dei dati senza una conversione per i rilievi già salvati:
sul tablet ci sono rilievi veri.
