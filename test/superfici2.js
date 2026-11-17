// Superfici esterne come muri sottili (tipo S): si disegnano come i muri, chiusi sul muro di casa fanno un ambiente con i m².
const APP = require('url').pathToFileURL(require('path').resolve(__dirname, '..', 'index.html')).href;
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({viewport:{width:1400,height:950}});
  const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  await p.goto(APP); await p.evaluate(()=>localStorage.clear()); await p.reload();
  const r = await p.evaluate(()=>{ R = blank(); R.id='s2'; tab='pianta'; render(); const pl = piano();
    ui.view = {x:-3, y:-3, s:50}; G = geometry(pl);
    const st = (pts, tipo) => { ui.newType = tipo; const sp = []; for (let i = 0; i < pts.length - 1; i++) { const a = pts[i], c = pts[i+1]; for (let k = 0; k < 6; k++) sp.push([SX(a[0] + (c[0]-a[0])*k/6), SY(a[1] + (c[1]-a[1])*k/6)]); } sp.push([SX(pts[pts.length-1][0]), SY(pts[pts.length-1][1])]); finishStroke(sp); };
    st([[0,0],[0,5],[6,5],[6,0],[0,0]], 'P');
    st([[0,5],[0,7],[6,7],[6,5]], 'S');   // portico 6 x 2 sul lato alto
    update(true);
    const S = pl.walls.filter(w => w.tipo === 'S');
    const stanze = G.comps.filter(c => c.room).map(c => +c.area.toFixed(2));
    const bbs = G.comps.filter(c=>c.room).map(c=>c.bbox.map(v=>+v.toFixed(3))); const rec = (pl.rooms || []).find(x => G.comps[x._c] && Math.abs(G.comps[x._c].area - 10.58) < 1);
    if (rec) { rec.dest = 'Portico'; rec.nome = 'Portico'; }
    update(true);
    const scr = [].concat(genScript(pl)).join('\n');
    draw(); const svg = document.querySelector('#svg').innerHTML;
    return {bbs, nS:S.length, spess:thick(S[0]), lay:layerOf(S[0]), stanze, rec:!!rec, giallo:svg.includes('fill="var(--wI)" fill-opacity=".6"'), scr:scr.includes('PLAN_SUPERFICI'), dest:Object.keys(DEST).includes('Portico')}; });
  console.log(JSON.stringify(r)); console.log('errors', errs); await b.close();
})();
