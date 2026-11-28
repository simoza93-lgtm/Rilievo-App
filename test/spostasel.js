// Oggetto selezionato a schermo intero (ascensore, finestra...): se starebbe sotto il pannello, la pianta scorre a sinistra senza cambiare zoom.
const APP = require('url').pathToFileURL(require('path').resolve(__dirname, '..', 'index.html')).href;
const OUT = require('path').join(__dirname, 'out'); require('fs').mkdirSync(OUT, {recursive: true});
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({viewport:{width:1400, height:950}});
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto(process.argv[2] || APP); await p.evaluate(() => localStorage.clear()); await p.reload();
  await p.evaluate(() => { R = blank(); R.id = 'ss'; tab = 'pianta'; render(); const pl = piano(); ui.view = {x:-1, y:-1, s:60}; G = geometry(pl);
    const st = (pts, tipo) => { ui.newType = tipo; const sp = []; for (let i = 0; i < pts.length - 1; i++) { const a = pts[i], c = pts[i + 1]; for (let k = 0; k < 8; k++) sp.push([SX(a[0] + (c[0] - a[0]) * k / 8), SY(a[1] + (c[1] - a[1]) * k / 8)]); } sp.push([SX(pts[pts.length - 1][0]), SY(pts[pts.length - 1][1])]); finishStroke(sp); };
    ui.mode = 'select'; st([[0,0],[10,0],[10,4],[0,4],[0,0]], 'P'); update(true); updTools(); fit(); draw(); });
  await p.click('#bFull'); await p.waitForTimeout(300);
  const tocca = async (wx, wy) => { const r = await p.evaluate(([wx, wy]) => { const b = document.querySelector('#svg').getBoundingClientRect(); return [b.left + SX(wx), b.top + SY(wy)]; }, [wx, wy]); await p.mouse.click(r[0], r[1]); await p.waitForTimeout(250); };
  const st = () => p.evaluate(() => ({sel:ui.sel ? ui.sel.k : null, pannello:document.body.classList.contains('hassel'), scala:+ui.view.s.toFixed(2), x:+ui.view.x.toFixed(2), sotto:ui.sel && ui.tapX == null ? null : 0}));
  const x0 = await p.evaluate(() => +ui.view.x.toFixed(2));
  // muro a sinistra: il pannello non lo copre, la vista non si muove
  const xl = await p.evaluate(() => Math.min(...piano().walls.map(w => { const I = G.T.info.get(w.id); return I && !I.H ? I.a.x + (I.o || 0) : 99; }))); await tocca(xl, 2); console.log('muro a sinistra', JSON.stringify(await st()), 'spostata:', (await st()).x !== x0);
  await p.keyboard.press('Escape'); await p.evaluate(() => { ui.sel = null; draw(); renderSide(); });
  const xa = await p.evaluate(() => +ui.view.x.toFixed(2));
  // muro a destra: starebbe sotto il pannello, la pianta scorre a sinistra senza cambiare zoom
  const xr = await p.evaluate(() => Math.max(...piano().walls.map(w => { const I = G.T.info.get(w.id); return I && !I.H ? I.a.x + (I.o || 0) : -9; }))); await tocca(xr, 2); const d = await st(); console.log('muro a destra', JSON.stringify(d), 'spostata:', d.x > xa);
  const ok = await p.evaluate(() => { const w = piano().walls.find(w => w.id === ui.sel.id), I = G.T.info.get(w.id); return SX(I.a.x + (I.H ? 0 : I.o || 0)) < ui.W - Math.min(380, innerWidth * 0.44) - 24; });
  console.log('muro fuori dal pannello', ok);
  await p.screenshot({path:require('path').join(OUT, 'spostasel.png')});
  console.log('errors', errs); await b.close();
})();
