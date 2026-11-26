// Dalla schermata del 26 novembre 2026: niente quota esterna sui muri interni (anche da 0,30) e quote esterne a 1 m dall'elemento più esterno.
const APP = require('url').pathToFileURL(require('path').resolve(__dirname, '..', 'index.html')).href;
const OUT = require('path').join(__dirname, 'out'); require('fs').mkdirSync(OUT, {recursive: true});
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({viewport:{width:1280, height:854}});
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto(process.argv[2] || APP); await p.evaluate(() => localStorage.clear()); await p.reload(); await p.waitForTimeout(300);
  await p.click('#bFull'); await p.waitForTimeout(200);
  await p.evaluate(() => { const st = (pts, tipo) => { ui.newType = tipo; const s = []; for (let i = 0; i < pts.length - 1; i++) { const a = pts[i], c = pts[i + 1]; for (let k = 0; k < 6; k++) s.push([SX(a[0] + (c[0] - a[0]) * k / 6), SY(a[1] + (c[1] - a[1]) * k / 6)]); } s.push([SX(pts[pts.length - 1][0]), SY(pts[pts.length - 1][1])]); finishStroke(s); update(true); };
    R = blank(); R.id = 'qf'; tab = 'pianta'; render(); ui.view = {x:-3, y:-9, s:55}; G = geometry(piano());
    st([[0,0],[7,0],[7,3.5],[0,3.5],[0,0]], 'P'); st([[0,3.5],[0,6],[7,6],[7,3.5]], 'P'); st([[3,3.5],[3,6]], 'T'); st([[7,0],[9,0],[9,6],[7,6]], 'P');
    ui.sel = null; ui.mode = 'select'; ui.fitted = false; render(); fit(); draw(); });
  // distanza di ogni linea di quota esterna dall'elemento più esterno, e se sta tutta nello schermo
  const stato = () => p.evaluate(() => { const E = quoteFuori(piano()).E; return G.facs.map(f => { const n = f.nome + ' ' + f2(f.tot); if (f.interno) return n + ': interna, ' + (ui.fbb.has(f.key) ? 'CON quota' : 'no quota'); const bx = ui.fbb.get(f.key); if (!bx) return n + ': NON disegnata';
      const c = f.H ? WY(bx[1] + bx[3] / 2) : WX(bx[0] + bx[2] / 2), edge = E[f.H ? (f.out > 0 ? 3 : 1) : (f.out > 0 ? 2 : 0)], d = (c - edge) * f.out, dentro = bx[0] >= 0 && bx[1] >= 0 && bx[0] + bx[2] <= ui.W && bx[1] + bx[3] <= ui.H;
      return n + ': a ' + (d >= 0.99 && d <= 1.6 ? 'un metro' : d.toFixed(2)) + ' dal filo ' + f2(edge) + (dentro ? '' : ' FUORI SCHERMO'); }).sort(); });
  console.log('muro in mezzo da 0,30\n  ' + (await stato()).join('\n  '));
  await p.screenshot({path:require('path').join(OUT, 'quotefuori.png')});
  console.log('pannello del muro interno, totali di facciata:', await p.evaluate(() => { const f = G.facs.find(f => f.interno); if (!f) return 'nessun muro interno'; ui.sel = {k:'w', id:f.walls[0].id}; renderSide(); const r = [...document.querySelectorAll('h3')].some(h => /· totali$/.test(h.textContent)); ui.sel = null; renderSide(); return r; }));
  // una scala che sporge a destra sposta le quote di destra oltre di lei
  await p.evaluate(() => { const pl = piano(); (pl.stairs = pl.stairs || []).push(newStair('dritta', 10, 2)); update(true); fit(); draw(); });
  console.log('con una scala fuori a destra\n  ' + (await stato()).filter(x => /destra/.test(x)).join('\n  '));
  // stanza a destra segnata come balcone: il muro verso la casa torna facciata, quotata verso il balcone
  await p.evaluate(() => { piano().stairs = []; update(true); const r = piano().rooms.slice().sort((a, b) => G.comps[b._c].bbox[2] - G.comps[a._c].bbox[2])[0]; r.dest = 'Balcone'; update(true); fit(); draw(); });
  console.log('stanza di destra come balcone\n  ' + (await stato()).join('\n  '));
  await p.screenshot({path:require('path').join(OUT, 'quotefuori-balcone.png')});
  console.log('errors', errs); await b.close();
})();
