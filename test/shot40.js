const APP = require('url').pathToFileURL(require('path').resolve(__dirname, '..', 'index.html')).href;
const OUT = require('path').join(__dirname, 'out'); require('fs').mkdirSync(OUT, {recursive: true});
const { chromium } = require('playwright'); const fs = require('fs');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({viewport:{width:1400,height:950}});
  const errs=[]; p.on('pageerror',e=>errs.push(e.message)); p.on('dialog',d=>d.accept());
  await p.goto(APP); await p.evaluate(()=>localStorage.clear()); await p.reload();
  const r = await p.evaluate(()=>{
    R = blank(); R.id='t'; tab='pianta'; render(); const pl = piano();
    const pts=[[0,0],[9,0],[9,6],[0,6],[0,0]]; for(let i=0;i<pts.length-1;i++) addSegment(pl,{x:pts[i][0],y:pts[i][1]},{x:pts[i+1][0],y:pts[i+1][1]},'P');
    addSegment(pl,{x:6.6,y:6},{x:6.6,y:1.4},'T'); addSegment(pl,{x:6.6,y:1.4},{x:9,y:1.4},'T'); update(true);
    const st = newStair('U', 7.8, 3.5); st.n='20'; st.n1='10'; st.a='0,175'; snapStair(st); anchorStair(pl, st); pl.stairs=[st]; update(true);
    ['Piano primo','Piano secondo','Piano terzo'].forEach(n=>R.piani.push({id:uid(), nome:n, ver:0, nodes:[], walls:[], rooms:[]}));
    ui.mode='select'; ui.sel={k:'s', id:st.id}; renderSide(); document.getElementById('bLinkAll').click();
    const t1 = document.getElementById('toast').textContent;
    const stato = R.piani.map(pp=>(pp.stairs||[]).map(s=>[s.dir,s.n,s.a,s.nA||'',s.aA||'']).flat());
    // al piano primo: 18 alzate per il tratto che parte
    R.cur=1; ui.sel=null; render(); update(true);
    const s1 = piano().stairs[0]; ui.sel={k:'s', id:s1.id}; renderSide();
    const inN = document.querySelector('[data-st="n"]'); inN.value='18'; inN.dispatchEvent(new Event('input',{bubbles:true}));
    const dopo = R.piani.map(pp=>(pp.stairs||[]).map(s=>[s.dir,s.n,s.nA||'']).flat());
    const P = stairPrims(s1);
    return {t1, stato, dopo, arrs:P.arrs.map(a=>[a.text.t, a.pts.length, !!a.dot]), dash:P.segs.filter(x=>x.dash).length, segs:P.segs.length, foro:G.comps.map(c=>+(c.foro||0).toFixed(2)), info:document.querySelector('#sInfo').textContent.replace(/\s+/g,' ')};
  });
  console.log(JSON.stringify(r,null,1));
  await p.evaluate(()=>{ ui.sel=null; fit(); draw(); renderSide(); }); await p.screenshot({path:require('path').join(OUT, 'inter.png'), clip:{x:30,y:280,width:930,height:620}});
  fs.writeFileSync(require('path').join(OUT, 'inter.scr'), await p.evaluate(()=>genScript(piano())));
  console.log('errors',errs); await b.close();
})();
