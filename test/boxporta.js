const APP = require('url').pathToFileURL(require('path').resolve(__dirname, '..', 'index.html')).href;
const OUT = require('path').join(__dirname, 'out'); require('fs').mkdirSync(OUT, {recursive: true});
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch(); const errs=[]; const out={};
const p=await b.newPage({viewport:{width:1280,height:800}}); p.on('pageerror',e=>errs.push(e.message));
await p.goto(process.argv[2]||APP); await p.evaluate(()=>localStorage.clear()); await p.reload(); await p.waitForTimeout(300);
await p.click('#bFull'); await p.waitForTimeout(200);
for (const mode of ['select','draw']) {
  await p.evaluate(()=>{ const o=G.ops.find(o=>o.door); o.ap.lp=true; o.ap.vx=!o.ap.vx; update(true); const c=o.door.c; const v=ui.view; v.s=140; v.x=c[0]-ui.W/2/v.s; v.y=c[1]-ui.H/2/v.s; draw(); });
  await p.$eval(mode==='select'?'[data-mode="select"]':'[data-tw="T"]', b=>b.click());
  // seleziono la porta toccando il vano
  const vc=await p.evaluate(()=>{const o=G.ops.find(o=>o.door); const r=document.querySelector('#svg').getBoundingClientRect(); const q=o.at((o.s0+o.s1)/2,o.I.t/2); return [r.left+SX(q[0]), r.top+SY(q[1])];});
  await p.mouse.click(vc[0],vc[1]); await p.waitForTimeout(150);
  const bx=await p.evaluate(()=>{const o=G.ops.find(o=>o.door); const r=document.querySelector('#svg').getBoundingClientRect(); const e=ui.pbb.find(x=>x.hb.kind==='w'&&x.hb.ap===o.ap.id); return e && {x:r.left+e.box[0]+e.box[2]/2, y:r.top+e.box[1]+e.box[3]/2, w:e.box[2], inSector:!!doorAt([e.box[0]+e.box[2]/2, e.box[1]+e.box[3]/2])};});
  if (bx) { await p.mouse.click(bx.x,bx.y); await p.waitForTimeout(150); }
  out[mode]={sel:await p.evaluate(()=>ui.sel&&ui.sel.k), bx, popup:await p.evaluate(()=>(document.querySelector('#inl .ms')||{}).textContent||null)};
  await p.keyboard.press('Escape'); await p.waitForTimeout(100);
}
console.log(JSON.stringify(out)); console.log('errors',errs); await b.close();})();
