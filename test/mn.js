const APP = require('url').pathToFileURL(require('path').resolve(__dirname, '..', 'index.html')).href;
const OUT = require('path').join(__dirname, 'out'); require('fs').mkdirSync(OUT, {recursive: true});
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch(); const errs=[]; const out={};
const p=await b.newPage({viewport:{width:1280,height:800}, colorScheme:'dark'}); p.on('pageerror',e=>errs.push(e.message));
await p.goto(process.argv[2]||APP); await p.evaluate(()=>localStorage.clear()); await p.reload(); await p.waitForTimeout(300);
await p.click('#bFull'); await p.waitForTimeout(200);
// tolgo qualche misura per avere tratti da misurare
await p.evaluate(()=>{ const pl=piano(); pl.fm={}; pl.mord=[]; pl.walls.forEach(w=>{w.mis='';}); update(true); });
out.items=await p.evaluate(()=>{const I=measItems(); const c={}; I.forEach(x=>c[x.st]=(c[x.st]||0)+1); return {c, guide:guideCount(), lab:document.querySelector('[data-guide] span').textContent};});
await p.screenshot({path:require('path').join(OUT, 'mn1.png')});
// tocco una stanza: compaiono caselle e ricavate
await p.$eval('[data-mode="select"]', b=>b.click());
const rc=await p.evaluate(()=>{const c=G.comps.find(c=>c.rec&&/Cucina/.test(c.rec.nome)); const r=document.querySelector('#svg').getBoundingClientRect(); return [r.left+SX((c.bbox[0]+c.bbox[2])/2), r.top+SY((c.bbox[1]+c.bbox[3])/2)];});
await p.mouse.click(rc[0],rc[1]); await p.waitForTimeout(150);
out.foc=await p.evaluate(()=>({sel:ui.sel&&ui.sel.k, foc:[...focusComps()].length}));
await p.screenshot({path:require('path').join(OUT, 'mn2.png')});
// misura guidata
await p.click('[data-guide]'); await p.waitForTimeout(200);
out.g1=await p.evaluate(()=>({open:!!document.querySelector('#inl'), sub:(document.querySelector('#inl .ms')||{}).textContent, cur:ui.guide&&ui.guide.cur, room:ui.guide&&G.comps[ui.guide.room].rec.nome}));
await p.screenshot({path:require('path').join(OUT, 'mn3.png')});
await p.keyboard.type('3,3'); await p.keyboard.press('Enter'); await p.waitForTimeout(250);
out.g2=await p.evaluate(()=>({open:!!document.querySelector('#inl'), sub:(document.querySelector('#inl .ms')||{}).textContent, left:ui.guide&&ui.guide.left}));
await p.click('#inl [data-k="skip"]'); await p.waitForTimeout(250);
out.g3=await p.evaluate(()=>({open:!!document.querySelector('#inl'), sub:(document.querySelector('#inl .ms')||{}).textContent, skip:ui.guide&&ui.guide.skip.size}));
await p.click('#inl [data-k="x"]'); await p.waitForTimeout(150);
out.g4=await p.evaluate(()=>({open:!!document.querySelector('#inl'), guide:!!ui.guide, lab:document.querySelector('[data-guide] span').textContent}));
// tocco su un pallino: si apre il tastierino
await p.evaluate(()=>{ui.sel=null; draw(); renderSide();});
const dot=await p.evaluate(()=>{const r=document.querySelector('#svg').getBoundingClientRect(); const e=ui.pbb.find(x=>x.box[2]===24); return e && [r.left+e.box[0]+12, r.top+e.box[1]+12];});
if (dot) { await p.mouse.click(dot[0],dot[1]); await p.waitForTimeout(150); }
out.dot=await p.evaluate(()=>!!document.querySelector('#inl'));
await p.keyboard.press('Escape');
// interruttore classico
await p.evaluate(()=>{ ui.mnew=false; draw(); });
await p.screenshot({path:require('path').join(OUT, 'mn4.png')});
console.log(JSON.stringify(out)); console.log('errors',errs); await b.close();})();
