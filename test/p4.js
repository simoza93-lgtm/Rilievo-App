const APP = require('url').pathToFileURL(require('path').resolve(__dirname, '..', 'index.html')).href;
const OUT = require('path').join(__dirname, 'out'); require('fs').mkdirSync(OUT, {recursive: true});
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({viewport:{width:1280,height:800}, hasTouch:true});
  const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  await p.goto(APP); await p.evaluate(()=>localStorage.clear()); await p.reload();
  await p.evaluate(()=>{ R = blank(); R.id='t7'; tab='pianta'; render(); const pl = piano();
    const pts=[[0,0],[4.5,0],[4.5,3.5],[0,3.5],[0,0]]; for(let i=0;i<pts.length-1;i++) addSegment(pl,{x:pts[i][0],y:pts[i][1]},{x:pts[i+1][0],y:pts[i+1][1]},'P'); update(true);
    const wb = pl.walls.find(w=>{const a=nd(pl,w.a),b=nd(pl,w.b); return isH(a,b) && a.y < 1;});
    wb.ap = [{id:'p1', tipo:'uscita', d:'0,90', l:'1,20', h:'2,20', dav:'', inv:false, dp:true, lp:true}]; update(true);
    ui.view.s = 110; fit(); ui.view.s = Math.max(ui.view.s, 100); ui.view.x = -0.6; ui.view.y = -1.2; ui.mode='select'; updTools(); draw(); });
  // tocco con il dito la casella della larghezza
  const bx = await p.evaluate(()=>{ const r=document.querySelector('#svg').getBoundingClientRect(); const it=ui.pbb.find(x=>x.hb.kind==='w'); return {x:r.left+it.box[0]+it.box[2]/2, y:r.top+it.box[1]+it.box[3]/2}; });
  await p.screenshot({path:require('path').join(OUT, 'parz4a.png'), clip:{x:0,y:150,width:900,height:600}});
  await p.touchscreen.tap(bx.x, bx.y); await p.waitForTimeout(250);
  const focus = await p.evaluate(()=>document.activeElement && document.activeElement.id + ' ' + document.activeElement.placeholder);
  await p.keyboard.type('1,18'); await p.keyboard.press('Enter'); await p.waitForTimeout(150);
  const ap = await p.evaluate(()=>piano().walls.flatMap(w=>w.ap||[])[0]);
  await p.screenshot({path:require('path').join(OUT, 'parz4b.png'), clip:{x:0,y:150,width:900,height:600}});
  console.log(focus, JSON.stringify(ap)); console.log('errors',errs); await b.close();
})();
