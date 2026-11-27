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
// agganci tra le linee (tutto in pixel, lontano dai muri e dalle altre linee)
await p.evaluate(()=>{ piano().ink=[]; ui.view={x:ui.view.x+60,y:ui.view.y,s:ui.view.s}; draw(); });
const px=k=>p.evaluate(k=>{const q=piano().ink[k].pts; return [q[0],q[q.length-1]].map(c=>[SX(c[0]),SY(c[1])]);},k);
const vicino=(a,c)=>Math.hypot(a[0]-c[0],a[1]-c[1])<0.2;
await stroke(wobble(200,200,500,200,20,2),true); const A=await px(0);
await stroke(wobble(A[1][0]+7,A[1][1]+6,A[1][0]+9,400,20,2),true); const B=await px(1); out.partenzaSuEstremo=vicino(B[0],A[1]);
await stroke(wobble(300,420,303,A[0][1]-5,20,2),true); const C=await px(2); out.arrivoSuLinea=Math.abs(C[1][1]-A[0][1])<0.2;
await stroke(wobble(700,300,A[1][0]+8,A[1][1]-6,20,2),true); const D=await px(3); out.arrivoSuEstremo=vicino(D[1],A[1]);
await stroke(wobble(200,600,420,640,20,6),false); const E=await px(4);
await stroke(wobble(E[1][0]+6,E[1][1]+6,E[1][0]+8,780,20,2),true); const F=await px(5); out.drittaSuManoLibera=vicino(F[0],E[1]);
await stroke(wobble(E[0][0]+6,E[0][1]+6,150,780,20,6),false); const H=await px(6); out.manoLiberaNonSiSposta=Math.abs(H[0][0]-E[0][0]-6)<1.5;
out.quadratino=await p.evaluate(()=>!!document.querySelector('#lnMark'));
// il quadratino blu si vede mentre la penna è ancora giù sull'aggancio
{ const t=wobble(E[1][0]+60,E[1][1],E[1][0]+5,E[1][1]+4,12,1); await ev('pointerdown',...t[0]); for (const q of t.slice(1)) await ev('pointermove',...q); await p.waitForTimeout(650);
  out.quadratinoDurante=await p.evaluate(()=>!!document.querySelector('#lnMark')); await ev('pointerup',...t[t.length-1]); await p.waitForTimeout(60); }
// a vista girata di 90 gradi
await p.evaluate(()=>{ piano().ink=[]; R.vrot=1; draw(); });
const vista=(x,y)=>p.evaluate(([x,y])=>{const W=ui.Wr; return [W-y,x];},[x,y]);   // vista -> schermo, rotazione 1
const strokeV=async pts=>{ const q=[]; for (const c of pts) q.push(await vista(...c)); await stroke(q,true); };
await strokeV(wobble(250,300,450,300,20,2)); const G1=await px(0); await strokeV(wobble(G1[1][0]+7,G1[1][1]+6,G1[1][0]+9,450,20,2)); const G2=await px(1); out.girata=vicino(G2[0],G1[1]);
await p.evaluate(()=>{ R.vrot=0; draw(); });
await p.screenshot({path:require('path').join(OUT,'orto.png')});
console.log(JSON.stringify(out)); console.log('errors',errs); await b.close();})();
