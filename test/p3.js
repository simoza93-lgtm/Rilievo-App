const APP = require('url').pathToFileURL(require('path').resolve(__dirname, '..', 'index.html')).href;
const OUT = require('path').join(__dirname, 'out'); require('fs').mkdirSync(OUT, {recursive: true});
const { chromium } = require('playwright'); const fs=require('fs');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({viewport:{width:1400,height:950}});
  const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  await p.goto(APP); await p.evaluate(()=>localStorage.clear()); await p.reload();
  const r = await p.evaluate(()=>{ R = blank(); R.id='t6'; tab='pianta'; render(); const pl = piano();
    const pts=[[0,0],[6,0],[6,4],[0,4],[0,0]]; for(let i=0;i<pts.length-1;i++) addSegment(pl,{x:pts[i][0],y:pts[i][1]},{x:pts[i+1][0],y:pts[i+1][1]},'P');
    update(true);
    // finestra proposta sul muro in basso (come posata con il tasto rapido)
    const wb = pl.walls.find(w=>{const a=nd(pl,w.a),b=nd(pl,w.b); return isH(a,b) && Math.abs(a.y-b.y)<1e-6 && a.y < 1;});
    wb.ap = [{id:'f1', tipo:'finestra', d:'2,00', l:'1,20', h:'1,40', dav:'0,90', inv:false, dp:true, lp:true}];
    update(true);
    const out = {};
    const run = G.runs.find(r=>r.chain); out.prop = run.chain.pcs.map(pc=>[f2(pc.len), pc.known]);
    out.scr1 = (genScript(pl).match(/; (Vani|Quote parziali)[^\r]*/g)||[]);
    // parziale dall'altro lato? (lato esterno: niente catena)
    out.extChain = G.runs.filter(r=>r.ext && r.chain).length;
    // misuro: primo tratto 2,10, larghezza 1,25, ultimo 2,05 -> totale 5,40
    const key = run.key; let ap = wb.ap[0];
    ap.pos = {k:key, v:'2,10', prev:''}; delete ap.dp; ap.l='1,25'; delete ap.lp; setMeasure(pl,'l',key,'2,05'); update(true);
    out.nodesX = pl.nodes.map(n=>n.x).sort((a,b)=>a-b);
    // quota libera tra i due spigoli interni del muro in basso, 5,60: in conflitto con la catena inserita prima -> rifiutata
    const bl = G.walls.flatMap(w=>w.pts);
    const rn = G.runs.find(r=>r.chain), fa = rn.chain.fa, fb = rn.chain.fb, yf = rn.P.y + rn.sg*rn.t/2;
    pl.dims = [{id:'q1', a:dimEndFor(pl,{x:fa,y:yf,snap:true}), b:dimEndFor(pl,{x:fb,y:yf,snap:true}), H:true, o:1, v:''}];
    setMeasure(pl,'q','q1','5,60'); update(true);
    out.rej = [...REJ]; out.q = G.dims.map(q=>[f2(q.len), q.meas, q.tied, q.known]); out.warn = G.warns.map(w=>w.t);
    // tolgo l'ultima parziale: ora comanda la quota libera
    setMeasure(pl,'l',key,''); update(true);
    out.after = {rej:[...REJ], q:G.dims.map(q=>f2(q.len)), last:G.runs.find(r=>r.chain).chain.pcs.map(pc=>[f2(pc.len), pc.meas, pc.known])};
    // tramezzo che divide il lato: la posizione del vano va riferita al muro
    addSegment(pl,{x:1.0,y:0.15},{x:1.0,y:4.15},'T'); update(true);
    out.split = {pos:pl.walls.flatMap(w=>w.ap||[]).map(a=>[a.d, !!a.pos]), toast:document.querySelector('#toast').textContent};
    return out; });
  console.log(JSON.stringify(r,null,1));
  // pannello quota libera
  await p.evaluate(()=>{ ui.sel={k:'q', id:'q1'}; ui.mode='select'; fit(); draw(); renderSide(); });
  console.log(await p.evaluate(()=>document.querySelector('#side').innerText.slice(0,300)));
  await p.screenshot({path:require('path').join(OUT, 'parz3.png'), clip:{x:20,y:200,width:1380,height:640}});
  await p.click('#bDelQ'); console.log('dims dopo elimina', await p.evaluate(()=>piano().dims.length+' '+piano().mord.join(',')));
  await p.click('#bUndo'); console.log('dopo annulla', await p.evaluate(()=>piano().dims.length));
  console.log('errors',errs); await b.close();
})();
