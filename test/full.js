const APP = require('url').pathToFileURL(require('path').resolve(__dirname, '..', 'index.html')).href;
const OUT = require('path').join(__dirname, 'out'); require('fs').mkdirSync(OUT, {recursive: true});
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({viewport:{width:1600,height:1000}});
  const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  await p.goto(APP); await p.evaluate(()=>localStorage.clear()); await p.reload(); await p.waitForTimeout(300);
  await p.click('#bFull'); await p.waitForTimeout(300); await p.click('#bFit'); await p.waitForTimeout(100);
  const w0 = await p.evaluate(()=>({cv:document.querySelector('#cv').clientWidth, side:getComputedStyle(document.querySelector('#sidecol')).display}));
  await p.screenshot({path:require('path').join(OUT, 'full1.png')});
  await p.$eval('[data-mode="select"]', b => b.click());
  // tocco un muro
  const q = await p.evaluate(()=>{ const pl=piano(), w=pl.walls[0], a=nd(pl,w.a), c=nd(pl,w.b), r=document.querySelector('#svg').getBoundingClientRect(); return {x:r.left+SX((a.x+c.x)/2), y:r.top+SY((a.y+c.y)/2)}; });
  await p.mouse.click(q.x, q.y); await p.waitForTimeout(200);
  const w1 = await p.evaluate(()=>({cv:document.querySelector('#cv').clientWidth, side:getComputedStyle(document.querySelector('#sidecol')).display, pos:getComputedStyle(document.querySelector('#sidecol')).position, msgs:getComputedStyle(document.querySelector('#msgs')).display, sel:ui.sel && ui.sel.k}));
  await p.screenshot({path:require('path').join(OUT, 'full2.png')});
  await p.click('#bCloseSide'); await p.waitForTimeout(100);
  const w2 = await p.evaluate(()=>getComputedStyle(document.querySelector('#sidecol')).display);
  await p.click('#bFull'); await p.waitForTimeout(300);
  const w3 = await p.evaluate(()=>({side:getComputedStyle(document.querySelector('#sidecol')).display, msgs:getComputedStyle(document.querySelector('#msgs')).display}));
  console.log(JSON.stringify({w0, w1, w2, w3})); console.log('errors', errs); await b.close();
})();
