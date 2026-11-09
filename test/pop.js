const APP = require('url').pathToFileURL(require('path').resolve(__dirname, '..', 'index.html')).href;
const OUT = require('path').join(__dirname, 'out'); require('fs').mkdirSync(OUT, {recursive: true});
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({viewport:{width:1280,height:800}, hasTouch:true});
  const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  await p.goto(APP); await p.evaluate(()=>localStorage.clear()); await p.reload(); await p.waitForTimeout(300);
  const side0 = await p.evaluate(()=>getComputedStyle(document.querySelector('#side')).display);
  // tocco una casella di misura vuota
  await p.evaluate(()=>{ piano().walls.forEach(w=>{}); fit(); draw(); });
  const bx = await p.evaluate(()=>{ const r=document.querySelector('#svg').getBoundingClientRect(); const [k,b]=[...ui.rbb.entries()][0]; return {x:r.left+b[0]+b[2]/2, y:r.top+b[1]+b[3]/2, k}; });
  await p.touchscreen.tap(bx.x, bx.y); await p.waitForTimeout(200);
  for (const k of ['3','4','5',',','6']) { await p.touchscreen.tap(...await p.evaluate(k=>{ const e=[...document.querySelectorAll('.mkeys button')].find(x=>x.dataset.k===k).getBoundingClientRect(); return [e.left+e.width/2, e.top+e.height/2]; }, k)); }
  const shown = await p.evaluate(()=>document.querySelector('#mvTxt').textContent);
  await p.screenshot({path:require('path').join(OUT, 'pop.png')});
  await p.click('.mok'); await p.waitForTimeout(150);
  const saved = await p.evaluate(k=>piano().fm[k], bx.k);
  console.log(JSON.stringify({side0, shown, saved})); console.log('errors', errs); await b.close();
})();
