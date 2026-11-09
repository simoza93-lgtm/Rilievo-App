const APP = require('url').pathToFileURL(require('path').resolve(__dirname, '..', 'index.html')).href;
const OUT = require('path').join(__dirname, 'out'); require('fs').mkdirSync(OUT, {recursive: true});
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({viewport:{width:1400,height:950}});
  const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  await p.goto(APP); await p.evaluate(()=>localStorage.clear()); await p.reload();
  await p.evaluate(()=>{ R = blank(); R.id='b3'; tab='pianta'; render(); const pl = piano();
    const pts=[[0,0],[6,0],[6,4],[0,4],[0,0]]; for(let i=0;i<pts.length-1;i++) addSegment(pl,{x:pts[i][0],y:pts[i][1]},{x:pts[i+1][0],y:pts[i+1][1]},'T'); update(true);
    const s = newStair('dritta', 3, -1); Object.assign(s, {n:'4', a:'0,17', p:'0,28', b:'1,20'}); s.y = -1.0; snapStair(s); anchorStair(pl, s); (pl.stairs = []).push(s); update(true);
    ui.sel = {k:'s', id:s.id}; ui.mode='select'; fit(); draw(); renderSide(); });
  const v1 = await p.evaluate(()=>piano().walls.flatMap(w=>w.ap||[]).length);
  const info = await p.evaluate(()=>document.querySelector('#side').innerText.match(/Apri il varco[^\n]*\n?[^\n]*/)?.[0]);
  await p.click('[data-st="varco"]'); await p.waitForTimeout(100);
  const v2 = await p.evaluate(()=>piano().walls.flatMap(w=>w.ap||[]).length);
  await p.click('[data-st="varco"]'); await p.waitForTimeout(100);
  const v3 = await p.evaluate(()=>piano().walls.flatMap(w=>w.ap||[]).map(a=>[a.tipo,a.l]));
  console.log(v1, JSON.stringify(info), v2, JSON.stringify(v3)); console.log('errors', errs); await b.close();
})();
