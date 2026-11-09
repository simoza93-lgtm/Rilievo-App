const APP = require('url').pathToFileURL(require('path').resolve(__dirname, '..', 'index.html')).href;
const OUT = require('path').join(__dirname, 'out'); require('fs').mkdirSync(OUT, {recursive: true});
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch(); const errs=[];
const p=await b.newPage({viewport:{width:1280,height:800}, colorScheme:'dark'}); p.on('pageerror',e=>errs.push(e.message));
await p.goto(process.argv[2]||APP); await p.evaluate(()=>localStorage.clear()); await p.reload(); await p.waitForTimeout(300);
await p.click('#bFull'); await p.waitForTimeout(200);
const info=[];
for (const [f,n] of [[0.4,'bk_lontano'],[1,'bk_adatta'],[2.6,'bk_vicino']]) {
  await p.evaluate(f=>{ fit(); const v=ui.view, cx=v.x+ui.W/2/v.s, cy=v.y+ui.H/2/v.s; v.s*=f; v.x=cx-ui.W/2/v.s; v.y=cy-ui.H/2/v.s; draw(); }, f);
  info.push(await p.evaluate(()=>({s:+ui.view.s.toFixed(1), K:+ui.bk.toFixed(2), box:ui.pbb[0]&&ui.pbb[0].box.map(x=>+x.toFixed(1))})));
  await p.screenshot({path:require('path').join(OUT, `${n}.png`)});
}
// tocco su una casella da vicino apre il tastierino
const bx=await p.evaluate(()=>{const r=document.querySelector('#svg').getBoundingClientRect(); const b=ui.pbb[0].box; return [r.left+b[0]+b[2]/2, r.top+b[1]+b[3]/2];});
await p.mouse.click(bx[0],bx[1]); await p.waitForTimeout(150); const pop=await p.evaluate(()=>!!document.querySelector('#inl'));
console.log(JSON.stringify(info), 'popup', pop); console.log('errors',errs); await b.close();})();
