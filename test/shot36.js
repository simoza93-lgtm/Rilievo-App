const APP = require('url').pathToFileURL(require('path').resolve(__dirname, '..', 'index.html')).href;
const OUT = require('path').join(__dirname, 'out'); require('fs').mkdirSync(OUT, {recursive: true});
const { chromium } = require('playwright'); const fs=require('fs');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage();
  await p.goto(APP); await p.evaluate(()=>localStorage.clear()); await p.reload();
  const scr = await p.evaluate(()=>{
    R = blank(); R.id='t'; tab='pianta'; render(); const pl = piano();
    const pts=[[0,0],[10,0],[10,7],[0,7],[0,0]];
    for(let i=0;i<pts.length-1;i++) addSegment(pl,{x:pts[i][0],y:pts[i][1]},{x:pts[i+1][0],y:pts[i+1][1]},'P');
    addSegment(pl,{x:4,y:0},{x:4,y:7},'T'); update(true);
    const a = newStair('dritta', 1.2, 3); const u = newStair('U', 6, 2.5); u.n='18'; u.n1='9'; u.mano='sx';
    const l = newStair('L', 7.8, 5.2); l.n='14'; l.n1='4'; l.rot=180; const c = newStair('chiocciola', 2.5, 5.6); c.n='14';
    pl.stairs=[a,u,l,c]; update(true); return genScript(pl); });
  fs.writeFileSync(require('path').join(OUT, 'scale.scr'), scr); await b.close();
})();
