const APP = require('url').pathToFileURL(require('path').resolve(__dirname, '..', 'index.html')).href;
const OUT = require('path').join(__dirname, 'out'); require('fs').mkdirSync(OUT, {recursive: true});
const { chromium } = require('playwright'); const fs=require('fs');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({viewport:{width:1400,height:950}});
  const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  await p.goto(APP); await p.evaluate(()=>localStorage.clear()); await p.reload();
  await p.evaluate(()=>{ R = blank(); R.id='t5'; tab='pianta'; render(); const pl = piano();
    const pts=[[0,0],[5,0],[5,4],[0,4],[0,0]]; for(let i=0;i<pts.length-1;i++) addSegment(pl,{x:pts[i][0],y:pts[i][1]},{x:pts[i+1][0],y:pts[i+1][1]},'P'); update(true); fit(); draw(); });
  const S = (x,y)=>p.evaluate(([x,y])=>{ const r=document.querySelector('#svg').getBoundingClientRect(); return {x:r.left+SX(x), y:r.top+SY(y)}; },[x,y]);
  // ingresso sul muro in basso
  await p.$eval('[data-ap="ingresso"]', b => b.click()); let q = await S(1.8,0);
  await p.mouse.move(q.x,q.y); await p.mouse.down(); await p.mouse.move(q.x+3,q.y,{steps:3}); await p.mouse.up();
  // finestra sul muro in basso a destra
  await p.$eval('[data-ap="finestra"]', b => b.click()); q = await S(3.9,0);
  await p.mouse.move(q.x,q.y); await p.mouse.down(); await p.mouse.move(q.x+3,q.y,{steps:3}); await p.mouse.up();
  await p.$eval('[data-mode="select"]', b => b.click());
  const boxes = () => p.evaluate(()=>{ const r=document.querySelector('#svg').getBoundingClientRect(); return ui.pbb.map(x=>({hb:x.hb, x:r.left+x.box[0]+x.box[2]/2, y:r.top+x.box[1]+x.box[3]/2})); });
  const type = async (pred, val) => { const bs = await boxes(); const it = bs.find(pred); if(!it) throw new Error('box non trovato'); await p.mouse.click(it.x,it.y); await p.waitForTimeout(80); await p.keyboard.type(val); await p.keyboard.press('Enter'); await p.waitForTimeout(120); };
  let bs = await boxes(); console.log('boxes', bs.map(x=>JSON.stringify(x.hb)).join('\n'));
  const ings = await p.evaluate(()=>piano().walls.flatMap(w=>w.ap||[]).map(a=>({id:a.id,tipo:a.tipo,d:a.d,l:a.l,dp:a.dp,lp:a.lp})));
  console.log(JSON.stringify(ings));
  const ing = ings.find(a=>a.tipo==='ingresso').id, fin = ings.find(a=>a.tipo==='finestra').id;
  // lato interno del muro in basso: parziale 1, larghezza ingresso, parziale 2, larghezza finestra, ultima
  await type(x=>x.hb.kind==='p' && x.hb.nx===ing && !x.hb.pv, '1,25');
  await type(x=>x.hb.kind==='w' && x.hb.ap===ing, '1,05');
  await type(x=>x.hb.kind==='p' && x.hb.nx===fin && x.hb.pv===ing, '1,10');
  await type(x=>x.hb.kind==='w' && x.hb.ap===fin, '1,20');
  await type(x=>x.hb.kind==='p' && x.hb.last && x.hb.pv===fin, '0,73');
  let st = await p.evaluate(()=>({nodes:piano().nodes.map(n=>[n.x,n.y]), aps:piano().walls.flatMap(w=>w.ap||[]).map(a=>({d:a.d,l:a.l,pos:a.pos,dp:a.dp,lp:a.lp})), fl:piano().fl, warns:G.warns.map(w=>w.t)}));
  console.log(JSON.stringify(st));
  // altezza interna con quota libera tra spigoli interni del muro sinistro
  await p.click('[data-dim]');
  let a1 = await S(0.31,0.31), a2 = await S(0.31,3.83);
  await p.mouse.click(a1.x,a1.y); await p.waitForTimeout(80); await p.mouse.click(a2.x,a2.y); await p.waitForTimeout(150);
  await p.keyboard.type('3,62'); await p.keyboard.press('Enter'); await p.waitForTimeout(150);
  st = await p.evaluate(()=>({dims:piano().dims, nodes:piano().nodes.map(n=>[n.x,n.y]), mord:piano().mord, gd:G.dims.map(q=>[q.len,q.meas,q.known,q.tied]), warns:G.warns.map(w=>w.t)}));
  console.log(JSON.stringify(st));
  // un totale interno in conflitto sulla parete in basso (5,00 contro 1,25+1,05+1,10+1,20+0,73=5,33)
  await p.click('[data-dim]');
  a1 = await S(0.31,0.31); a2 = await S(4.89,0.31);
  await p.mouse.click(a1.x,a1.y); await p.waitForTimeout(80); await p.mouse.click(a2.x,a2.y); await p.waitForTimeout(150);
  await p.keyboard.type('5,00'); await p.keyboard.press('Enter'); await p.waitForTimeout(150);
  st = await p.evaluate(()=>({gd:G.dims.map(q=>[q.len,q.meas,q.known,q.tied]), rej:[...REJ], warns:G.warns.map(w=>w.t)}));
  console.log(JSON.stringify(st));
  // trascino la seconda quota
  const dd = await p.evaluate(()=>{ const q=G.dims[1]; const r=document.querySelector('#svg').getBoundingClientRect(); const y=q.a[1]+q.d.o; return {x:r.left+SX(1.0), y:r.top+SY(y), o:q.d.o}; });
  await p.mouse.move(dd.x,dd.y); await p.mouse.down(); await p.mouse.move(dd.x,dd.y-40,{steps:5}); await p.mouse.up(); await p.waitForTimeout(100);
  console.log('o', dd.o, await p.evaluate(()=>piano().dims[1].o), 'sel', await p.evaluate(()=>ui.sel));
  await p.evaluate(()=>{ ui.sel=null; draw(); renderSide(); });
  await p.screenshot({path:require('path').join(OUT, 'parz2.png'), clip:{x:20,y:200,width:1000,height:640}});
  fs.writeFileSync(require('path').join(OUT, 'parz2.scr'), await p.evaluate(()=>genScript(piano())));
  console.log('errors',errs); await b.close();
})();
