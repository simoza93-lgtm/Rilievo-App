const APP = require('url').pathToFileURL(require('path').resolve(__dirname, '..', 'index.html')).href;
const OUT = require('path').join(__dirname, 'out'); require('fs').mkdirSync(OUT, {recursive: true});
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({viewport:{width:1400,height:950}});
  const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  await p.goto(APP); await p.evaluate(()=>localStorage.clear()); await p.reload();
  const r = await p.evaluate(()=>{ R = blank(); R.id='dx'; tab='pianta'; render(); const pl = piano();
    const pts=[[0,0],[8,0],[8,6],[0,6],[0,0]]; for(let i=0;i<pts.length-1;i++) addSegment(pl,{x:pts[i][0],y:pts[i][1]},{x:pts[i+1][0],y:pts[i+1][1]},'P'); update(true);
    const wb = pl.walls.find(w=>{const a=nd(pl,w.a),c=nd(pl,w.b); return isH(a,c) && a.y < 1;});
    wb.ap = [{id:'i1', tipo:'ingresso', d:'5,00', l:'1,00', h:'2,10', dav:'', inv:false, dp:true, lp:true}]; update(true);
    const run = () => G.runs.find(r => r.chain);
    const info = () => { const r = run(); return {pcs:r.chain.pcs.map(pc=>[f2(pc.len), pc.meas, pc.known, pc.diff != null ? +pc.diff.toFixed(3) : null]), d:wb.ap[0].d, warns:G.warns.map(w=>w.t)}; };
    const out = {prima:info()};
    setMeasure(pl, 'l', run().key, '1,00'); update(true); out.ultima = info();
    wb.ap[0].l = '1,20'; delete wb.ap[0].lp; update(true); out.larghezza = info();
    // poi misuro anche da sinistra: comanda la posizione da sinistra, l'ultima diventa vincolo sul totale
    const k = run().key; wb.ap[0].pos = {k, v:'4,00', prev:''}; delete wb.ap[0].dp; update(true); out.sinistra = info(); out.nodi = pl.nodes.map(n=>[n.x,n.y]);
    return out; });
  console.log(JSON.stringify(r)); console.log('errors', errs); await b.close();
})();
