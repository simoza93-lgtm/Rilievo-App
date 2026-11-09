const APP = require('url').pathToFileURL(require('path').resolve(__dirname, '..', 'index.html')).href;
const OUT = require('path').join(__dirname, 'out'); require('fs').mkdirSync(OUT, {recursive: true});
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch(); const errs=[]; const out={};
const p=await b.newPage({viewport:{width:1280,height:800}, colorScheme:'dark'}); p.on('pageerror',e=>errs.push(e.message));
await p.goto(process.argv[2]||APP); await p.evaluate(()=>localStorage.clear()); await p.reload(); await p.waitForTimeout(300);
await p.click('#bFull'); await p.waitForTimeout(200);
const R=()=>p.evaluate(()=>{const r=document.querySelector('#svg').getBoundingClientRect(); return [r.left,r.top];});
// zoom sulla prima porta
await p.evaluate(()=>{ const o=G.ops.find(o=>o.door); const c=o.door.c; ui.view.s=120; ui.view.x=c[0]-ui.W/2/ui.view.s; ui.view.y=c[1]-ui.H/2/ui.view.s; draw(); });
const scr=async(c)=>{ const [l,t]=await R(); return p.evaluate(([c,l,t])=>({x:l+SX(c[0]),y:t+SY(c[1])}),[c,l,t]); };
// 1) modalità Muri (disegno): tocco nello spicchio dell'anta
await p.$eval('[data-tw="T"]', b=>b.click());
let mid=await p.evaluate(()=>{const D=G.ops.find(o=>o.door).door; return [(D.c[0]+D.pm[0])/2,(D.c[1]+D.pm[1])/2];});
let q=await scr(mid); await p.mouse.click(q.x,q.y); await p.waitForTimeout(150);
out.draw=await p.evaluate(()=>({selAp:ui.selAp, btn:document.querySelectorAll('[data-flip]').length, walls:piano().walls.length}));
await p.screenshot({path:require('path').join(OUT, 'anta3.png')});
// 2) premi ⇄ e ⇅
for (const k of ['cx','vx']) { const [l,t]=await R(); const bp=await p.evaluate(k=>flipBtns().find(b=>b.k===k).p,k); await p.mouse.click(l+bp[0],t+bp[1]); await p.waitForTimeout(120); }
out.flip=await p.evaluate(()=>{const o=selDoor(); return o&&{cx:o.ap.cx,vx:o.ap.vx,btn:document.querySelectorAll('[data-flip]').length};});
await p.screenshot({path:require('path').join(OUT, 'anta4.png')});
// 3) tocco altrove: si deseleziona
await p.mouse.click(200,600); await p.waitForTimeout(120);
out.off=await p.evaluate(()=>({selAp:ui.selAp, btn:document.querySelectorAll('[data-flip]').length}));
// 4) modalità Seleziona: tocco sul vano
await p.$eval('[data-mode="select"]', b=>b.click());
const vc=await p.evaluate(()=>{const o=G.ops.find(o=>o.door); return o.at((o.s0+o.s1)/2,o.I.t/2);}); q=await scr(vc); await p.mouse.click(q.x,q.y); await p.waitForTimeout(150);
out.sel=await p.evaluate(()=>({selAp:ui.selAp, sel:ui.sel&&ui.sel.k, btn:document.querySelectorAll('[data-flip]').length}));
// 5) posa nuova porta: tasti subito
await p.evaluate(()=>{ fit(); draw(); });
await p.$eval('[data-ap="porta"]', b=>b.click());
const wpt=await p.evaluate(()=>{ const w=piano().walls.find(w=>w.l==='T'||w.tipo==='T')||piano().walls[5]; const I=G.T.info.get(w.id); const r=document.querySelector('#svg').getBoundingClientRect(); const x=I.H?(I.a.x+I.b.x)/2:I.a.x+I.o, y=I.H?I.a.y+I.o:(I.a.y+I.b.y)/2; return {x:r.left+SX(x),y:r.top+SY(y)}; });
await p.mouse.move(wpt.x,wpt.y); await p.mouse.down(); await p.mouse.move(wpt.x+1,wpt.y+1); await p.mouse.up(); await p.waitForTimeout(200);
out.place=await p.evaluate(()=>({selAp:ui.selAp, btn:document.querySelectorAll('[data-flip]').length, toast:(document.querySelector('#toast')||{}).textContent}));
console.log(JSON.stringify(out)); console.log('errors',errs); await b.close();})();
