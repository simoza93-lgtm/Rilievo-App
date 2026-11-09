const APP = require('url').pathToFileURL(require('path').resolve(__dirname, '..', 'index.html')).href;
const OUT = require('path').join(__dirname, 'out'); require('fs').mkdirSync(OUT, {recursive: true});
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({viewport:{width:1400,height:950}});
  const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  await p.goto(process.argv[2] || APP); await p.evaluate(()=>localStorage.clear()); await p.reload();
  const r = await p.evaluate(()=>{ R = blank(); R.id='sp'; tab='pianta'; render(); const pl = piano(); ui.view={x:-4,y:-8,s:60}; G = geometry(pl);
    const st = (pts, tipo) => { ui.newType = tipo; const sp = []; for (let i = 0; i < pts.length - 1; i++) { const a = pts[i], c = pts[i+1]; for (let k = 0; k < 6; k++) sp.push([SX(a[0] + (c[0]-a[0])*k/6), SY(a[1] + (c[1]-a[1])*k/6)]); } sp.push([SX(pts[pts.length-1][0]), SY(pts[pts.length-1][1])]); finishStroke(sp); };
    // perimetro con un dente: come nel video
    st([[0,0],[8,0],[8,-6],[2,-6],[2,-3],[0,-3],[0,0]], 'P');
    const C = pl.nodes.find(n => Math.abs(n.x-2.15)<0.3 && Math.abs(n.y-3.15)<0.3);
    st([[C.x,C.y],[C.x,6.15]], 'T');   // tramezzo che prosegue il perimetrale verticale fino al muro in fondo
    const xs = () => pl.walls.filter(w => !isH(nd(pl,w.a),nd(pl,w.b)) && w.tipo==='T').map(w => ({filo:w.filo, x:+(nd(pl,w.a).x + G.T.info.get(w.id).o).toFixed(3), y:[nd(pl,w.a).y,nd(pl,w.b).y].map(v=>+v.toFixed(2))}));
    const before = xs();
    const T0 = pl.walls.find(w => w.tipo==='T'); const ya = nd(pl,T0.a).y, yb = nd(pl,T0.b).y, xm = nd(pl,T0.a).x + G.T.info.get(T0.id).o;
    st([[xm,(ya+yb)/2],[xm+4,(ya+yb)/2]], 'T');   // tramezzo nuovo che parte dal centro
    const after = xs();
    ui.view={x:-1,y:-1,s:90}; draw(); return {before, after}; });
  await p.screenshot({path:require('path').join(OUT, 'split.png')});
  console.log(JSON.stringify(r)); console.log('errors', errs); await b.close();
})();
