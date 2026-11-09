const APP = require('url').pathToFileURL(require('path').resolve(__dirname, '..', 'index.html')).href;
const OUT = require('path').join(__dirname, 'out'); require('fs').mkdirSync(OUT, {recursive: true});
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({viewport:{width:1400,height:950}});
  await p.goto(APP); await p.evaluate(()=>localStorage.clear()); await p.reload();
  await p.evaluate(()=>{ R = blank(); R.id='t'; tab='pianta'; render(); const pl = piano();
    const pts=[[0,0],[5,0],[5,5],[0,5],[0,0]]; for(let i=0;i<pts.length-1;i++) addSegment(pl,{x:pts[i][0],y:pts[i][1]},{x:pts[i+1][0],y:pts[i+1][1]},'P');
    const u = newStair('U', 1.6, 2.2); u.n='16'; u.n1='8'; const l = newStair('L', 3.6, 3.4); l.n='12'; l.n1='4';
    pl.stairs=[u,l]; update(true); fit(); draw(); });
  await p.screenshot({path:require('path').join(OUT, 'num.png'), clip:{x:30,y:280,width:930,height:620}}); await b.close();
})();
