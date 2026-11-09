const APP = require('url').pathToFileURL(require('path').resolve(__dirname, '..', 'index.html')).href;
const OUT = require('path').join(__dirname, 'out'); require('fs').mkdirSync(OUT, {recursive: true});
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch(); const errs=[]; const out={};
for (const pt of ['mouse','touch']) {
const p=await b.newPage({viewport:{width:1280,height:800}, hasTouch:pt==='touch'}); p.on('pageerror',e=>errs.push(e.message));
await p.goto(APP); await p.evaluate(()=>localStorage.clear()); await p.reload(); await p.waitForTimeout(300);
await p.click('#bFull'); await p.waitForTimeout(200);
await p.$eval('[data-mode="select"]', b=>b.click());
const R=await p.evaluate(()=>{const r=document.querySelector('#svg').getBoundingClientRect(); return [r.left,r.top];});
const tap=async(x,y)=>{ if(pt==='touch') await p.touchscreen.tap(x,y); else await p.mouse.click(x,y); await p.waitForTimeout(150); };
const scr=(c)=>p.evaluate(([c,R])=>({x:R[0]+SX(c[0]),y:R[1]+SY(c[1])}),[c,R]);
const st=()=>p.evaluate(()=>({sel:ui.sel&&ui.sel.k+(ui.sel.ap?':ap':''), winA:!!ui.winA, winRect:!!document.querySelector('#winrect:not([style*="none"])'), head:(document.querySelector('#side .cardh')||{}).textContent, flip:document.querySelectorAll('[data-flip]').length}));
const r={};
// 1) tocco dentro un ambiente
const rc=await p.evaluate(()=>{const c=G.comps.find(c=>c.room&&c.rec); return [(c.bbox[0]+c.bbox[2])/2,(c.bbox[1]+c.bbox[3])/2+0.3];});
let q=await scr(rc); await tap(q.x,q.y); r.room=await st();
// 2) tocco sul vuoto
await tap(R[0]+30,R[1]+400); r.empty=await st();
// 3) porta
const dc=await p.evaluate(()=>{const o=G.ops.find(o=>o.door); return o.at((o.s0+o.s1)/2,o.I.t/2);}); q=await scr(dc); await tap(q.x,q.y); r.door=await st();
await p.screenshot({path:require('path').join(OUT, `sel_${pt}_door.png`)});
// 4) finestra
const fc=await p.evaluate(()=>{const o=G.ops.find(o=>o.ap.tipo==='finestra'); return o.at((o.s0+o.s1)/2,o.I.t/2);}); q=await scr(fc); await tap(q.x,q.y); r.win=await st();
await p.screenshot({path:require('path').join(OUT, `sel_${pt}_win.png`)});
// 5) muro (tratto pieno)
const wc=await p.evaluate(()=>{const o=G.ops.find(o=>o.ap.tipo==='finestra'); return o.at(o.s1+0.6,o.I.t/2);}); q=await scr(wc); await tap(q.x,q.y); r.wall=await st();
if (pt==='mouse') {
 // trascinamento in selezione: sposta la vista, niente rettangolo
 const v0=await p.evaluate(()=>[ui.view.x,ui.view.y]); await p.mouse.move(R[0]+40,R[1]+420); await p.mouse.down(); await p.mouse.move(R[0]+140,R[1]+470,{steps:5}); const mid=await st(); await p.mouse.up(); const v1=await p.evaluate(()=>[ui.view.x,ui.view.y]);
 r.drag={mid, moved: v0[0]!==v1[0]};
 // pannello: elimina la finestra
 q=await scr(fc); await tap(q.x,q.y); const n0=await p.evaluate(()=>piano().walls.reduce((a,w)=>a+(w.ap||[]).length,0));
 await p.click('[data-gowall]'); r.gowall=await st(); q=await scr(fc); await tap(q.x,q.y);
 await p.click('[data-rmsel]'); const n1=await p.evaluate(()=>piano().walls.reduce((a,w)=>a+(w.ap||[]).length,0)); r.del=[n0,n1, await st()];
 // rettangolo ancora funzionante
 await p.$eval('[data-win]', b=>b.click()); await tap(R[0]+1100,R[1]+650); await tap(R[0]+15,R[1]+15); r.rett=await p.evaluate(()=>ui.sel&&ui.sel.k);
}
out[pt]=r; await p.close(); }
console.log(JSON.stringify(out,null,0)); console.log('errors',errs); await b.close();})();
