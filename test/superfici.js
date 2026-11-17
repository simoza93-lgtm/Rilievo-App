// Superfici esterne: portico (tratteggiato) e marciapiede (continuo) con m², sfrido, chiusura lungo i muri e anello attorno alla casa.
const APP = require('url').pathToFileURL(require('path').resolve(__dirname, '..', 'index.html')).href;
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({viewport:{width:1400,height:950}});
  const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  await p.goto(APP); await p.evaluate(()=>localStorage.clear()); await p.reload();
  const r = await p.evaluate(()=>{ R = blank(); R.id='sf'; tab='pianta'; render(); const pl = piano();
    ui.view = {x:-3, y:-3, s:50}; G = geometry(pl);
    const st = (pts, tipo) => { ui.newType = tipo; const sp = []; for (let i = 0; i < pts.length - 1; i++) { const a = pts[i], c = pts[i+1]; for (let k = 0; k < 6; k++) sp.push([SX(a[0] + (c[0]-a[0])*k/6), SY(a[1] + (c[1]-a[1])*k/6)]); } sp.push([SX(pts[pts.length-1][0]), SY(pts[pts.length-1][1])]); finishStroke(sp); };
    st([[0,0],[0,5],[6,5],[6,0],[0,0]], 'P'); update(true);
    const ring = G.walls.filter(w => w.closed).reduce((a, w) => polyA(w.pts) > polyA(a.pts) ? w : a);
    const xs = ring.pts.map(q => q[0]), ys = ring.pts.map(q => q[1]), x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
    const tap = (x, y) => supTap([SX(x), SY(y)]);
    ui.mode = 'sup'; updTools(); const barOn = !!document.querySelector('#supBar');
    // 1) portico lungo il lato alto: dal primo al terzo angolo, 2 m fuori
    tap(x0, y1); tap(x0, y1 + 2); tap(x1, y1 + 2); tap(x1, y1); supFine();
    const nCand = (ui.sup.cand || []).length, dir = ui.sup.cand.findIndex(c => c.v.length === 0);
    ui.sup.tipo = 'P'; supSave(ui.sup.pts.concat(ui.sup.cand[dir].v));
    const k1 = pl.sup[0], att1 = +(2 * (x1 - x0)).toFixed(2), got1 = +supNet(k1).toFixed(2), lor1 = +supLor(k1).toFixed(2);
    // 2) marciapiede ad anello attorno alla casa, 1 m fuori: la casa si toglie
    ui.sup.tipo = 'M'; tap(x0 - 1, y0 - 1); tap(x0 - 1, y1 + 1); tap(x1 + 1, y1 + 1); tap(x1 + 1, y0 - 1); tap(x0 - 1, y0 - 1);
    const ringOn = !!ui.sup.ring; supSave(ui.sup.pts, ui.sup.ring.hole);
    const k2 = pl.sup[1], att2 = +(((x1 - x0 + 2) * (y1 - y0 + 2)) - (x1 - x0) * (y1 - y0)).toFixed(2), got2 = +supNet(k2).toFixed(2);
    // 3) pannello, misura di un lato, sfrido, svg
    ui.mode = 'select'; updTools(); ui.sel = {k:'sup', id:k1.id}; renderSide();
    const pannello = document.body.innerHTML.includes('Sfrido (%)') && document.body.innerHTML.includes('Lato 1 (m)');
    const inp = document.querySelector('[data-supl="1"]'); inp.value = '3,00'; inp.dispatchEvent(new Event('input', {bubbles:true}));
    const dopo = +supNet(k1).toFixed(2);
    const sf = document.querySelector('[data-sup="sf"]'); sf.value = '20'; sf.dispatchEvent(new Event('input', {bubbles:true}));
    const lor = +supLor(k1).toFixed(2); draw(); const svg = document.querySelector('#svg').innerHTML;
    const scr = [].concat(genScript(pl)).join('\n'), nLine = (scr.match(/_\.LINE/g) || []).length;
    const script = {lay:scr.includes('_Make PLAN_SUPERFICI'), por:scr.includes('PORTICO S = 6.00 mq'), mar:scr.includes('MARCIAPIEDE S = 27.20 mq'), sf:scr.includes('con sfrido 20% = 7.20 mq'), tratti:nLine > 20};
    return {script, barOn, nCand, ringOn, att1, got1, lor1, att2, got2, pannello, dopo, lor, tratt:svg.includes('stroke-dasharray="9 5"'), etich:svg.includes('Portico') && svg.includes('Marciapiede'), json:JSON.parse(JSON.stringify(pl)).sup.length}; });
  console.log(JSON.stringify(r)); console.log('errors', errs); await b.close();
})();
