const APP = require('url').pathToFileURL(require('path').resolve(__dirname, '..', 'index.html')).href;
const OUT = require('path').join(__dirname, 'out'); require('fs').mkdirSync(OUT, {recursive: true});
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch(); const errs=[];
for (const [W,H,name] of [[1280,800,'tb1280'],[800,1280,'tb800'],[390,844,'tb390']]) {
const p=await b.newPage({viewport:{width:W,height:H}}); p.on('pageerror',e=>errs.push(e.message));
await p.goto(APP); await p.evaluate(()=>localStorage.clear()); await p.reload(); await p.waitForTimeout(300);
await p.screenshot({path:require('path').join(OUT, `${name}.png`), clip:{x:0,y:0,width:W,height:Math.min(H,330)}});
if (W===1280){
  // Aperture flyout
  await p.click('[data-fly="ap"]'); await p.waitForTimeout(100);
  await p.screenshot({path:require('path').join(OUT, 'tb_fly.png'), clip:{x:0,y:0,width:W,height:330}});
  const vis=await p.isVisible('[data-ap="porta"]'); await p.click('[data-ap="porta"]');
  const st=await p.evaluate(()=>({place:ui.place, open:!!document.querySelector('.tg.open'), lab:document.querySelector('[data-fly="ap"] span').textContent, on:document.querySelector('[data-fly="ap"]').classList.contains('on')}));
  // Muri -> Tramezzi
  await p.click('[data-fly="muri"]'); const st2=await p.evaluate(()=>({mode:ui.mode,place:ui.place,nt:ui.newType}));
  await p.click('[data-tw="T"]'); const st3=await p.evaluate(()=>({mode:ui.mode,nt:ui.newType,lab:document.querySelector('[data-fly="muri"] span').textContent,on:document.querySelector('[data-fly="muri"]').classList.contains('on'),open:!!document.querySelector('.tg.open')}));
  // Seleziona
  await p.click('[data-fly="sel"]'); const st4=await p.evaluate(()=>({mode:ui.mode,open:!!document.querySelector('.tg.open'), muriOn:document.querySelector('[data-fly="muri"]').classList.contains('on')}));
  await p.click('[data-win]'); const st5=await p.evaluate(()=>({arm:!!ui.winArm,lab:document.querySelector('[data-fly="sel"] span').textContent}));
  // tap fuori chiude
  await p.click('[data-fly="ap"]'); await p.mouse.click(600,500); const st6=await p.evaluate(()=>!!document.querySelector('.tg.open'));
  // undo/redo
  const n0=await p.evaluate(()=>piano().walls.length);
  await p.evaluate(()=>{pushUndo(); piano().walls.pop(); update(true);});
  const n1=await p.evaluate(()=>piano().walls.length);
  await p.click('#bUndo'); const n2=await p.evaluate(()=>piano().walls.length);
  await p.click('#bRedo'); const n3=await p.evaluate(()=>piano().walls.length);
  await p.click('#bRedo'); const n4=await p.evaluate(()=>piano().walls.length);
  await p.keyboard.press('Control+z'); const n5=await p.evaluate(()=>piano().walls.length);
  await p.keyboard.press('Control+y'); const n6=await p.evaluate(()=>piano().walls.length);
  await p.click('label.tb:has(#cLab)'); const lab=await p.evaluate(()=>ui.labels);
  await p.click('#bFull'); await p.waitForTimeout(200); const fullTxt=await p.textContent('#bFull');
  await p.screenshot({path:require('path').join(OUT, 'tb_full.png'), clip:{x:0,y:0,width:W,height:300}});
  console.log(JSON.stringify({vis,st,st2,st3,st4,st5,st6,und:[n0,n1,n2,n3,n4,n5,n6],lab,fullTxt}));
}
await p.close();}
console.log('errors',errs); await b.close();})();
