const APP = require('url').pathToFileURL(require('path').resolve(__dirname, '..', 'index.html')).href;
const OUT = require('path').join(__dirname, 'out'); require('fs').mkdirSync(OUT, {recursive: true});
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({viewport:{width:1400,height:950}});
  const errs=[]; p.on('pageerror',e=>errs.push(e.message)); p.on('dialog',d=>d.accept());
  await p.goto(APP); await p.evaluate(()=>localStorage.clear()); await p.reload();
  const out = await p.evaluate(()=>{
    R = blank(); R.id='t'; tab='pianta'; render(); const pl = piano();
    const pts=[[0,0],[10,0],[10,7],[0,7],[0,0]];
    for(let i=0;i<pts.length-1;i++) addSegment(pl,{x:pts[i][0],y:pts[i][1]},{x:pts[i+1][0],y:pts[i+1][1]},'P');
    addSegment(pl,{x:4,y:0},{x:4,y:7},'T');
    update(true);
    const a = newStair('dritta', 1.2, 3); snapStair(a);
    const u = newStair('U', 6, 2.5); u.n = '18'; u.n1 = '9'; snapStair(u);
    const l = newStair('L', 8.4, 5.2); l.n='14'; l.n1='4'; l.rot = 0;
    const c = newStair('chiocciola', 2.5, 5.6); c.n = '14';
    pl.stairs = [a,u,l,c]; update(true); fit(); draw();
    return {bb:pl.stairs.map(s=>stairPrims(s).bbox.map(v=>+v.toFixed(2))), kc:pl.stairs.map(s=>stairPrims(s).kc), chk:stCheck(a)};
  });
  console.log(JSON.stringify(out));
  await p.screenshot({path:require('path').join(OUT, 'scale1.png')});
  // pannello e copia al piano superiore
  const o2 = await p.evaluate(()=>{
    ui.mode='select'; ui.sel={k:'s', id:piano().stairs[1].id}; draw(); renderSide();
    const has = !!document.querySelector('[data-st="n1"]');
    R.piani.push({id:uid(), nome:'Piano primo', ver:0, nodes:[], walls:[], rooms:[]});
    document.getElementById('bLinkS').click();
    const up = R.piani[1].stairs;
    // modifico l'alzata: si aggiorna anche al piano sopra
    const inpA = document.querySelector('[data-st="a"]'); inpA.value='0,17'; inpA.dispatchEvent(new Event('input',{bubbles:true}));
    return {has, up: up && up.map(s=>[s.dir, s.a, s.tipo]), info: document.querySelector('#sInfo').textContent.replace(/\s+/g,' ')};
  });
  console.log(JSON.stringify(o2));
  await p.screenshot({path:require('path').join(OUT, 'scale2.png')});
  const o3 = await p.evaluate(()=>{ const scr = genScript(piano()); return {n:scr.length, sc:scr.split('\r\n').filter(l=>/scale|DONUT|SALE|SCENDE|CLAYER/.test(l))}; });
  console.log(JSON.stringify(o3));
  // piano superiore: foro tolto dalla superficie
  const o4 = await p.evaluate(()=>{ R.cur=1; const pl=piano(); const pts=[[0,0],[10,0],[10,7],[0,7],[0,0]];
    for(let i=0;i<pts.length-1;i++) addSegment(pl,{x:pts[i][0],y:pts[i][1]},{x:pts[i+1][0],y:pts[i+1][1]},'P'); render(); update(true);
    return {comps:G.comps.map(c=>[+c.area.toFixed(2), +(c.foro||0).toFixed(2)]), calc: renderCalc().includes('Scale')}; });
  console.log(JSON.stringify(o4));
  await p.evaluate(()=>{ fit(); draw(); }); await p.screenshot({path:require('path').join(OUT, 'scale3.png')});
  console.log('errors', errs); await b.close();
})();
