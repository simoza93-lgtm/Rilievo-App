const APP = require('url').pathToFileURL(require('path').resolve(__dirname, '..', 'index.html')).href;
const OUT = require('path').join(__dirname, 'out'); require('fs').mkdirSync(OUT, {recursive: true});
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch(); const errs=[]; const out={};
const p=await b.newPage({viewport:{width:1280,height:800}}); p.on('pageerror',e=>errs.push(e.message));
await p.goto(process.argv[2]||APP); await p.evaluate(()=>localStorage.clear()); await p.reload(); await p.waitForTimeout(300);
await p.click('#bFull'); await p.waitForTimeout(200);
await p.$eval('[data-mode="select"]', b=>b.click());
const scrOf=(c)=>p.evaluate(c=>{ const r=document.querySelector('#svg').getBoundingClientRect(); const g=document.querySelector('#vg'); const pt=document.querySelector('#svg').createSVGPoint(); pt.x=SX(c[0]); pt.y=SY(c[1]); const m=g.getCTM(); const q=pt.matrixTransform(m); return {x:r.left+q.x - (document.querySelector('#svg').getCTM().e||0), y:r.top+q.y - (document.querySelector('#svg').getCTM().f||0)}; }, c);
for (const k of [0,1,2,3]) {
  if (k) { await p.click('#bRotR'); await p.waitForTimeout(150); }
  const info=await p.evaluate(()=>({rot:R.vrot, W:ui.W, H:ui.H, Wr:ui.Wr, Hr:ui.Hr, lab:document.querySelector('#bRot0').textContent}));
  // tocco al centro di una finestra: deve selezionare quella finestra
  const o=await p.evaluate(()=>{const o=G.ops.find(o=>o.ap.tipo==='finestra'); return {id:o.ap.id, c:o.at((o.s0+o.s1)/2,o.I.t/2)};});
  const q=await scrOf(o.c); await p.mouse.click(q.x,q.y); await p.waitForTimeout(120);
  const sel=await p.evaluate(()=>ui.sel&&ui.sel.ap);
  // scritte capovolte?
  const upside=await p.evaluate(()=>{ let bad=0; document.querySelectorAll('#vg text').forEach(t=>{ const m=t.getCTM(); const ang=Math.atan2(m.b,m.a)*180/Math.PI; if (ang>=90.5||ang<=-179.5) bad++; }); return bad; });
  await p.keyboard.press('Escape'); await p.evaluate(()=>{ui.sel=null; draw(); renderSide();}); 
  out['r'+k]={info, sel:sel===o.id, upside};
  await p.screenshot({path:require('path').join(OUT, `rot${k}.png`)});
}
// disegno un tramezzo con la vista girata di 270°: deve venire dritto e nel posto toccato
await p.$eval('[data-tw="T"]', b=>b.click());
const n0=await p.evaluate(()=>piano().walls.length);
const a=await scrOf(await p.evaluate(()=>{const c=G.comps.find(c=>c.rec&&/Soggiorno/.test(c.rec.nome)); return [(c.bbox[0]+c.bbox[2])/2,c.bbox[1]+0.5];}));
const c2=await scrOf(await p.evaluate(()=>{const c=G.comps.find(c=>c.rec&&/Soggiorno/.test(c.rec.nome)); return [(c.bbox[0]+c.bbox[2])/2,c.bbox[3]-0.5];}));
await p.mouse.move(a.x,a.y); await p.mouse.down(); await p.mouse.move(c2.x,c2.y,{steps:12}); await p.mouse.up(); await p.waitForTimeout(200);
out.draw=await p.evaluate(n0=>{ const pl=piano(); const w=pl.walls[pl.walls.length-1]; const A=nd(pl,w.a), B=nd(pl,w.b); return {added:pl.walls.length-n0, vertical:Math.abs(A.x-B.x)<0.01, x:+A.x.toFixed(2)}; }, n0);
await p.click('#bRot0'); out.reset=await p.evaluate(()=>({rot:R.vrot, W:ui.W}));
console.log(JSON.stringify(out)); console.log('errors',errs); await b.close();})();
