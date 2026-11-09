const APP = require('url').pathToFileURL(require('path').resolve(__dirname, '..', 'index.html')).href;
const OUT = require('path').join(__dirname, 'out'); require('fs').mkdirSync(OUT, {recursive: true});
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({viewport:{width:1400,height:950}});
  const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  await p.goto(process.argv[2] || APP); await p.evaluate(()=>localStorage.clear()); await p.reload();
  const r = await p.evaluate(()=>{ R = blank(); R.id='af'; tab='pianta'; render(); const pl = piano(); ui.view={x:-2,y:-2,s:80}; G = geometry(pl);
    const st = (pts, tipo) => { ui.newType = tipo; const sp = []; for (let i = 0; i < pts.length - 1; i++) { const a = pts[i], c = pts[i+1]; for (let k = 0; k < 6; k++) sp.push([SX(a[0] + (c[0]-a[0])*k/6), SY(a[1] + (c[1]-a[1])*k/6)]); } sp.push([SX(pts[pts.length-1][0]), SY(pts[pts.length-1][1])]); finishStroke(sp); };
    st([[0,0],[7,0],[7,-4],[0,-4],[0,0]], 'P');
    // finestra proposta verso la fine del muro lungo
    const top = pl.walls.filter(w => isH(nd(pl,w.a),nd(pl,w.b))).sort((a,b)=>nd(pl,a.a).y-nd(pl,b.a).y)[0];
    top.ap = [{id:uid(), tipo:'finestra', d:'5,50', l:'1,20', h:'1,40', dav:'0,90', inv:false, dp:true, lp:true}]; update(true);
    const vis0 = G.ops.length;
    // misuro il lato interno del muro: 4,00 (il muro si accorcia di ~3 m)
    const r = G.runs.find(r => !r.ext && r.walls.includes(top)); setMeasure(pl, 'r', r.key, '4,00'); update(true);
    const ap = top.ap[0]; const o = G.ops.find(o => o.ap === ap);
    const res = {vis0, d:ap.d, l:ap.l, shown:!!o, bad:o && o.bad, errs:G.errs.map(e=>e.t)};
    // finestra con distanza scritta (non proposta) che non ci sta: resta visibile in rosso
    ap.d = '3,50'; delete ap.dp; update(true); const o2 = G.ops.find(o => o.ap === ap);
    res.measured = {d:ap.d, shown:!!o2, bad:o2 && o2.bad, errs:G.errs.map(e=>e.t)};
    ui.view={x:-1,y:-1,s:110}; draw(); return res; });
  await p.screenshot({path:require('path').join(OUT, 'apfit.png')});
  console.log(JSON.stringify(r)); console.log('errors', errs); await b.close();
})();
