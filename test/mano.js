const APP = require('url').pathToFileURL(require('path').resolve(__dirname, '..', 'index.html')).href;
const OUT = require('path').join(__dirname, 'out'); require('fs').mkdirSync(OUT, {recursive: true});
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch(); const errs=[]; const out={};
const p=await b.newPage({viewport:{width:1280,height:800}}); p.on('pageerror',e=>errs.push(e.message));
await p.goto(process.argv[2]||APP); await p.evaluate(()=>localStorage.clear()); await p.reload(); await p.waitForTimeout(300);
await p.click('#bFull'); await p.waitForTimeout(200);
await p.click('[data-fly="note"]'); await p.waitForTimeout(100); out.fly=await p.isVisible('[data-mode="gomma"]');
out.mode=await p.evaluate(()=>ui.mode);
await p.click('[data-mode="ink"]'); out.mode2=await p.evaluate(()=>ui.mode);
const R=await p.evaluate(()=>{const r=document.querySelector('#svg').getBoundingClientRect(); return [r.left,r.top];});
// scrivo una "X" e una firma col mouse
const line=async(pts)=>{ await p.mouse.move(R[0]+pts[0][0],R[1]+pts[0][1]); await p.mouse.down(); for (const q of pts.slice(1)) await p.mouse.move(R[0]+q[0],R[1]+q[1],{steps:6}); await p.mouse.up(); };
await line([[300,300],[360,360]]); await line([[360,300],[300,360]]);
await line([[400,330],[420,310],[440,350],[460,300],[480,340],[500,320]]);
out.ink=await p.evaluate(()=>piano().ink.map(k=>k.pts.length));
// penna simulata: eventi pointer con pointerType pen
await p.evaluate(([l,t])=>{ const svg=document.querySelector('#svg'); const ev=(ty,x,y)=>svg.dispatchEvent(new PointerEvent(ty,{pointerId:7,pointerType:'pen',clientX:l+x,clientY:t+y,bubbles:true,isPrimary:true,button:0,buttons:1}));
  ev('pointerdown',550,300); for(let i=1;i<=20;i++) ev('pointermove',550+i*3,300+Math.sin(i/3)*20); ev('pointerup',610,300); }, R);
out.ink2=await p.evaluate(()=>({n:piano().ink.length, pen:!!ui.penSeen}));
// col dito, dopo la penna, non scrive (sposta la vista)
const v0=await p.evaluate(()=>ui.view.x);
await p.evaluate(([l,t])=>{ const svg=document.querySelector('#svg'); const ev=(ty,x,y)=>svg.dispatchEvent(new PointerEvent(ty,{pointerId:9,pointerType:'touch',clientX:l+x,clientY:t+y,bubbles:true,isPrimary:true,button:0,buttons:1}));
  ev('pointerdown',700,500); for(let i=1;i<=10;i++) ev('pointermove',700+i*8,500); ev('pointerup',780,500); }, R);
out.finger=await p.evaluate(v0=>({n:piano().ink.length, panned:ui.view.x!==v0}), v0);
await p.screenshot({path:require('path').join(OUT, 'mano1.png')});
// selezione con un tocco
await p.$eval('[data-mode="select"]', b=>b.click()); const xq=await p.evaluate(()=>{const k=piano().ink[0]; return [SX((k.pts[0][0]+k.pts[1][0])/2), SY((k.pts[0][1]+k.pts[1][1])/2)];}); await p.mouse.click(R[0]+xq[0],R[1]+xq[1]); await p.waitForTimeout(100);
out.sel=await p.evaluate(()=>({sel:ui.sel&&ui.sel.k, head:(document.querySelector('#side .cardh')||{}).textContent}));
await p.screenshot({path:require('path').join(OUT, 'mano2.png')});
await p.click('[data-rmink]'); out.afterDel=await p.evaluate(()=>piano().ink.length);
await p.click('#bUndo'); out.afterUndo=await p.evaluate(()=>piano().ink.length);
// gomma
await p.$eval('[data-mode="gomma"]', b=>b.click()); const gx=await p.evaluate(()=>{const k=piano().ink[2]; return [SX(k.pts[2][0]), SY(k.pts[2][1])];}); await line([[gx[0],gx[1]-40],[gx[0],gx[1]+40]]); out.gomma=await p.evaluate(()=>piano().ink.length);
// rettangolo
await p.$eval('[data-win]', b=>b.click()); await p.mouse.click(R[0]+1200,R[1]+690); await p.mouse.click(R[0]+5,R[1]+5); out.rett=await p.evaluate(()=>ui.sel&&ui.sel.k==='m'?ui.sel.i.length:ui.sel&&ui.sel.k);
// script
out.scr0=await p.evaluate(()=>/note a mano/.test(genScript(piano())));
await p.evaluate(()=>{R.opt.mano=true;}); out.scr1=await p.evaluate(()=>{const s=genScript(piano()); const i=s.indexOf('note a mano'); return s.slice(i,i+120).replace(/\n/g,' | ');});
// zoom con due dita mentre si è in A mano: nessun tratto
console.log(JSON.stringify(out)); console.log('errors',errs); await b.close();})();
