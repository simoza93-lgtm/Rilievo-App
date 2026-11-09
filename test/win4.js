const APP = require('url').pathToFileURL(require('path').resolve(__dirname, '..', 'index.html')).href;
const OUT = require('path').join(__dirname, 'out'); require('fs').mkdirSync(OUT, {recursive: true});
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({viewport:{width:1400,height:950}, hasTouch:true});
  const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  await p.goto(APP); await p.evaluate(()=>localStorage.clear()); await p.reload(); await p.waitForTimeout(300);
  const S = (x,y)=>p.evaluate(([x,y])=>{ const r=document.querySelector('#svg').getBoundingClientRect(); return {x:r.left+SX(x), y:r.top+SY(y)}; },[x,y]);
  const sel = () => p.evaluate(()=>ui.sel && (ui.sel.k === 'm' ? 'm:' + ui.sel.w.length : ui.sel.k));
  await p.$eval('[data-win]', b => b.click()); const on = await p.evaluate(()=>[ui.winArm, ui.mode]);
  let a = await S(8.5, 1.2), c = await S(1.2, 6.2);   // da destra a sinistra, col dito, dentro gli ambienti
  await p.touchscreen.tap(a.x, a.y); await p.waitForTimeout(100); const mid = await p.evaluate(()=>[!!ui.winA, ui.sel && ui.sel.k]);
  await p.touchscreen.tap(c.x, c.y); await p.waitForTimeout(150); const s1 = await sel(), off = await p.evaluate(()=>ui.winArm);
  // dopo: un tocco nella stanza la seleziona come prima
  await p.touchscreen.tap(a.x, a.y); await p.waitForTimeout(100); const s2 = await sel();
  console.log(JSON.stringify({on, mid, s1, off, s2})); console.log('errors', errs); await b.close();
})();
