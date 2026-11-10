const APP = require('url').pathToFileURL(require('path').resolve(__dirname, '..', 'index.html')).href;
const OUT = require('path').join(__dirname, 'out'); require('fs').mkdirSync(OUT, {recursive: true});
const { chromium } = require('playwright');
// tre tastini sul muro selezionato: a filo da un lato, in asse, a filo dall'altro (per tutto il muro dritto);
// compaiono solo se in linea c'è un muro più spesso
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({viewport:{width:1400,height:950}, colorScheme:'dark'});
  const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  await p.goto(process.argv[2] || APP); await p.evaluate(()=>localStorage.clear()); await p.reload();
  await p.evaluate(()=>{ R = blank(); R.id='tas'; tab='pianta'; render(); const pl = piano(); ui.view={x:-6,y:-9,s:60}; G = geometry(pl);
    const off = () => { const ns = pl.walls.filter(w=>w.tipo==='P').flatMap(w=>[nd(pl,w.a),nd(pl,w.b)]); if (!ns.length) return [0,0]; return [Math.min(...ns.map(n=>n.x))+4, Math.max(...ns.map(n=>n.y))-6]; };
    const st = (pts0, tipo) => { const O = off(); const pts = pts0.map(q=>[q[0]+O[0], q[1]+O[1]]); ui.newType = tipo; const sp = []; for (let i = 0; i < pts.length - 1; i++) { const a = pts[i], cc = pts[i+1]; for (let k = 0; k < 6; k++) sp.push([SX(a[0] + (cc[0]-a[0])*k/6), SY(a[1] + (cc[1]-a[1])*k/6)]); } sp.push([SX(pts[pts.length-1][0]), SY(pts[pts.length-1][1])]); finishStroke(sp); };
    st([[-4,6],[-4,0],[0,0],[0,-6],[5.6,-6],[5.6,-5],[6.6,-5],[6.6,-3],[9,-3],[9,6],[-4,6]], 'P');
    st([[-4,3],[9,3]],'T'); st([[0,6],[0,0]],'T'); st([[4.1,3],[4.1,-6]],'T'); update(true);
    window.__x0 = off()[0]; window.__vt = () => { const pl = piano(); return pl.walls.filter(w=>w.tipo==='T' && !isH(nd(pl,w.a),nd(pl,w.b)) && Math.abs(nd(pl,w.a).x-window.__x0)<0.3).sort((a,c)=>nd(pl,a.a).y-nd(pl,c.a).y); };
    $('[data-tool="sel"]') && $('[data-tool="sel"]').click(); });
  await p.click('text=Adatta'); await p.waitForTimeout(150);
  const out = {};
  const selWall = async (i) => p.evaluate((i)=>{ const w = window.__vt()[i]; ui.sel = {k:'w', id:w.id}; draw(); renderSide(); return filoBtns().map(b=>({v:b.v, on:b.on})); }, i);
  const offs = () => p.evaluate(()=>window.__vt().map(w=>+(G.T.info.get(w.id).o||0).toFixed(2)));
  const tap = async v => { const q = await p.evaluate((v)=>{ const bt = filoBtns().find(b=>b.v===v); const r = $('#svg').getBoundingClientRect(); return [r.left + bt.p[0], r.top + bt.p[1]]; }, v);
    await p.mouse.click(q[0], q[1]); await p.waitForTimeout(120); };
  out.prima = await offs();
  out.tastiSotto = await selWall(0);
  await p.screenshot({path:require('path').join(OUT, 'tasti1.png')});
  await tap(''); out.asse = await offs(); out.selDopo = await p.evaluate(()=>ui.sel && ui.sel.k);
  await selWall(1); await tap('-'); out.sinistra = await offs();
  await selWall(0); await tap('+'); out.destra = await offs();
  out.tastiAccesi = await p.evaluate(()=>filoBtns().filter(b=>b.on).map(b=>b.v));
  await p.screenshot({path:require('path').join(OUT, 'tasti2.png')});
  // un tramezzo senza muro più spesso in linea: niente tastini
  out.senza = await p.evaluate(()=>{ const pl = piano(); const w = pl.walls.find(w=>w.tipo==='T' && isH(nd(pl,w.a),nd(pl,w.b))); ui.sel = {k:'w', id:w.id}; draw(); return filoBtns().length; });
  // vista girata di 90°: i tastini funzionano lo stesso
  await p.evaluate(()=>{ R.vrot = 1; ui.sel = {k:'w', id:window.__vt()[0].id}; render(); draw(); });
  await p.waitForTimeout(100);
  const q = await p.evaluate(()=>{ const bt = filoBtns().find(b=>b.v==='-'); const r = $('#svg').getBoundingClientRect(); const m = $('#vg').getScreenCTM(); const pt = $('#svg').createSVGPoint(); pt.x = bt.p[0]; pt.y = bt.p[1]; const s = pt.matrixTransform(m); return [s.x, s.y]; });
  await p.mouse.click(q[0], q[1]); await p.waitForTimeout(120); out.ruotata = await offs();
  console.log(JSON.stringify(out)); console.log('errors', errs); await b.close();
})();
