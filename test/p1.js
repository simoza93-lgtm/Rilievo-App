const APP = require('url').pathToFileURL(require('path').resolve(__dirname, '..', 'index.html')).href;
const OUT = require('path').join(__dirname, 'out'); require('fs').mkdirSync(OUT, {recursive: true});
const { chromium } = require('playwright'); const fs=require('fs');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({viewport:{width:1400,height:950}});
  const errs=[]; p.on('pageerror',e=>errs.push(e.message)); p.on('console',m=>{ if(m.type()==='error') errs.push(m.text()); });
  await p.goto(APP); await p.evaluate(()=>(localStorage.clear(), localStorage.setItem('rilievo-mstile','classico'))); await p.reload();
  await p.waitForTimeout(300);
  const info = await p.evaluate(()=>({warns:G.warns.map(w=>w.t), chains:G.runs.filter(r=>r.chain).map(r=>({k:latoNome(r), pcs:r.chain.pcs.map(pc=>[f2(pc.len), pc.meas, pc.known])})), pbb:ui.pbb.length}));
  console.log(JSON.stringify(info,null,1));
  await p.screenshot({path:require('path').join(OUT, 'parz1.png'), clip:{x:20,y:330,width:960,height:620}});
  fs.writeFileSync(require('path').join(OUT, 'parz1.scr'), await p.evaluate(()=>genScript(piano())));
  console.log('errors',errs); await b.close();
})();
