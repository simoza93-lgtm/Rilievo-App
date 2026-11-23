const APP = require('url').pathToFileURL(require('path').resolve(__dirname, '..', 'index.html')).href;
const { chromium } = require('playwright');
// porta (e ingresso) strombata: la forma si sceglie nel pannello come per le finestre; i cunei entrano nel muro,
// l'anta sta nella parte stretta (il cardine non cade mai sulla faccia larga), cambiando forma tutto torna.
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({viewport:{width:1400,height:950}});
  const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  await p.goto(APP); await p.evaluate(()=>localStorage.clear()); await p.reload();
  const r = await p.evaluate(()=>{ R = blank(); R.id='ps'; R.P = '0,50'; tab='pianta'; render(); const pl = piano(); ui.view={x:-1,y:-1,s:80}; G = geometry(pl);
    const st = (pts, tipo) => { ui.newType = tipo; const sp = []; for (let i = 0; i < pts.length - 1; i++) { const a = pts[i], c = pts[i+1]; for (let k = 0; k < 6; k++) sp.push([SX(a[0] + (c[0]-a[0])*k/6), SY(a[1] + (c[1]-a[1])*k/6)]); } sp.push([SX(pts[pts.length-1][0]), SY(pts[pts.length-1][1])]); finishStroke(sp); };
    st([[0,0],[6,0],[6,5],[0,5],[0,0]], 'P');
    const ym = Math.min(...pl.nodes.map(n => n.y)), w = pl.walls.find(w => { const a = pl.nodes.find(n => n.id === w.a), c = pl.nodes.find(n => n.id === w.b); return a.y < ym + 0.1 && c.y < ym + 0.1; });
    w.ap = [{id:'p1', tipo:'porta', d:'2,00', l:'1,00', h:'', inv:false, inc:'scal', l2:'1,40', lw:1}]; update(true);
    const info = () => { const ap = w.ap[0], o = G.ops.find(o => o.ap === ap), r2 = v => +v.toFixed(3);
      return {inc:o.inc ? {p:o.inc.p, strom:o.inc.strom, w0:r2(o.inc.w0), w1:r2(o.inc.w1)} : null, cunei:(G.wedges || []).length, f:o.door ? r2(o.door.f) : null, errori:G.errs.map(e => e.t), avvisi:G.warns.map(e => e.t).filter(t => /incassata|parte larga/.test(t)), pannello:!!document.querySelector('input[data-w="ap.p1.l2"]')}; };
    ui.sel = {k:'a', id:w.id, ap:'p1'}; ui.focusAp = 'p1'; renderSide();
    window.__t = {w, info}; const voce = !!AP_KIND['porta:strom'] && AP_KIND['porta:strom'].cat === 'porte' && !!document.querySelector('[data-ap="porta:strom"]') || !!AP_ICO['porta:strom']; return {voce, sel:!!document.querySelector('select[data-w="ap.p1.inc"]'), n0:info()}; });
  const r2 = {};
  await p.selectOption('select[data-w="ap.p1.inc"]', 'strom'); await p.waitForTimeout(100);
  Object.assign(r2, await p.evaluate(()=>{ const {w, info} = window.__t, strom = info(); renderSide(); const pannello = !!document.querySelector('input[data-w="ap.p1.l2"]');
    w.ap[0].vx = true; update(true); const vx = info(); return {strom, pannello, vx}; }));
  await p.selectOption('select[data-w="ap.p1.inc"]', 'scal'); await p.waitForTimeout(100);
  Object.assign(r2, await p.evaluate(()=>{ const {w, info} = window.__t, scal = info(); return {scal}; }));
  await p.selectOption('select[data-w="ap.p1.inc"]', ''); await p.waitForTimeout(100);
  Object.assign(r2, await p.evaluate(()=>{ const {w, info} = window.__t, dopo = info();
    w.ap = [{id:'p2', tipo:'ingresso', d:'2,00', l:'1,00', h:'2,10', inv:false, inc:'strom', l2:'1,40', lw:1}]; update(true);
    const o = G.ops.find(o => o.ap.id === 'p2'); return {dopo, ing:{inc:!!o.inc, cunei:(G.wedges || []).length, errori:G.errs.length}}; }));
  Object.assign(r, r2);
  console.log(JSON.stringify(r)); console.log('errors', errs); await b.close();
})();
