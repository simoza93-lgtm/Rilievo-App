const APP = require('url').pathToFileURL(require('path').resolve(__dirname, '..', 'index.html')).href;
const OUT = require('path').join(__dirname, 'out'); require('fs').mkdirSync(OUT, {recursive: true});
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({viewport:{width:1400,height:950}});
  const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  await p.goto(APP); await p.evaluate(()=>localStorage.clear()); await p.reload();
  const r = await p.evaluate(()=>{ R = blank(); R.id='b1'; tab='pianta'; render(); const pl = piano();
    ui.view = {x:-2, y:-3, s:60}; G = geometry(pl);
    const st = (pts, tipo) => { ui.newType = tipo; const sp = []; for (let i = 0; i < pts.length - 1; i++) { const a = pts[i], c = pts[i+1]; for (let k = 0; k < 6; k++) sp.push([SX(a[0] + (c[0]-a[0])*k/6), SY(a[1] + (c[1]-a[1])*k/6)]); } sp.push([SX(pts[pts.length-1][0]), SY(pts[pts.length-1][1])]); finishStroke(sp); };
    // casa a L: rientranza in basso a sinistra (6 x 5) dove va il balcone
    st([[0,5],[0,9],[10,9],[10,0],[6,0],[6,5],[0,5]], 'P');
    const N = () => pl.nodes.map(n => [n.x, n.y]);
    const c0 = pl.nodes.find(n => n.x < 1 && n.y < 6), c6 = pl.nodes.find(n => Math.abs(n.x - 6.15) < 0.5 && n.y < 1);
    // parapetto in un tratto: dal nodo d'angolo della casa in giù, poi a destra fino al muro della casa
    st([[c0.x, c0.y], [c0.x, c0.y - 5], [c6.x, c0.y - 5]], 'T');
    const T = topo(pl), par = pl.walls.filter(w => w.tipo === 'T').map(w => ({filo:w.filo, H:isH(nd(pl,w.a),nd(pl,w.b))}));
    // facce esterne: il parapetto sinistro deve stare sul filo esterno del perimetrale sinistro
    const faces = pl.walls.map(w => { const I = T.info.get(w.id); return [w.tipo, I.H ? 'H' : 'V', +(I.H ? I.a.y + I.o - I.t/2 : I.a.x + I.o - I.t/2).toFixed(3), +(I.H ? I.a.y + I.o + I.t/2 : I.a.x + I.o + I.t/2).toFixed(3)]; });
    const tiny = G.comps.filter(c => c.area < 0.25).length;
    return {par, faces, tiny, comps:G.comps.map(c=>+c.area.toFixed(2)), toast:document.querySelector('#toast').textContent}; });
  console.log(JSON.stringify(r));
  // scaletta di 3 alzate che sale sul balcone dal basso
  const r2 = await p.evaluate(()=>{ const pl = piano(); const bot = pl.walls.find(w => w.tipo === 'T' && isH(nd(pl,w.a),nd(pl,w.b)));
    const I = G.T.info.get(bot.id), yf = I.a.y + I.o - I.t/2;
    const s = newStair('dritta', 3, 0); Object.assign(s, {n:'3', a:'0,17', p:'0,30', b:'1,00'}); const bb = stairPrims(s).bbox;
    s.x = r4(2.5); s.y = r4(yf - (bb[3]-bb[1]) - 0.05); snapStair(s); anchorStair(pl, s); (pl.stairs = []).push(s); update(true);
    const v = pl.walls.flatMap(w => (w.ap||[]).map(a => ({w:w.tipo, ...a})));
    const out = {v, ops:G.ops.map(o=>[o.ap.tipo, +o.s0.toFixed(2), +o.s1.toFixed(2)]), warns:G.warns.map(w=>w.t)};
    // misuro la larghezza del varco e la sua posizione: la scala si allinea
    const ap = v[0] && pl.walls.flatMap(w=>w.ap||[]).find(a=>a.sc);
    if (ap) { const run = G.runs.find(r => r.chain && r.chain.ops.some(o=>o.ap===ap)); ap.l = '1,10'; delete ap.lp; ap.pos = {k:run.key, v:'2,00', prev:''}; delete ap.dp; update(true);
      out.after = {ap:{d:ap.d,l:ap.l}, stair:[s.x, s.y], cx:(stairPrims(s).bbox[0]+stairPrims(s).bbox[2])/2, vc: (() => { const o = G.ops.find(o=>o.ap===ap); return o ? (axC(o.I.a,o.I.H)+(o.s0+o.s1)/2) : null; })()}; }
    // scala tolta: il varco misurato resta come varco normale
    pl.stairs = []; update(true); out.dopoTolta = pl.walls.flatMap(w=>(w.ap||[]).map(a=>[a.tipo, !!a.sc]));
    return out; });
  console.log(JSON.stringify(r2));
  const scr = await p.evaluate(()=>genScript(piano())); require('fs').writeFileSync(require('path').join(OUT, 'balc.scr'), scr);
  await p.evaluate(()=>{ fit(); draw(); });
  await p.screenshot({path:require('path').join(OUT, 'balc.png'), clip:{x:20,y:200,width:1000,height:700}});
  console.log('errors', errs); await b.close();
})();
