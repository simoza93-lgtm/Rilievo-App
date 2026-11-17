// Ringhiera: nuovo tipo di muro (rosso, 5 cm, altezza). Chiude un balcone come un muro e va nel suo layer dello script.
const APP = require('url').pathToFileURL(require('path').resolve(__dirname, '..', 'index.html')).href;
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({viewport:{width:1400,height:950}});
  const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  await p.goto(APP); await p.evaluate(()=>localStorage.clear()); await p.reload();
  const r = await p.evaluate(()=>{ R = blank(); R.id='rg'; tab='pianta'; render(); const pl = piano();
    ui.view = {x:-2, y:-3, s:60}; G = geometry(pl);
    const st = (pts, tipo) => { ui.newType = tipo; const sp = []; for (let i = 0; i < pts.length - 1; i++) { const a = pts[i], c = pts[i+1]; for (let k = 0; k < 6; k++) sp.push([SX(a[0] + (c[0]-a[0])*k/6), SY(a[1] + (c[1]-a[1])*k/6)]); } sp.push([SX(pts[pts.length-1][0]), SY(pts[pts.length-1][1])]); finishStroke(sp); };
    st([[0,0],[0,5],[6,5],[6,0],[0,0]], 'P');
    st([[1,5],[1,7],[4,7],[4,5]], 'W');   // balcone 3 x 2 sul lato alto della casa
    update(true);
    const W = pl.walls.filter(w => w.tipo === 'W');
    const stanze = G.comps.filter(c => c.room).map(c => +c.area.toFixed(2));
    const nonW = pl.walls.filter(w => w.tipo !== 'W').every(w => layerOf(w) !== 'W');
    ui.mode = 'sel'; ui.sel = {k:'w', id:W[0].id}; renderSide();
    const pannello = document.querySelector('#side, aside, .side') ? document.body.innerHTML.includes('Altezza ringhiera (m)') : false;
    const scr = genScript(pl).join ? genScript(pl).join('\n') : String(genScript(pl));
    return {nW:W.length, spessore:thick(W[0]), lay:layerOf(W[0]), nonW, stanze, pannello, rgScript:scr.includes('PLAN_RINGHIERE') ? 'layer nuovo!' : scr.includes('ringhiere (5 cm'), ros:document.querySelector('#svg').innerHTML.includes('fill="var(--wR)"')}; });
  console.log(JSON.stringify(r)); console.log('errors', errs); await b.close();
})();
