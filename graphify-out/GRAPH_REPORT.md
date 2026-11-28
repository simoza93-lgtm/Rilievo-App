# Graph Report - Rilievo-App  (2026-11-28)

## Corpus Check
- 107 files · ~164,337 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 5 file(s) not represented in the graph (top: (none) 3, .webmanifest 1, .dxf 1)

## Summary
- 390 nodes · 396 edges · 98 communities (9 shown, 89 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 6 edges (avg confidence: 0.75)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `59c6737a`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- sezione.js
- playwright
- Prodotto, DXF e pubblicazione
- Motore di misura e geometria
- Configurazione npm e test
- Gruppo 5
- Gruppo 6
- impostazionipiani.js
- Ponytail
- ext3.js
- anta3.js
- Prova apfit.js
- anta.js
- Prova balc.js
- filo3.js
- Prova balc3.js
- run.js
- Prova boxporta.js
- dxf2.js
- mano.js
- obliqui.js
- Prova ext1.js
- Prova ext2.js
- bg.js
- incassata.js
- full.js
- incrocio.js
- orto.js
- Prova layer.js
- Prova lift.js
- pianer.js
- sezione2.js
- linea.js
- balc2.js
- inclina.js
- split2.js
- nodi.js
- Prova p4.js
- Prova p5.js
- Prova paral.js
- allinea.js
- mn.js
- ang2.js
- apobl.js
- piani.js
- dx.js
- pilastro.js
- Prova scasc.js
- Prova scheda.js
- quotefuori.js
- pop.js
- scalepan.js
- sagoma.js
- scheda2.js
- shot38.js
- eliminaambiente.js
- Prova taglia.js
- scp.js
- Prova win4.js
- Gruppo 59
- Gruppo 60
- Prova sw.js
- totali.js
- shot37.js
- gradini.js
- tbar.js
- shot41.js
- shot35.js
- shot39.js
- split.js
- zoom.js
- ang.js
- bk.js
- diagonali.js
- dxf.js
- linee.js
- grafica.js
- porte.js
- scalegr.js
- selsing.js
- zoomambiente.js
- rot.js
- pacchetto.js
- spessore.js
- gnporta.js
- CLAUDE.md
- spostapiani.js
- spostasel.js
- sezione3.js
- sezione6.js
- sezione4.js
- sezione7.js
- anello.js
- portastrombata.js
- superfici2.js
- ringhiera.js
- scrobl.js
- sezione5.js

## God Nodes (most connected - your core abstractions)
1. `playwright` - 100 edges
2. `Architettura del codice in index.html` - 8 edges
3. `Importa DXF (tappe 1-3 e scale a righe singole)` - 5 edges
4. `Muri obliqui (tappe 1-4)` - 5 edges
5. `Regole del rilievo` - 5 edges
6. `Ponytail` - 4 edges
7. `index.html (tutta l'app in un file)` - 4 edges
8. `REGISTRO.md registro delle modifiche` - 4 edges
9. `casa()` - 3 edges
10. `scripts` - 3 edges

## Surprising Connections (you probably didn't know these)
- `Rotazione della vista a 90 gradi` --references--> `Architettura del codice in index.html`  [INFERRED]
  REGISTRO.md → CLAUDE.md
- `Muri obliqui (tappe 1-4)` --references--> `polygon-clipping 0.15.7`  [EXTRACTED]
  REGISTRO.md → CLAUDE.md
- `Importa DXF (tappe 1-3 e scale a righe singole)` --conceptually_related_to--> `Regole dello script AutoCAD (.scr)`  [INFERRED]
  REGISTRO.md → CLAUDE.md
- `Quote allineate dei muri obliqui nello script` --references--> `Regole dello script AutoCAD (.scr)`  [EXTRACTED]
  REGISTRO.md → CLAUDE.md
- `Come lavorare con Simone` --references--> `REGISTRO.md registro delle modifiche`  [EXTRACTED]
  CLAUDE.md → REGISTRO.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Flusso Importa DXF** — registro_importa_dxf, registro_dxf_unita_layer, registro_dxf_aperture, registro_dxf_scale [EXTRACTED 0.95]
- **Muri obliqui e correzioni collegate** — registro_muri_obliqui, registro_diagonali_fuori_squadra, registro_sistema_inclinando, registro_script_quote_obliqui [INFERRED 0.85]
- **Famiglia scale e ascensore** — registro_scale_ascensore, registro_scale_pianerottoli, registro_gradini_ritoccati [INFERRED 0.85]

## Communities (98 total, 89 thin omitted)

### Community 1 - "playwright"
Cohesion: 0.18
Nodes (6): playwright, { chromium }, { chromium }, { chromium }, { chromium }, { chromium }

### Community 2 - "Prodotto, DXF e pubblicazione"
Cohesion: 0.09
Nodes (23): genScript(pl), Pubblicazione GitHub Pages da main, index.html (tutta l'app in un file), Come lavorare con Simone, polygon-clipping 0.15.7, Prove automatiche (test/, Playwright), App Rilievo sopralluogo (PWA), Regole dello script AutoCAD (.scr) (+15 more)

### Community 3 - "Motore di misura e geometria"
Cohesion: 0.13
Nodes (11): Architettura del codice in index.html, finishStroke, measItems() / misura guidata, solve() minimi quadrati, Parziali (spigolo-vano-spigolo), Regole del rilievo, Salvataggio localStorage e IndexedDB, Tolleranza TOL 0,03 m (+3 more)

### Community 4 - "Configurazione npm e test"
Cohesion: 0.20
Nodes (9): description, devDependencies, playwright@^1.48.0, name, private, scripts, test, test:aggiorna (+1 more)

### Community 6 - "Gruppo 6"
Cohesion: 0.67
Nodes (3): Layer fissi (accendi, spegni, blocca), Sagoma di un altro piano e allineamento, Gruppo Disegno: Linea, Costruzione, Parallela, Taglia, Estendi

### Community 8 - "Ponytail"
Cohesion: 0.40
Nodes (4): Before you write, Levels, Ponytail, The smallest complete change

### Community 16 - "run.js"
Cohesion: 0.09
Nodes (16): { chromium }, fs, OUT, path, { chromium }, fs, OUT, path (+8 more)

### Community 18 - "dxf2.js"
Cohesion: 0.28
Nodes (5): casa(), { chromium }, LW(), LY, rc()

### Community 82 - "pacchetto.js"
Cohesion: 0.06
Nodes (20): { chromium }, fs, OUT, { chromium }, fs, OUT, { chromium }, fs (+12 more)

## Knowledge Gaps
- **19 isolated node(s):** `sw.js service worker`, `Pubblicazione GitHub Pages da main`, `Simone (geometra, utente non programmatore)`, `DXF: riconoscimento porte, finestre e varchi`, `Gradini ritoccati a mano` (+14 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 258 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **89 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `playwright` connect `playwright` to `sezione.js`, `Configurazione npm e test`, `impostazionipiani.js`, `ext3.js`, `anta3.js`, `Prova apfit.js`, `anta.js`, `Prova balc.js`, `filo3.js`, `Prova balc3.js`, `run.js`, `Prova boxporta.js`, `dxf2.js`, `mano.js`, `obliqui.js`, `Prova ext1.js`, `Prova ext2.js`, `bg.js`, `incassata.js`, `full.js`, `incrocio.js`, `orto.js`, `Prova layer.js`, `Prova lift.js`, `pianer.js`, `sezione2.js`, `linea.js`, `balc2.js`, `inclina.js`, `split2.js`, `nodi.js`, `Prova p4.js`, `Prova p5.js`, `Prova paral.js`, `allinea.js`, `mn.js`, `ang2.js`, `apobl.js`, `piani.js`, `dx.js`, `pilastro.js`, `Prova scasc.js`, `Prova scheda.js`, `quotefuori.js`, `pop.js`, `scalepan.js`, `sagoma.js`, `scheda2.js`, `shot38.js`, `eliminaambiente.js`, `Prova taglia.js`, `scp.js`, `Prova win4.js`, `totali.js`, `shot37.js`, `gradini.js`, `tbar.js`, `shot41.js`, `shot35.js`, `shot39.js`, `split.js`, `zoom.js`, `ang.js`, `bk.js`, `diagonali.js`, `dxf.js`, `linee.js`, `grafica.js`, `porte.js`, `scalegr.js`, `selsing.js`, `zoomambiente.js`, `rot.js`, `pacchetto.js`, `spessore.js`, `gnporta.js`, `spostapiani.js`, `spostasel.js`, `sezione3.js`, `sezione6.js`, `sezione4.js`, `sezione7.js`, `anello.js`, `portastrombata.js`, `superfici2.js`, `ringhiera.js`, `scrobl.js`, `sezione5.js`?**
  _High betweenness centrality (0.701) - this node is a cross-community bridge._
- **What connects `sw.js service worker`, `Pubblicazione GitHub Pages da main`, `Simone (geometra, utente non programmatore)` to the rest of the system?**
  _19 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Prodotto, DXF e pubblicazione` be split into smaller, more focused modules?**
  _Cohesion score 0.08666666666666667 - nodes in this community are weakly interconnected._
- **Why does `Architettura del codice in index.html` connect `Motore di misura e geometria` to `Prodotto, DXF e pubblicazione`?**
  _High betweenness centrality (0.006) - this node is a cross-community bridge._
- **Should `Motore di misura e geometria` be split into smaller, more focused modules?**
  _Cohesion score 0.13333333333333333 - nodes in this community are weakly interconnected._
- **Should `run.js` be split into smaller, more focused modules?**
  _Cohesion score 0.08695652173913043 - nodes in this community are weakly interconnected._
- **Should `pacchetto.js` be split into smaller, more focused modules?**
  _Cohesion score 0.06451612903225806 - nodes in this community are weakly interconnected._