const APP = require('url').pathToFileURL(require('path').resolve(__dirname, '..', 'index.html')).href;
const { chromium } = require('playwright');
// Seleziona: un tocco = un muro come sempre; il secondo tocco su un altro muro li sceglie insieme, ritoccandone uno lo si toglie, si possono eliminare.
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({viewport:{width:1400,height:950}});
  const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  await p.goto(APP); await p.evaluate(()=>localStorage.clear()); await p.reload();
  const r = await p.evaluate(()=>{ R = blank(); R.id='ml'; tab='pianta'; render(); const pl = piano(); ui.view={x:-1,y:-1,s:60}; G = geometry(pl);
    const st = (pts, tipo) => { ui.newType = tipo; const sp = []; for (let i = 0; i < pts.length - 1; i++) { const a = pts[i], c = pts[i+1]; for (let k = 0; k < 6; k++) sp.push([SX(a[0] + (c[0]-a[0])*k/6), SY(a[1] + (c[1]-a[1])*k/6)]); } sp.push([SX(pts[pts.length-1][0]), SY(pts[pts.length-1][1])]); finishStroke(sp); };
    st([[0,0],[6,0],[6,5],[0,5],[0,0]], 'P'); ui.mode = 'select'; updTools(); update(true);
    const n0 = pl.walls.length, tap = (x, y) => hit([SX(x), SY(y)]), S = () => ui.sel ? ui.sel.k + (ui.sel.w ? ':' + ui.sel.w.length : '') : null;
    tap(3, 0); const a = S(); tap(6, 2.5); const b2 = S(); tap(3, 5); const c = S(); tap(3, 5); const d = S(); tap(6, 2.5); const e = S();
    tap(6, 2.5); tap(3, 0); const f = S(); tap(3, 0); const g = S(); delMulti(); update(true);
    return {n0, a, b2, c, d, e, f, g, dopo:piano().walls.length}; });
  console.log(JSON.stringify(r)); console.log('errors', errs); await b.close();
})();
