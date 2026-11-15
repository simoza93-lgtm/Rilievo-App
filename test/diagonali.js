const APP = require('url').pathToFileURL(require('path').resolve(__dirname, '..', 'index.html')).href;
const OUT = require('path').join(__dirname, 'out'); require('fs').mkdirSync(OUT, {recursive: true});
const { chromium } = require('playwright');
// obliqui tappa 2: diagonale (tasto e due tocchi sugli spigoli), controllo a 90°, fuori squadra (tasto nel pannello), trapezio con diagonale,
// rientro, Rendi obliquo / Rendi dritto, script
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({viewport:{width:1400,height:950}});
  const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  await p.goto(process.argv[2] || APP); await p.evaluate(()=>localStorage.clear()); await p.reload();
  const prep = `R = blank(); R.id='dg'; tab='pianta'; render(); var pl = piano(); ui.view={x:-1,y:-1,s:80}; G = geometry(pl);
    var st = (pts, tipo) => { ui.newType = tipo; const sp = []; for (let i = 0; i < pts.length - 1; i++) { const a = pts[i], c = pts[i+1]; for (let k = 0; k < 8; k++) sp.push([SX(a[0] + (c[0]-a[0])*k/8), SY(a[1] + (c[1]-a[1])*k/8)]); } sp.push([SX(pts[pts.length-1][0]), SY(pts[pts.length-1][1])]); finishStroke(sp); };
    var r3 = v => +v.toFixed(3); ui.mode = 'select'; updTools();`;
  const box = async () => p.evaluate(()=>{ const r = $('#svg').getBoundingClientRect(); return [r.left, r.top]; });
  const tapW = async (x, y) => { const bx = await box(), s = await p.evaluate(([x, y])=>[SX(x), SY(y)], [x, y]); await p.mouse.click(bx[0] + s[0], bx[1] + s[1]); await p.waitForTimeout(80); };
  const keys = async ks => { for (const k of ks) await p.click(`#inl [data-k="${k}"]`); await p.click('#inl [data-k="ok"]'); await p.waitForTimeout(120); };
  const out = {};
  // 1) rettangolo 4,40 × 3,40 misurato; diagonale col tasto, che non torna (5,80): avviso; poi «Rendi la stanza fuori squadra»
  await p.evaluate(new Function(prep + `st([[0,0],[5,0],[5,4],[0,4],[0,0]], 'P'); update(true); G.runs.filter(r => !r.ext).forEach(r => setMeasure(pl, 'r', r.key, r.H ? '4,40' : '3,40')); update(true); draw(); const t = document.querySelector('#toast'); if (t) t.style.pointerEvents = 'none';`));
  await p.click('[data-fly="quota"]'); await p.click('[data-diag]');
  await tapW(0.3, 0.3); await tapW(4.7, 3.7);
  out.tastierino = await p.evaluate(() => (document.querySelector('#inl .ms') || {}).textContent);
  await keys(['5', ',', '8']);
  out.prima = await p.evaluate(() => ({len:+G.dims[0].len.toFixed(3), avviso:G.warns.some(w => /fuori squadra/.test(w.t)), tasto:!!document.querySelector('#bFuoriSq')}));
  await p.click('#bFuoriSq'); await p.waitForTimeout(150);
  out.dopo = await p.evaluate(() => { const pl = piano(); return {len:+G.dims[0].len.toFixed(3), obliqui:pl.walls.filter(w => w.obl).length, misure:pl.walls.filter(w => w.obl).map(w => w.mis).join(' '),
    facce:pl.walls.filter(w => w.obl).map(w => f2(G.oblFace.get(w.id).int)).join(' '), area:+G.comps[0].area.toFixed(3), avvisi:G.warns.map(w => w.t)}; });
  await p.click('text=Adatta'); await p.waitForTimeout(150); await p.screenshot({path:OUT + '/diagonali_fuorisquadra.png'});
  out.script = await p.evaluate(() => (genScript(piano()).match(/_.DIMALIGNED/g) || []).length);
  // 2) trapezio senza lato sopra: la diagonale fissa lo spigolo; 3) rientro
  out.trapezio = await p.evaluate(new Function(prep + `st([[0,0],[6,0],[5,4],[0,4],[0,0]], 'P'); update(true);
    const runs = G.runs.filter(r => !r.ext); setMeasure(pl, 'r', runs.find(r => !r.H && r.walls.some(w => nd(pl,w.a).x < 1)).key, '3,70'); setMeasure(pl, 'r', runs.find(r => r.H && r.sg > 0).key, '5,70'); update(true);
    const cr = (x, y) => { let best = null, bd = 1.5; G.walls.forEach(wl => wl.pts.forEach(q => { const d = Math.hypot(q[0]-x, q[1]-y); if (d < bd) { bd = d; best = q; } })); return best; };
    const end = q => { let n = null, bd = Infinity; pl.nodes.forEach(k => { const d = Math.hypot(k.x - q[0], k.y - q[1]); if (d < bd) { bd = d; n = k; } }); return {n:n.id, dx:r4(q[0] - n.x), dy:r4(q[1] - n.y), x:q[0], y:q[1]}; };
    const d = {id:uid(), dg:true, a:end(cr(0.3,0.3)), b:end(cr(4.9,3.9)), H:true, o:0, v:''}; pl.dims = [d]; setMeasure(pl, 'q', d.id, '6,10'); update(true);
    const r1 = {diag:r3(G.dims[0].len), avvisi:G.warns.length};
    pl.dims = []; pl.mord = (pl.mord || []).filter(k => !k.startsWith('q:')); const ob = pl.walls.find(w => w.obl); setMeasure(pl, 'e', ob.id, '1,00'); update(true);
    return Object.assign(r1, {rientro:r3(Math.abs(G.oblFace.get(ob.id).fd[0])), asse:ob.rax, avvisiR:G.warns.length});`));
  // 4) Rendi obliquo / Rendi dritto dal pannello
  out.pannello = await p.evaluate(new Function(prep + `st([[0,0],[5,0],[5,4],[0,4],[0,0]], 'P'); update(true); const w = pl.walls.find(w => !isH(nd(pl,w.a), nd(pl,w.b)) && nd(pl,w.a).x > 4); ui.sel = {k:'w', id:w.id}; renderSide(); return w.id;`));
  await p.click('#bMkObl'); await p.waitForTimeout(100);
  const o1 = await p.evaluate(id => ({obl:piano().walls.find(w => w.id === id).obl, titolo:document.querySelector('#side .cardh').textContent.trim().split(' ').slice(0, 2).join(' ')}), out.pannello);
  await p.click('#bMkStr'); await p.waitForTimeout(100);
  const o2 = await p.evaluate(id => ({obl:!!piano().walls.find(w => w.id === id).obl, ambienti:G.comps.length}), out.pannello);
  out.pannello = {obliquo:o1, dritto:o2};
  console.log(JSON.stringify(out)); console.log('errors', errs); await b.close(); })();
