const APP = require('url').pathToFileURL(require('path').resolve(__dirname, '..', 'index.html')).href;
const OUT = require('path').join(__dirname, 'out'); require('fs').mkdirSync(OUT, {recursive: true});
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({viewport:{width:1400,height:950}, colorScheme:'dark'});
  const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  await p.goto(process.argv[2] || APP); await p.evaluate(()=>localStorage.clear()); await p.reload();
  const r = await p.evaluate(()=>{ R = blank(); R.id='sp'; tab='pianta'; render(); const pl = piano(); ui.view={x:-4,y:-8,s:60}; G = geometry(pl);
    const st = (pts, tipo) => { ui.newType = tipo; const sp = []; for (let i = 0; i < pts.length - 1; i++) { const a = pts[i], c = pts[i+1]; for (let k = 0; k < 6; k++) sp.push([SX(a[0] + (c[0]-a[0])*k/6), SY(a[1] + (c[1]-a[1])*k/6)]); } sp.push([SX(pts[pts.length-1][0]), SY(pts[pts.length-1][1])]); finishStroke(sp); };
    st([[0,0],[8,0],[8,-6],[2,-6],[2,-3],[0,-3],[0,0]], 'P');
    st([[2.15,3.15],[2.15,6.15]], 'T');
    const T0 = pl.walls.find(w => w.tipo==='T'); const ya = nd(pl,T0.a).y, yb = nd(pl,T0.b).y, xm = nd(pl,T0.a).x + G.T.info.get(T0.id).o;
    st([[xm,(ya+yb)/2],[xm+4,(ya+yb)/2]], 'T');
    // altro caso: tramezzo nuovo verso sinistra (lato del muro spesso)
    const hz = pl.walls.filter(w => w.tipo==='T' && isH(nd(pl,w.a),nd(pl,w.b))).map(w => { const I = G.T.info.get(w.id); return {x0:+(I.a.x - I.da).toFixed(3), x1:+(I.b.x + I.db).toFixed(3), da:+I.da.toFixed(3)}; });
    const vt = pl.walls.filter(w => w.tipo==='T' && !isH(nd(pl,w.a),nd(pl,w.b))).map(w => { const I = G.T.info.get(w.id); return {faceL:+(I.a.x + I.o - I.t/2).toFixed(3), faceR:+(I.a.x + I.o + I.t/2).toFixed(3)}; });
    ui.view={x:0.5,y:2.5,s:160}; draw(); return {hz, vt, runs:G.runs.filter(r=>!r.ext).length}; });
  await p.screenshot({path:require('path').join(OUT, 'split2.png')});
  console.log(JSON.stringify(r)); console.log('errors', errs); await b.close();
})();
