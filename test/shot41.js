const APP = require('url').pathToFileURL(require('path').resolve(__dirname, '..', 'index.html')).href;
const OUT = require('path').join(__dirname, 'out'); require('fs').mkdirSync(OUT, {recursive: true});
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({viewport:{width:1400,height:950}});
  const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  await p.goto(APP); await p.evaluate(()=>localStorage.clear()); await p.reload();
  const r = await p.evaluate(()=>{
    R = blank(); R.id='t'; tab='pianta'; render(); const pl = piano();
    const pts=[[0,0],[7,0],[7,6],[0,6],[0,0]]; for(let i=0;i<pts.length-1;i++) addSegment(pl,{x:pts[i][0],y:pts[i][1]},{x:pts[i+1][0],y:pts[i+1][1]},'P'); update(true);
    const same = newStair('U', 2, 3); same.dir='inter'; same.n='18'; same.n1='9'; same.nA='18'; same.aA='0,18'; same.n1A='9';
    const diff = newStair('U', 5, 3); diff.dir='inter'; diff.n='18'; diff.n1='9'; diff.nA='22'; diff.aA='0,17'; diff.n1A='11';
    pl.stairs=[same, diff]; update(true); fit(); draw();
    return [same, diff].map(s=>{ const P = stairPrims(s); return {dash:P.segs.filter(x=>x.dash).length, tot:P.segs.length}; });
  });
  console.log(JSON.stringify(r)); await p.screenshot({path:require('path').join(OUT, 'inter2.png'), clip:{x:30,y:280,width:930,height:620}}); console.log('errors',errs); await b.close();
})();
