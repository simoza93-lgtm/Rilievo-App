// Ambiente selezionato: zoom automatico sull'ambiente (nello spazio libero a sinistra del pannello), icona per spegnere il pannello, deselezione = tutta la pianta.
const APP = require('url').pathToFileURL(require('path').resolve(__dirname, '..', 'index.html')).href;
const OUT = require('path').join(__dirname, 'out'); require('fs').mkdirSync(OUT, {recursive: true});
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({viewport:{width:1400, height:950}});
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto(process.argv[2] || APP); await p.evaluate(() => localStorage.clear()); await p.reload();
  await p.evaluate(() => { R = blank(); R.id = 'za'; tab = 'pianta'; render(); const pl = piano(); ui.view = {x:-1, y:-1, s:60}; G = geometry(pl);
    const st = (pts, tipo) => { ui.newType = tipo; const sp = []; for (let i = 0; i < pts.length - 1; i++) { const a = pts[i], c = pts[i + 1]; for (let k = 0; k < 8; k++) sp.push([SX(a[0] + (c[0] - a[0]) * k / 8), SY(a[1] + (c[1] - a[1]) * k / 8)]); } sp.push([SX(pts[pts.length - 1][0]), SY(pts[pts.length - 1][1])]); finishStroke(sp); };
    ui.mode = 'select'; st([[0,0],[10,0],[10,4],[0,4],[0,0]], 'P'); st([[3,0],[3,4]], 'T'); update(true); updTools(); fit(); draw(); });
  await p.click('#bFull'); await p.waitForTimeout(300);
  const st = () => p.evaluate(() => { const b = document.body.classList, v = ui.view, c = G.comps.find(c => c.rec && ui.sel && c.rec.id === ui.sel.id), bb = c && c.bbox, pw = b.contains('sidoff') ? 0 : Math.min(380, innerWidth * 0.44) + 24, cx = bb ? Math.round((SX(bb[0]) + SX(bb[2])) / 2) : 0;
    return {scala:+v.s.toFixed(1), sel:ui.sel ? ui.sel.k : null, pannello:b.contains('hassel'), spento:b.contains('sidoff'), icona:document.querySelector('#bPamb').classList.contains('on'), salvata:localStorage.getItem('rilievo-pamb'),
      ambienteDentro:bb ? SX(bb[0]) >= 0 && SX(bb[2]) <= ui.W - pw && SY(bb[3]) >= 0 && SY(bb[1]) <= ui.H : null, centro:bb ? (cx - (ui.W - pw) / 2 < 2 ? 'al centro dello spazio libero' : 'spostato ' + cx) : null}; });
  const tocca = async (wx, wy) => { const r = await p.evaluate(([wx, wy]) => { const b = document.querySelector('#svg').getBoundingClientRect(); return [b.left + SX(wx), b.top + SY(wy)]; }, [wx, wy]); await p.mouse.click(r[0], r[1]); await p.waitForTimeout(200); };
  const piano0 = await p.evaluate(() => +ui.view.s.toFixed(1));
  console.log('pianta intera, scala', piano0);
  await tocca(8, 2); console.log('ambiente grande', JSON.stringify(await st()));
  await p.screenshot({path:require('path').join(OUT, 'zoomambiente-acceso.png')});
  await p.evaluate(() => { const r = piano().rooms.find(r => r.id !== ui.sel.id); ui.sel = {k:'r', id:r.id}; draw(); renderSide(); }); console.log('passa all\'altro', JSON.stringify(await st()));
  await p.click('#bPamb'); await p.waitForTimeout(200); console.log('pannello spento', JSON.stringify(await st()));
  await p.screenshot({path:require('path').join(OUT, 'zoomambiente-spento.png')});
  await p.evaluate(() => { const c = G.comps.find(c => c.rec && c.rec.id === ui.sel.id); window.__bb = c.bbox; }); { const bb = await p.evaluate(() => window.__bb); await tocca((bb[0] + bb[2]) / 2, bb[3] + 0.6); } const f = await p.evaluate(() => { const v = ui.view; fit(); const e = {s:+ui.view.s.toFixed(1)}; return e; });
  console.log('deselezionato', JSON.stringify(await st()), '| intera:', f.s);
  await p.reload(); await p.waitForTimeout(300); console.log('dopo f5, preferenza', await p.evaluate(() => ui.pamb));
  console.log('errors', errs); await b.close();
})();
