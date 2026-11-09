const APP = require('url').pathToFileURL(require('path').resolve(__dirname, '..', 'index.html')).href;
const OUT = require('path').join(__dirname, 'out'); require('fs').mkdirSync(OUT, {recursive: true});
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch(); const errs=[]; const out={};
const p=await b.newPage({viewport:{width:1280,height:800}}); p.on('pageerror',e=>errs.push(e.message));
await p.goto(APP); await p.evaluate(()=>localStorage.clear()); await p.reload(); await p.waitForTimeout(300);
await p.click('#bFull'); await p.waitForTimeout(200);
await p.$eval('[data-mode="ink"]', b=>b.click());
const R=await p.evaluate(()=>{const r=document.querySelector('#svg').getBoundingClientRect(); return [r.left,r.top];});
const ev=(ty,x,y)=>p.evaluate(([ty,x,y,R])=>document.querySelector('#svg').dispatchEvent(new PointerEvent(ty,{pointerId:3,pointerType:'pen',clientX:R[0]+x,clientY:R[1]+y,bubbles:true,isPrimary:true,button:0,buttons:1})),[ty,x,y,R]);
const stroke=async(pts,hold)=>{ await ev('pointerdown',...pts[0]); for (const q of pts.slice(1)) { await ev('pointermove',...q); await p.waitForTimeout(8); } if (hold) await p.waitForTimeout(650); await ev('pointerup',...pts[pts.length-1]); await p.waitForTimeout(60); };
const wobble=(x0,y0,x1,y1,n=20,a=6)=>Array.from({length:n+1},(_,i)=>[x0+(x1-x0)*i/n+Math.sin(i)*a*0.3, y0+(y1-y0)*i/n+Math.sin(i*1.7)*a]);
await stroke(wobble(200,200,500,212),true);      // quasi orizzontale, tenuto: diventa orizzontale
await stroke(wobble(900,250,1100,430),true);       // obliqua ~42°: aggancia a 45°
await stroke(wobble(600,300,610,560),false);       // non tenuta: resta a mano
await stroke([[700,200],[703,215],[700,230],[708,240],[712,226]],true); // lettera breve tenuta: resta a mano
await stroke(Array.from({length:30},(_,i)=>[1000+i*3, 600+Math.sin(i/2)*25]),true); // scrittura ondulata tenuta: resta a mano
const ink=await p.evaluate(()=>piano().ink.map(k=>({n:k.pts.length, ang: k.pts.length===2 ? +(Math.atan2(k.pts[1][1]-k.pts[0][1], k.pts[1][0]-k.pts[0][0])*180/Math.PI).toFixed(2) : null})));
out.ink=ink;
// aggancio a uno spigolo dei muri: parto vicino a uno spigolo
const cor=await p.evaluate(()=>{const q=G.walls[0].pts[0]; return [SX(q[0]),SY(q[1])];});
await stroke(wobble(cor[0]+6,cor[1]+5,cor[0]+200,cor[1]+90),true);
out.snap=await p.evaluate((c)=>{const k=piano().ink[piano().ink.length-1]; const q=G.walls[0].pts[0]; return {d:Math.hypot(k.pts[0][0]-q[0],k.pts[0][1]-q[1]), n:k.pts.length};}, cor);
await p.screenshot({path:require('path').join(OUT,'orto.png')});
console.log(JSON.stringify(out)); console.log('errors',errs); await b.close();})();
