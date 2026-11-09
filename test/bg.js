const APP = require('url').pathToFileURL(require('path').resolve(__dirname, '..', 'index.html')).href;
const OUT = require('path').join(__dirname, 'out'); require('fs').mkdirSync(OUT, {recursive: true});
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({viewport:{width:1400,height:950}, hasTouch:true});
  const errs=[]; p.on('pageerror',e=>errs.push(e.message)); p.on('dialog', d => d.accept('10'));
  await p.goto(APP); await p.evaluate(()=>localStorage.clear()); await p.reload(); await p.waitForTimeout(300);
  await p.evaluate(()=>{ R = blank(); R.id='bg1'; tab='pianta'; render(); });
  await p.click('[data-bg]'); const panel0 = await p.evaluate(()=>document.querySelector('#side').innerText.slice(0,40));
  const [fc] = await Promise.all([p.waitForEvent('filechooser'), p.click('#bBgGal')]); await fc.setFiles(require('path').join(__dirname, 'plan.jpg')); await p.waitForTimeout(1500);
  const bg0 = await p.evaluate(()=>piano().bg);
  // taratura: i due spigoli esterni in alto (pixel 100,100 e 1100,100) = 10 m
  const pxToScreen = (u,v) => p.evaluate(([u,v])=>{ const bg=piano().bg, k=bg.m*ui.view.s, t=bg.rot*Math.PI/180, r=document.querySelector('#svg').getBoundingClientRect(); const x=SX(bg.ox)+k*(u*Math.cos(t)-v*Math.sin(t)), y=SY(bg.oy)+k*(u*Math.sin(t)+v*Math.cos(t)); return {x:r.left+x, y:r.top+y}; },[u,v]);
  await p.click('#bBgCal'); let a = await pxToScreen(100,100), c = await pxToScreen(1100,100);
  await p.touchscreen.tap(a.x, a.y); await p.waitForTimeout(100); await p.touchscreen.tap(c.x, c.y); await p.waitForTimeout(300);
  const bg1 = await p.evaluate(()=>({m:piano().bg.m, ox:piano().bg.ox, oy:piano().bg.oy}));
  // ruoto di 90 e torno indietro, poi sposto
  await p.click('#bBgR90'); await p.click('#bBgL90'); const rot = await p.evaluate(()=>piano().bg.rot);
  await p.click('#bBgMove'); a = await pxToScreen(600,500);
  await p.mouse.move(a.x, a.y); await p.mouse.down(); await p.mouse.move(a.x+60, a.y+40, {steps:5}); await p.mouse.up();
  const bg2 = await p.evaluate(()=>({ox:piano().bg.ox, oy:piano().bg.oy}));
  await p.click('#cBgLock'); await p.evaluate(()=>{ fit(); draw(); });
  // ricalco: disegno il contorno sopra l'immagine
  await p.$eval('[data-mode="draw"]', b => b.click());
  const corners = []; for (const [u,v] of [[100,100],[1100,100],[1100,900],[100,900],[100,100]]) corners.push(await pxToScreen(u,v));
  await p.mouse.move(corners[0].x, corners[0].y); await p.mouse.down(); for (const q of corners.slice(1)) await p.mouse.move(q.x, q.y, {steps:8}); await p.mouse.up(); await p.waitForTimeout(200);
  const walls = await p.evaluate(()=>({n:piano().walls.length, bb:G.bbox && G.bbox.map(v=>+v.toFixed(2))}));
  await p.screenshot({path:require('path').join(OUT, 'bg.png'), clip:{x:20,y:200,width:1000,height:700}});
  // ricarico: l'immagine torna dal database
  await p.reload(); await p.waitForTimeout(800); const back = await p.evaluate(()=>!!document.querySelector('#svg image'));
  console.log(JSON.stringify({panel0, bg0:{pw:bg0.pw, ph:bg0.ph, m:bg0.m}, bg1, rot, bg2, walls, back})); console.log('errors', errs); await b.close();
})();
