// Linea e Costruzione: stessi allineamenti dei muri (breve fermo e guida quando si è al livello di uno spigolo o di un estremo)
const APP = require('url').pathToFileURL(require('path').resolve(__dirname, '..', 'index.html')).href;
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({viewport:{width:1400, height:950}});
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto(process.argv[2] || APP); await p.evaluate(() => localStorage.clear()); await p.reload();
  await p.evaluate(() => { R = blank(); R.id = 'al'; tab = 'pianta'; render(); const pl = piano(); ui.view = {x:-2, y:-5.5, s:45}; G = geometry(pl);
    const st = pts => { ui.newType = 'P'; const sp = []; for (let i = 0; i < pts.length - 1; i++) { const a = pts[i], c = pts[i + 1]; for (let k = 0; k < 6; k++) sp.push([SX(a[0] + (c[0] - a[0]) * k / 6), SY(a[1] + (c[1] - a[1]) * k / 6)]); } sp.push([SX(pts[pts.length - 1][0]), SY(pts[pts.length - 1][1])]); finishStroke(sp); };
    st([[0, 0], [6, 0], [6, 4], [0, 4], [0, 0]]); update(true); });
  await p.click('[data-fly="disegno"]'); await p.click('[data-mode="costr"]');
  const base = () => p.evaluate(() => { piano().ink = [{id:'r', pts:[[8, 1], [8, 3]], lin:true}]; R.lay = {}; draw(); });
  const box = await p.evaluate(() => { const r = $('#svg').getBoundingClientRect(); return [r.left, r.top]; });
  // punto del mondo in pixel dello schermo, spostato di (dx, dy) pixel; con la vista girata di 90°
  const scr = (x, y, dx = 0, dy = 0) => p.evaluate(([x, y, dx, dy, box]) => { const q = [SX(x) + dx, SY(y) + dy], v = R.vrot === 1 ? [ui.Wr - q[1], q[0]] : q; return [box[0] + v[0], box[1] + v[1]]; }, [x, y, dx, dy, box]);
  const giu = async a => { await p.evaluate(() => { const t = document.querySelector('#toast'); if (t) t.style.pointerEvents = 'none'; }); await p.mouse.move(...a); await p.mouse.down(); };
  const vai = async c => { await p.mouse.move(...c, {steps:6}); };
  const guida = () => p.evaluate(() => $('#trk').innerHTML.includes('stroke-dasharray'));
  const su = async () => { await p.mouse.up(); await p.waitForTimeout(60); return p.evaluate(() => { const k = piano().ink[piano().ink.length - 1]; return k.pts.map(q => q.map(v => +v.toFixed(3))); }); };
  const out = {};
  // verticale che arriva 8 px sopra il livello dell'estremo (8; 3)
  await base(); await giu(await scr(10, -1)); await vai(await scr(10, 3, 2, -8)); out.guidaDurante = await guida(); out.livelloEstremo = await su(); out.guidaDopo = await guida();
  // orizzontale che si ferma al livello dello spigolo esterno del muro (x 6,15)
  await base(); await giu(await scr(2, -2)); await vai(await scr(6.15, -2, 8, 2)); out.livelloSpigolo = await su();
  // anche la partenza si mette in livello
  await base(); await giu(await scr(10, 1, 0, 7)); await vai(await scr(13, 1)); out.partenza = await su();
  // si sgancia se si prosegue
  await base(); await giu(await scr(10, -1)); await vai(await scr(10, 3, 0, -8)); await p.waitForTimeout(300); await vai(await scr(10, 3, 0, -30)); out.sganciata = await su();
  // l'estremo vicino vince sull'allineamento
  await base(); await giu(await scr(10, 3)); await vai(await scr(8, 3, 9, 6)); out.estremo = await su();
  // obliqua: nessun allineamento
  await base(); await giu(await scr(10, -1)); await vai(await scr(12, 3, 0, -8)); out.obliqua = await su();
  // layer delle linee spento: la linea nascosta non tira
  await base(); await p.evaluate(() => { R.lay = {D:{off:true}}; draw(); }); await giu(await scr(10, -1)); await vai(await scr(10, 3, 0, -8)); out.spenta = await su();
  // vista girata
  await base(); await p.evaluate(() => { R.vrot = 1; draw(); }); await giu(await scr(10, -1)); await vai(await scr(10, 3, 2, -8)); out.girata = await su(); await p.evaluate(() => { R.vrot = 0; draw(); });
  for (const [k, v] of Object.entries(out)) console.log(k, JSON.stringify(v));
  console.log('errors', errs); await b.close();
})();
