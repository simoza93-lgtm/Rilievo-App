const APP = require('url').pathToFileURL(require('path').resolve(__dirname, '..', 'index.html')).href;
const OUT = require('path').join(__dirname, 'out'); require('fs').mkdirSync(OUT, {recursive: true});
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch(); const errs=[]; const out={};
const p=await b.newPage({viewport:{width:1280,height:800}}); p.on('pageerror',e=>errs.push(e.message));
await p.goto(process.argv[2]||APP); await p.evaluate(()=>(localStorage.clear(), localStorage.setItem('rilievo-mstile','classico'))); await p.reload(); await p.waitForTimeout(300);
await p.click('#bFull'); await p.waitForTimeout(200);
// scala dritta contro il muro sinistro del soggiorno, un po' sopra il muro in basso
out.setup=await p.evaluate(()=>{ const pl=piano(); const T=topo(pl);
  const r=G.runs.find(r=>!r.ext&&!r.pieno&&!r.H&&!runOps(pl,T,r).ops.length&&(r.Q.y-r.P.y)>3); if(!r) return 'no run';
  const face=r.P.x+r.o+r.sg*r.t/2; const st=newStair('dritta',0,0); st.n='8'; pl.stairs=pl.stairs||[];
  let sb=stairPrims(st).bbox; const fa=r.P.y+r.eA;
  if (r.sg>0) st.x=r4(num(st.x)+face-sb[0]); else st.x=r4(num(st.x)+face-sb[2]); st.y=r4(num(st.y)+fa+0.4-sb[1]); pl.stairs.push(st); anchorStair(pl,st); update(true);
  sb=stairPrims(st).bbox; const rs=G.runs.filter(r=>r.chain&&r.chain.stair); return {run:r.key, sg:r.sg, sb:sb.map(x=>+x.toFixed(2)), runs:rs.map(r=>({key:r.key,H:r.H,pcs:r.chain.pcs.map(pc=>[+pc.len.toFixed(2),pc.side||'-',pc.meas])}))}; });
console.log(JSON.stringify(out.setup));
// casella del tratto "a"
const tapBox=async(side)=>{ const q=await p.evaluate(side=>{ const r=document.querySelector('#svg').getBoundingClientRect(); const e=ui.pbb.find(x=>x.hb.kind==='sp'&&x.hb.side===side); if(!e) return null; const b=e.box; return [r.left+b[0]+b[2]/2,r.top+b[1]+b[3]/2]; },side); if(!q) return false; await p.mouse.click(q[0],q[1]); await p.waitForTimeout(150); return true; };
out.tapA=await tapBox('a'); out.popup=await p.evaluate(()=>{const e=document.querySelector('#inl .ms'); return e&&e.textContent;});
await p.keyboard.type('1,2'); await p.keyboard.press('Enter'); await p.waitForTimeout(200);
out.dbg=await p.evaluate(()=>({anc:piano().stairs[0].anc, sb:stairPrims(piano().stairs[0]).bbox, chains:G.runs.filter(r=>r.chain&&r.chain.stair).length}));console.log(JSON.stringify(out));
out.after=await p.evaluate(()=>{ const st=piano().stairs[0], sb=stairPrims(st).bbox; const r=G.runs.find(r=>r.chain&&r.chain.stair); return {anc:st.anc, sb:sb.map(x=>+x.toFixed(3)), pcs:r.chain.pcs.map(pc=>[+pc.len.toFixed(3),pc.side,pc.meas,pc.known]), warns:G.warns.filter(w=>/scala/.test(w.t)).map(w=>w.t)}; });
await p.screenshot({path:require('path').join(OUT, 'scp1.png')});
// script
out.scr=await p.evaluate(()=>{ const s=genScript(piano()); return (s.match(/DIMLINEAR/g)||[]).length; });
// cambio un muro: la scala resta a 1,20 dal muro in basso? (simula: update)
await p.evaluate(()=>update(true)); out.stable=await p.evaluate(()=>{const st=piano().stairs[0]; return [st.x,st.y];});
// misura dalla parte b
out.tapB=await tapBox('b'); await p.keyboard.type('0,5'); await p.keyboard.press('Enter'); await p.waitForTimeout(200);
out.afterB=await p.evaluate(()=>{ const st=piano().stairs[0]; const r=G.runs.find(r=>r.chain&&r.chain.stair); return {m:st.anc[r.H?'x':'y'].m, pcs:r.chain.pcs.map(pc=>[+pc.len.toFixed(3),pc.side,pc.meas])}; });
await p.click('#bUndo'); out.undo=await p.evaluate(()=>{ const st=piano().stairs[0]; const r=G.runs.find(r=>r.chain&&r.chain.stair); return st.anc[r.H?'x':'y'].m; });
console.log(JSON.stringify(out)); console.log('errors',errs); await b.close();})();
