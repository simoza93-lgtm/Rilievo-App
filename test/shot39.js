const APP = require('url').pathToFileURL(require('path').resolve(__dirname, '..', 'index.html')).href;
const OUT = require('path').join(__dirname, 'out'); require('fs').mkdirSync(OUT, {recursive: true});
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({viewport:{width:1400,height:950}});
  const errs=[]; p.on('pageerror',e=>errs.push(e.message)); p.on('dialog',d=>d.accept());
  await p.goto(APP); await p.evaluate(()=>localStorage.clear()); await p.reload();
  const r = await p.evaluate(()=>{
    R = blank(); R.id='t'; tab='pianta'; render(); const pl = piano();
    const pts=[[0,0],[9,0],[9,6],[0,6],[0,0]]; for(let i=0;i<pts.length-1;i++) addSegment(pl,{x:pts[i][0],y:pts[i][1]},{x:pts[i+1][0],y:pts[i+1][1]},'P');
    // vano scala chiuso in alto a destra
    addSegment(pl,{x:6.6,y:6},{x:6.6,y:1.4},'T'); addSegment(pl,{x:6.6,y:1.4},{x:9,y:1.4},'T'); update(true);
    const st = newStair('U', 7.8, 3.5); st.n='18'; st.n1='9'; snapStair(st); anchorStair(pl, st); pl.stairs=[st]; update(true);
    const vano = vanoWalls(pl, st).length;
    R.piani.push({id:uid(), nome:'Piano primo', ver:0, nodes:[], walls:[], rooms:[]});
    ui.mode='select'; ui.sel={k:'s', id:st.id}; renderSide(); document.getElementById('bLinkS').click();
    const toastT = document.getElementById('toast').textContent;
    R.cur = 1; ui.sel=null; render(); update(true);
    const up = piano(); const s2 = up.stairs[0];
    return {vano, toastT, muriSu:up.walls.map(w=>w.tipo), comps:G.comps.map(c=>[+c.area.toFixed(2), +(c.foro||0).toFixed(2)]), anc:!!s2.anc, bb:stairPrims(s2).bbox.map(v=>+v.toFixed(2))};
  });
  console.log(JSON.stringify(r)); await p.evaluate(()=>{fit();draw();}); await p.screenshot({path:require('path').join(OUT, 'vano.png')}); console.log('errors',errs); await b.close();
})();
