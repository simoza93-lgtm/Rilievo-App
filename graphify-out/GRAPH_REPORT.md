# Graph Report - Rilievo GitHub  (2026-11-27)

## Corpus Check
- 84 files · ~131,767 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 5 file(s) not represented in the graph (top: (none) 2, .dxf 2, .webmanifest 1)

## Summary
- 313 nodes · 315 edges · 68 communities (8 shown, 60 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 6 edges (avg confidence: 0.75)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `eb192ad3`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Prove di test (p1-p3...)
- playwright
- Prodotto, DXF e pubblicazione
- Motore di misura e geometria
- Configurazione npm e test
- Gruppo 5
- Gruppo 6
- Prova allinea.js
- run.js
- ext3.js
- anta.js
- Prova apfit.js
- Prova apobl.js
- Prova balc.js
- filo3.js
- Prova balc3.js
- Prova bk.js
- Prova boxporta.js
- dxf2.js
- Prova dx.js
- Prova dxf.js
- Prova ext1.js
- Prova ext2.js
- bg.js
- ang.js
- Prova gradini.js
- diagonali.js
- Prova incrocio.js
- Prova layer.js
- Prova lift.js
- linee.js
- nodi.js
- linea.js
- balc2.js
- grafica.js
- Prova obliqui.js
- Prova orto.js
- Prova p4.js
- Prova p5.js
- Prova paral.js
- Prova pianer.js
- porte.js
- scheda2.js
- rot.js
- Prova sagoma.js
- mano.js
- pilastro.js
- Prova scasc.js
- Prova scheda.js
- quotefuori.js
- pop.js
- scalepan.js
- Prova shot39.js
- scalegr.js
- selsing.js
- Prova split2.js
- Prova taglia.js
- scp.js
- Prova win4.js
- Gruppo 59
- Gruppo 60
- Prova sw.js
- totali.js
- shot37.js
- spessore.js
- tbar.js
- shot41.js
- split.js

## God Nodes (most connected - your core abstractions)
1. `playwright` - 80 edges
2. `Architettura del codice in index.html` - 8 edges
3. `Importa DXF (tappe 1-3 e scale a righe singole)` - 5 edges
4. `Muri obliqui (tappe 1-4)` - 5 edges
5. `Regole del rilievo` - 5 edges
6. `index.html (tutta l'app in un file)` - 4 edges
7. `REGISTRO.md registro delle modifiche` - 4 edges
8. `casa()` - 3 edges
9. `scripts` - 3 edges
10. `Scale e ascensore (pannello, attorno all'ascensore, ascensore da solo)` - 3 edges

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

## Communities (68 total, 60 thin omitted)

### Community 0 - "Prove di test (p1-p3...)"
Cohesion: 0.10
Nodes (15): { chromium }, fs, OUT, { chromium }, fs, OUT, { chromium }, fs (+7 more)

### Community 1 - "playwright"
Cohesion: 0.05
Nodes (25): playwright, { chromium }, { chromium }, OUT, {chromium}, OUT, { chromium }, { chromium } (+17 more)

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

### Community 8 - "run.js"
Cohesion: 0.17
Nodes (8): all, args, ATT, fs, only, path, { spawnSync }, upd

### Community 18 - "dxf2.js"
Cohesion: 0.28
Nodes (5): casa(), { chromium }, LW(), LY, rc()

## Knowledge Gaps
- **19 isolated node(s):** `sw.js service worker`, `Pubblicazione GitHub Pages da main`, `Simone (geometra, utente non programmatore)`, `DXF: riconoscimento porte, finestre e varchi`, `Gradini ritoccati a mano` (+14 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 203 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **60 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `playwright` connect `playwright` to `Prove di test (p1-p3...)`, `Configurazione npm e test`, `Prova allinea.js`, `ext3.js`, `anta.js`, `Prova apfit.js`, `Prova apobl.js`, `Prova balc.js`, `filo3.js`, `Prova balc3.js`, `Prova bk.js`, `Prova boxporta.js`, `dxf2.js`, `Prova dx.js`, `Prova dxf.js`, `Prova ext1.js`, `Prova ext2.js`, `bg.js`, `ang.js`, `Prova gradini.js`, `diagonali.js`, `Prova incrocio.js`, `Prova layer.js`, `Prova lift.js`, `linee.js`, `nodi.js`, `linea.js`, `balc2.js`, `grafica.js`, `Prova obliqui.js`, `Prova orto.js`, `Prova p4.js`, `Prova p5.js`, `Prova paral.js`, `Prova pianer.js`, `porte.js`, `scheda2.js`, `rot.js`, `Prova sagoma.js`, `mano.js`, `pilastro.js`, `Prova scasc.js`, `Prova scheda.js`, `quotefuori.js`, `pop.js`, `scalepan.js`, `Prova shot39.js`, `scalegr.js`, `selsing.js`, `Prova split2.js`, `Prova taglia.js`, `scp.js`, `Prova win4.js`, `totali.js`, `shot37.js`, `spessore.js`, `tbar.js`, `shot41.js`, `split.js`?**
  _High betweenness centrality (0.679) - this node is a cross-community bridge._
- **What connects `sw.js service worker`, `Pubblicazione GitHub Pages da main`, `Simone (geometra, utente non programmatore)` to the rest of the system?**
  _19 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Prove di test (p1-p3...)` be split into smaller, more focused modules?**
  _Cohesion score 0.09523809523809523 - nodes in this community are weakly interconnected._
- **Why does `Architettura del codice in index.html` connect `Motore di misura e geometria` to `Prodotto, DXF e pubblicazione`?**
  _High betweenness centrality (0.009) - this node is a cross-community bridge._
- **Should `playwright` be split into smaller, more focused modules?**
  _Cohesion score 0.04878048780487805 - nodes in this community are weakly interconnected._
- **Should `Prodotto, DXF e pubblicazione` be split into smaller, more focused modules?**
  _Cohesion score 0.08666666666666667 - nodes in this community are weakly interconnected._
- **Should `Motore di misura e geometria` be split into smaller, more focused modules?**
  _Cohesion score 0.13333333333333333 - nodes in this community are weakly interconnected._