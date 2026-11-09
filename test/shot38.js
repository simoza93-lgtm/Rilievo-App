const APP = require('url').pathToFileURL(require('path').resolve(__dirname, '..', 'index.html')).href;
const OUT = require('path').join(__dirname, 'out'); require('fs').mkdirSync(OUT, {recursive: true});
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({viewport:{width:1400,height:950}});
  const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  await p.goto(APP); await p.evaluate(()=>localStorage.clear()); await p.reload();
  const r = await p.evaluate(()=>{
    R = blank(); R.id='t'; tab='pianta'; render(); const pl = piano();
    const pts=[[0,0],[8,0],[8,5],[0,5],[0,0]]; for(let i=0;i<pts.length-1;i++) addSegment(pl,{x:pts[i][0],y:pts[i][1]},{x:pts[i+1][0],y:pts[i+1][1]},'P');
    addSegment(pl,{x:3,y:0},{x:3,y:5},'T'); update(true);
    const st = newStair('dritta', 7.3, 2.8); snapStair(st); anchorStair(pl, st); pl.stairs=[st]; update(true);
    const face = () => { const rv = G.runs.find(r=>!r.ext && !r.H && r.P.x>7 && r.sg<0); return +(rv.P.x + rv.o - rv.t/2).toFixed(3); };
    const topFace = () => { const rh = G.runs.find(r=>!r.ext && r.H && r.P.y>4 && r.sg<0 && r.P.x>2.5); return +(rh.P.y + rh.o - rh.t/2).toFixed(3); };
    const bb = () => stairPrims(st).bbox.map(v=>+v.toFixed(3));
    const out = {anc:st.anc, prima:{bb:bb(), faceDx:face(), faceTop:topFace()}};
    // misuro la stanza di destra più larga e più alta
    const top = G.runs.find(r=>!r.ext && r.H && r.sg<0 && r.P.y>4 && (r.P.x+r.Q.x)/2>3.5);
    const right = G.runs.find(r=>!r.ext && !r.H && r.sg<0 && r.P.x>7);
    setMeasure(pl,'r',top.key,'6,20'); setMeasure(pl,'r',right.key,'5,50'); update(true);
    out.dopo = {bb:bb(), faceDx:face(), faceTop:topFace()};
    // misure della scala cambiate: resta attaccata al muro di destra
    st.b='1,10'; update(false); out.largaPiu = {bb:bb(), faceDx:face()};
    return out;
  });
  console.log(JSON.stringify(r,null,1)); console.log('errors',errs); await b.close();
})();
