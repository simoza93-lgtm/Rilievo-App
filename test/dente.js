// Dente: spostamento di lato di un muro (w.dm). I muri attaccati si allungano, i m² seguono il disegno, le misure scritte non danno falsi «non torna»,
// il calcolo ripetuto non accumula lo spostamento, e togliendolo tutto torna com'era.
const APP = require('url').pathToFileURL(require('path').resolve(__dirname, '..', 'index.html')).href;
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({viewport:{width:1400,height:950}});
  const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  await p.goto(APP); await p.evaluate(()=>localStorage.clear()); await p.reload();
  const r = await p.evaluate(()=>{ R = blank(); R.id='dn'; tab='pianta'; render(); const pl = piano();
    ui.view = {x:-2, y:-3, s:60}; G = geometry(pl);
    const st = (pts, tipo) => { ui.newType = tipo; const sp = []; for (let i = 0; i < pts.length - 1; i++) { const a = pts[i], c = pts[i+1]; for (let k = 0; k < 6; k++) sp.push([SX(a[0] + (c[0]-a[0])*k/6), SY(a[1] + (c[1]-a[1])*k/6)]); } sp.push([SX(pts[pts.length-1][0]), SY(pts[pts.length-1][1])]); finishStroke(sp); };
    st([[0,0],[0,5],[6,5],[6,0],[0,0]], 'P'); update(true);
    const area = () => +G.comps.filter(c => c.room)[0].area.toFixed(2), nonTorna = () => G.warns.filter(w => /non tornano|NON APPLICATA/.test(w.t)).length;
    const top = pl.walls.find(w => { const a = pl.nodes.find(n => n.id === w.a), c = pl.nodes.find(n => n.id === w.b); return a.y > 4 && c.y > 4; });
    const lato = G.runs.find(r => !r.H && r.walls.length && r.sg > 0), key = lato.key; (pl.fm = pl.fm || {})[key] = String(+lato.face.toFixed(2)); update(true);
    const a0 = area(), n0 = nonTorna(), ys0 = pl.nodes.map(n => n.y).join();
    top.dm = '0,5'; update(true); update(true); update(true);
    const a1 = area(), n1 = nonTorna(), yTop = pl.nodes.find(n => n.id === top.a).y, sx = pl.nodes.some(n => n.sx);
    top.dm = '-0,3'; update(true); const a2 = area();
    top.dm = ''; update(true); const a3 = area(), ys3 = pl.nodes.map(n => n.y).join(), resid = pl.nodes.some(n => n.sx || n.sy);
    // muro in linea con un altro (diviso da un tramezzo): lo spostamento crea il raccordo e il dente entra nei m²
    R = blank(); R.id = 'dn2'; tab = 'pianta'; render(); const p2 = piano(); G = geometry(p2);
    st([[0,0],[0,5],[6,5],[6,0],[0,0]], 'P'); st([[3,5],[3,0]], 'T'); update(true);
    const ar = () => G.comps.filter(c => c.room).map(c => +c.area.toFixed(2)).sort((x, y) => x - y).join('/'), nw = () => p2.walls.length;
    const dx = p2.walls.find(w => { const a = p2.nodes.find(n => n.id === w.a), c = p2.nodes.find(n => n.id === w.b); return a.y > 4 && c.y > 4 && a.x >= 2.5; });
    const b0 = ar(), w0 = nw(); dx.dm = '0,5'; update(true); update(true);
    const b1 = ar(), w1 = nw(), jg = p2.walls.filter(w => w.jg).length; dx.dm = ''; update(true);
    return {a0, n0, a1, n1, dArea:+(a1 - a0).toFixed(2), yTop, sx, a2, ritorno:a3 === a0 && ys3 === ys0, resid, b0, b1, jg, wPiu:w1 - w0, wTorna:nw() === w0 && ar() === b0, nodiExtra:p2.nodes.some(n => n.jn || n.sx || n.sy)}; });
  console.log(JSON.stringify(r)); console.log('errors', errs); await b.close();
})();
