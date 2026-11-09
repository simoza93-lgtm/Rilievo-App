const APP = require('url').pathToFileURL(require('path').resolve(__dirname, '..', 'index.html')).href;
const OUT = require('path').join(__dirname, 'out'); require('fs').mkdirSync(OUT, {recursive: true});
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({viewport:{width:1400,height:950}, hasTouch:true});
  const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  await p.goto(APP); await p.evaluate(()=>localStorage.clear()); await p.reload();
  await p.evaluate(()=>{ R = blank(); R.id='t8'; tab='pianta'; render(); const pl = piano();
    const pts=[[0,0],[6,0],[6,4],[0,4],[0,0]]; for(let i=0;i<pts.length-1;i++) addSegment(pl,{x:pts[i][0],y:pts[i][1]},{x:pts[i+1][0],y:pts[i+1][1]},'P');
    addSegment(pl,{x:3.5,y:0},{x:3.5,y:4},'T'); update(true); fit(); draw(); });
  const S = (x,y)=>p.evaluate(([x,y])=>{ const r=document.querySelector('#svg').getBoundingClientRect(); return {x:r.left+SX(x), y:r.top+SY(y)}; },[x,y]);
  const toast = ()=>p.evaluate(()=>document.querySelector('#toast').textContent);
  const nodes = await p.evaluate(()=>piano().nodes.map(n=>[n.x,n.y]));
  console.log('nodi', JSON.stringify(nodes));
  await p.click('[data-dim]');
  // 1) dentro lo spessore del muro sinistro (asse): si aggancia alla faccia più vicina, non all'asse
  let q = await S(0.15, 2.0); await p.mouse.click(q.x, q.y); await p.waitForTimeout(80);
  console.log('A asse muro ->', JSON.stringify(await p.evaluate(()=>ui.dimA)));
  await p.evaluate(()=>{ ui.dimA=null; });
  // 2) in mezzo alla stanza: niente
  q = await S(1.5, 2.0); await p.mouse.click(q.x, q.y); await p.waitForTimeout(80);
  console.log('B stanza ->', JSON.stringify(await p.evaluate(()=>ui.dimA)), await toast());
  // 3) due punti sullo stesso filo orizzontale: rifiutato
  q = await S(1.0, 0.31); await p.mouse.click(q.x, q.y); q = await S(2.5, 0.31); await p.mouse.click(q.x, q.y); await p.waitForTimeout(80);
  console.log('C parallelo ->', await toast(), JSON.stringify(await p.evaluate(()=>[piano().dims||[], !!ui.dimA])));
  await p.evaluate(()=>{ ui.dimA=null; });
  // 4) filo interno muro sinistro -> filo del tramezzo (a metà altezza), con il dito e tenendo premuto
  q = await S(0.31, 2.2); await p.touchscreen.tap(q.x, q.y); await p.waitForTimeout(80);
  q = await S(3.44, 1.8); await p.touchscreen.tap(q.x, q.y); await p.waitForTimeout(200);
  await p.keyboard.type('3,10'); await p.keyboard.press('Enter'); await p.waitForTimeout(150);
  const r = await p.evaluate(()=>({d:piano().dims.map(d=>({a:d.a,b:d.b,H:d.H})), g:G.dims.map(q=>[f2(q.len),q.meas,q.tied,q.known]), nodes:piano().nodes.map(n=>[n.x,n.y]), warns:G.warns.map(w=>w.t)}));
  console.log(JSON.stringify(r));
  // anteprima: tengo premuto con il mouse
  await p.click('[data-dim]'); q = await S(5.85, 3.0); await p.mouse.move(q.x+3,q.y); await p.mouse.down(); await p.mouse.move(q.x, q.y, {steps:3});
  await p.screenshot({path:require('path').join(OUT, 'filo.png'), clip:{x:20,y:200,width:1000,height:640}}); await p.mouse.up();
  console.log('errors',errs); await b.close();
})();
