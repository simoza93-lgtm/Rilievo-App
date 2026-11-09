const APP = require('url').pathToFileURL(require('path').resolve(__dirname, '..', 'index.html')).href;
const OUT = require('path').join(__dirname, 'out'); require('fs').mkdirSync(OUT, {recursive: true});
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({viewport:{width:1400,height:950}});
  const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  await p.goto(APP); await p.evaluate(()=>localStorage.clear()); await p.reload();
  const r = await p.evaluate(()=>{ R = blank(); R.id='e1'; tab='pianta'; render(); const pl = piano(); ui.view={x:-3,y:-6,s:60}; G = geometry(pl);
    const st = (pts, tipo) => { ui.newType = tipo; const sp = []; for (let i = 0; i < pts.length - 1; i++) { const a = pts[i], c = pts[i+1]; for (let k = 0; k < 6; k++) sp.push([SX(a[0] + (c[0]-a[0])*k/6), SY(a[1] + (c[1]-a[1])*k/6)]); } sp.push([SX(pts[pts.length-1][0]), SY(pts[pts.length-1][1])]); finishStroke(sp); };
    st([[0,0],[6,0],[6,-4],[0,-4],[0,0]], 'P');
    const B = pl.nodes.find(n => n.x < 1 && n.y > -1);
    st([[B.x,B.y],[B.x,B.y+2.5],[B.x+3,B.y+2.5]], 'T');
    const T0 = pl.nodes.find(n => n.y > B.y + 2); st([[T0.x+3, T0.y],[T0.x+3, B.y]], 'T');
    st([[T0.x, T0.y],[T0.x, T0.y+1.5],[T0.x-2, T0.y+1.5],[T0.x-2, B.y-2],[B.x-0.1, B.y-2]], 'T');
    const par = pl.walls.find(w => w.tipo==='T' && !isH(nd(pl,w.a),nd(pl,w.b)) && Math.abs(nd(pl,w.a).x - B.x) < 0.01 && nd(pl,w.a).y < B.y + 0.5);
    par.ap = [{id:'d1', tipo:'porta', d:'0,50', l:'0,80', h:'', dav:'', inv:false}]; update(true);
    const dump = () => G.runs.filter(r => r.chain).map(r => ({lato:latoNome(r), ext:r.ext, eA:+r.eA.toFixed(3), eB:+r.eB.toFixed(3), pcs:r.chain.pcs.map(pc => [f2(pc.len), pc.meas, pc.known])}));
    const out = {filo:par.filo, prima:dump()};
    const rr = G.runs.find(r => r.chain && r.sg > 0); out.walls = pl.walls.map(w=>[w.tipo,w.filo,nd(pl,w.a).x,nd(pl,w.a).y,nd(pl,w.b).x,nd(pl,w.b).y,(w.ap||[]).length]); out.runs = G.runs.filter(r=>r.walls.includes(par)).map(r=>[latoNome(r), r.ext, !!r.chain]);
    if (rr) { setMeasure(pl, 'l', rr.key, '1,20'); update(true); }
    const rl = G.runs.find(r => r.chain && r.sg < 0); setMeasure(pl, 'l', rl.key, '1,30'); update(true); out.dopo = dump(); out.rej=[...REJ]; out.warns = G.warns.map(w=>w.t);
    return out; });
  console.log(JSON.stringify(r, null, 0)); console.log('errors', errs); await b.close();
})();
