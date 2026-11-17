// Marciapiede ad anello attorno alla casa: l'area esclude la casa e i suoi ambienti si riconoscono ancora.
const APP = require('url').pathToFileURL(require('path').resolve(__dirname, '..', 'index.html')).href;
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({viewport:{width:1400,height:950}});
  const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  await p.goto(APP); await p.evaluate(()=>localStorage.clear()); await p.reload();
  const r = await p.evaluate(()=>{ R = blank(); R.id='an'; tab='pianta'; render(); const pl = piano();
    ui.view = {x:-3, y:-3, s:50}; G = geometry(pl);
    const st = (pts, tipo) => { ui.newType = tipo; const sp = []; for (let i = 0; i < pts.length - 1; i++) { const a = pts[i], c = pts[i+1]; for (let k = 0; k < 6; k++) sp.push([SX(a[0] + (c[0]-a[0])*k/6), SY(a[1] + (c[1]-a[1])*k/6)]); } sp.push([SX(pts[pts.length-1][0]), SY(pts[pts.length-1][1])]); finishStroke(sp); };
    st([[0,0],[0,5],[6,5],[6,0],[0,0]], 'P');
    st([[-1,-1],[-1,6],[7,6],[7,-1],[-1,-1]], 'S');
    update(true);
    const comps = G.comps.map(c => ({a:+c.area.toFixed(2), room:c.room, bb:c.bbox.map(v=>+v.toFixed(2))}));
    
    return {comps, casa:+G.comps[G.compAt(4, 3.5)].area.toFixed(2), anello:+G.comps[G.compAt(0.5, 3)].area.toFixed(2), nRooms:(pl.rooms||[]).length}; });
  console.log(JSON.stringify(r)); console.log('errors', errs); await b.close();
})();
