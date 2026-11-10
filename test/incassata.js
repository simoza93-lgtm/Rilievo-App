const APP = require('url').pathToFileURL(require('path').resolve(__dirname, '..', 'index.html')).href;
const OUT = require('path').join(__dirname, 'out'); require('fs').mkdirSync(OUT, {recursive: true});
const { chromium } = require('playwright');
// finestra incassata (palazzi antichi): luce stretta verso l'esterno, parte larga verso la stanza; a scalino e strombata;
// parziali interne fino al bordo largo, risega, parte larga girata, script.
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({viewport:{width:1400,height:950}});
  const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  await p.goto(process.argv[2] || APP); await p.evaluate(()=>localStorage.clear()); await p.reload();
  const out = {};
  await p.evaluate(()=>{ R = blank(); R.id='inc'; R.P = '0,50'; tab='pianta'; render(); const pl = piano(); ui.view={x:-1,y:-1,s:80}; G = geometry(pl);
    const st = (pts, tipo) => { ui.newType = tipo; const sp = []; for (let i = 0; i < pts.length - 1; i++) { const a = pts[i], c = pts[i+1]; for (let k = 0; k < 6; k++) sp.push([SX(a[0] + (c[0]-a[0])*k/6), SY(a[1] + (c[1]-a[1])*k/6)]); } sp.push([SX(pts[pts.length-1][0]), SY(pts[pts.length-1][1])]); finishStroke(sp); };
    st([[0,0],[6,0],[6,5],[0,5],[0,0]], 'P');
    const bot = pl.walls.filter(w => isH(nd(pl,w.a),nd(pl,w.b))).sort((a,c)=>nd(pl,a.a).y-nd(pl,c.a).y)[0];
    bot.ap = [{id:'f1', tipo:'finestra', d:'2,00', l:'1,00', h:'1,40', dav:'0,90', inv:false}]; update(true);
    ui.sel = {k:'a', id:bot.id, ap:'f1'}; ui.focusAp = 'f1'; draw(); renderSide(); });
  // dal pannello: forma a scalino
  await p.selectOption('select[data-w="ap.f1.inc"]', 'scal'); await p.waitForTimeout(100);
  const info = () => p.evaluate(()=>{ const pl = piano(), w = pl.walls.find(w => (w.ap||[]).some(a=>a.id==='f1')), ap = w.ap[0], o = G.ops.find(o=>o.ap===ap), r4b = v => +v.toFixed(3);
    const r = G.runs.find(r => !r.ext && r.walls.includes(w));
    return {lw:ap.lw, l2:ap.l2, l2p:!!ap.l2p, inc:o.inc ? {w0:r4b(o.inc.w0), w1:r4b(o.inc.w1), p:o.inc.p, strom:o.inc.strom} : null, luce:[r4b(o.s0), r4b(o.s1)],
      parziali:r.chain.pcs.map(pc=>[r4b(pc.a), r4b(pc.b), pc.meas >= 0 ? pc.meas : null, pc.known]),
      righe:G.lines.filter(l=>l.l==='R').length, cunei:(G.wedges||[]).length, ambienti:G.comps.filter(c=>c.room).length,
      area:+(G.comps.find(c=>c.room)||{area:0}).area.toFixed(3), errori:G.errs.map(e=>e.t), avvisi:G.warns.map(e=>e.t).filter(t=>/incassata|parte larga/.test(t)),
      tasto:flipBtns().map(b=>b.k), pannello:!!document.querySelector('input[data-w="ap.f1.l2"]') }; });
  out.scalino = await info();
  await p.click('text=Adatta'); await p.waitForTimeout(150);
  await p.evaluate(()=>{ ui.view={x:1.2,y:-0.9,s:220}; draw(); }); await p.screenshot({path:require('path').join(OUT, 'incassata_scalino.png')});
  // misure: parte larga 1,50, risega 0,20, parziale interna dallo spigolo al bordo largo 1,80
  out.misure = await p.evaluate(()=>{ const pl = piano(), w = pl.walls.find(w => (w.ap||[]).some(a=>a.id==='f1')), ap = w.ap[0], r = G.runs.find(r => !r.ext && r.walls.includes(w));
    const it = measItems().filter(x=>x.ap===ap).map(x=>x.hb.kind + ':' + x.st);
    ap.l2 = '1,50'; delete ap.l2p; ap.ris = '0,20'; delete ap.lp; ap.pos = {k:r.key, v:'1,80', prev:''}; delete ap.dp; update(true);
    const o = G.ops.find(o=>o.ap===ap), x0 = axC(r.P, r.H) + r.eA, r4b = v => +v.toFixed(3);
    return {voci:it, d:ap.d, largaDaSpigolo:r4b(axC(o.I.a, true) + o.inc.w0 - x0), luceDaSpigolo:r4b(axC(o.I.a, true) + o.s0 - x0), parziali:r.chain.pcs.map(pc=>[r4b(pc.len), pc.meas >= 0 ? pc.meas : null, pc.known])}; });
  // strombata
  await p.evaluate(()=>{ ui.sel = {k:'a', id:piano().walls.find(w => (w.ap||[]).some(a=>a.id==='f1')).id, ap:'f1'}; renderSide(); });
  await p.selectOption('select[data-w="ap.f1.inc"]', 'strom'); await p.waitForTimeout(100);
  out.strombata = await info();
  out.contorno = await p.evaluate(()=>{ const r4b = v => +v.toFixed(2); return G.walls.filter(w=>w.l==='P').map(w=>w.pts.map(q=>r4b(q[0])+' '+r4b(q[1])).join(' | ')); });
  await p.evaluate(()=>{ ui.view={x:1.2,y:-0.9,s:220}; draw(); }); await p.screenshot({path:require('path').join(OUT, 'incassata_strombata.png')});
  // script
  out.script = await p.evaluate(()=>genScript(piano()).split('\n').filter(l=>/1\.00 \/ 1\.50|infissi/.test(l)));
  // parte larga dall'altro lato (verso l'esterno) col tasto del pannello
  await p.click('[data-flipap="f1:lw"]'); await p.waitForTimeout(100);
  out.girata = await info();
  await p.evaluate(()=>{ ui.view={x:1.2,y:-0.9,s:220}; draw(); }); await p.screenshot({path:require('path').join(OUT, 'incassata_girata.png')});
  // impostazioni: profondità della luce stretta
  out.impostazioni = await p.evaluate(()=>{ R.incP = '0,25'; update(true); const o = G.ops.find(o=>o.ap.id==='f1'); return o.inc.p; });
  console.log(JSON.stringify(out)); console.log('errors', errs); await b.close();
})();
