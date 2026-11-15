const APP = require('url').pathToFileURL(require('path').resolve(__dirname, '..', 'index.html')).href;
const OUT = require('path').join(__dirname, 'out'); require('fs').mkdirSync(OUT, {recursive: true});
const { chromium } = require('playwright');
// sagoma di un altro piano: muri perimetrali tratteggiati sotto il disegno, aggancio della penna (senza vincolo),
// scelta del piano (sopra o sotto), layer acceso/spento, «Allinea questo piano alla sagoma»
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({viewport:{width:1400,height:950}});
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto(process.argv[2] || APP); await p.evaluate(() => localStorage.clear()); await p.reload();
  await p.evaluate(() => { window.ST = (pts, tipo) => { ui.newType = tipo; ui.mode = 'draw'; const sp = []; for (let i = 0; i < pts.length - 1; i++) { const a = pts[i], c = pts[i+1]; for (let k = 0; k < 8; k++) sp.push([SX(a[0] + (c[0]-a[0])*k/8), SY(a[1] + (c[1]-a[1])*k/8)]); } sp.push([SX(pts[pts.length-1][0]), SY(pts[pts.length-1][1])]); finishStroke(sp); update(true); };
    // nodi nell'edificio (coordinate del piano + posizione del piano)
    window.BLD = pl => pl.nodes.map(n => [r4(n.x + orgOf(pl)[0]), r4(n.y + orgOf(pl)[1])]).sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    window.MIS = () => { G.runs.filter(r => !r.ext).forEach(r => { const a = G.T.N.get(r.p), q = G.T.N.get(r.q); setMeasure(piano(), 'r', r.key, f2(Math.abs(r.H ? q.x - a.x : q.y - a.y) - r.eA - r.eB)); }); update(true); };
    const t = document.querySelector('#toast'); if (t) t.style.pointerEvents = 'none'; });
  const out = {};
  // 1) piano terra 10 × 8 con le misure; piano primo vuoto: la sagoma c'è e la vista la inquadra
  out.terra = await p.evaluate(() => { R = blank(); R.id = 'sg'; tab = 'pianta'; render(); ui.view = {x:-2, y:-2, s:50}; G = geometry(piano());
    ST([[0,0],[10,0],[10,8],[0,8],[0,0]], 'P'); ST([[5,0],[5,8]], 'T'); MIS();
    return {org:piano().org || null, nodi:BLD(piano())}; });
  out.primo = await p.evaluate(() => { R.piani.push({id:uid(), nome:'Piano primo', ver:0, nodes:[], walls:[], rooms:[]}); R.cur = 1; ui.sel = null; ui.fitted = false; render(); fit(); draw();
    const svg = $('#svg').innerHTML; return {sagoma:/Sagoma: Piano terra/.test(svg), vista:[+ui.view.x.toFixed(2), +ui.view.y.toFixed(2)], rif:sagRef(piano()).nome}; });
  await p.screenshot({path:OUT + '/sagoma_vuoto.png'});
  // 2) piano primo più corto (6 × 8): parto 12 cm fuori dallo spigolo della sagoma, la penna si aggancia
  out.aggancio = await p.evaluate(() => { const g = sagGeo(piano()), n0 = g.nodes.reduce((a, n) => n.x + n.y < a.x + a.y ? n : a);
    const x0 = n0.x - 0.12, y0 = n0.y - 0.10; ST([[x0, y0], [x0 + 6, y0], [x0 + 6, y0 + 8.05], [x0, y0 + 8.05], [x0, y0]], 'P');
    const terra = BLD(R.piani[0]), primo = BLD(piano()), su = q => terra.some(t => Math.abs(t[0] - q[0]) < 1e-3 && Math.abs(t[1] - q[1]) < 1e-3);
    return {nodiSullaSagoma:primo.filter(su).length + '/' + primo.length, primo, org:piano().org}; });
  // 3) misura diversa dal piano sotto: il muro si sposta, la sagoma resta dov'è
  out.misura = await p.evaluate(() => { const pl = piano(); const r = G.runs.find(r => !r.ext && !r.H); const sg0 = JSON.stringify(sagGeo(pl).bbox);
    setMeasure(pl, 'r', r.key, '7,30'); update(true); const g = sagGeo(pl);
    return {sagomaFerma:JSON.stringify(g.bbox.map((v, i) => r4(v + [0, 0, 0, 0][i]))) !== '' && JSON.stringify(sagGeo(pl).bbox) === sg0 || {prima:sg0, dopo:JSON.stringify(g.bbox)},
      alto:{primo:r4(Math.max(...pl.nodes.map(n => n.y)) + orgOf(pl)[1]), terra:r4(Math.max(...R.piani[0].nodes.map(n => n.y)) + orgOf(R.piani[0])[1])}}; });
  await p.evaluate(() => { fit(); draw(); }); await p.screenshot({path:OUT + '/sagoma_primo.png'});
  // 4) layer spento: niente sagoma e niente aggancio; tramezzo: niente aggancio
  out.spento = await p.evaluate(() => { lSet('G', 'off', true); draw(); const vis = /Sagoma:/.test($('#svg').innerHTML); ui.newType = 'P'; const sn = sagNode(piano(), 0.2, 0.2, 0.3); lSet('G', 'off', false); ui.newType = 'T'; const tr = sagNode(piano(), 0.2, 0.2, 0.3); ui.newType = 'P'; draw(); return {visibile:vis, aggancioSpento:sn, aggancioTramezzo:tr}; });
  // 5) pannello Layer: riga, scelta del piano, piano sopra come sagoma del piano terra
  await p.click('[data-cat="layer"]'); await p.waitForTimeout(80);
  out.pannello = await p.evaluate(() => ({riga:[...document.querySelectorAll('#appan .lyr .lyn')].map(e => e.textContent).includes('Sagoma altro piano'), scelte:[...document.querySelectorAll('#appan [data-sag] option')].map(o => o.textContent), bottone:$('#bAlli') && $('#bAlli').textContent}));
  await p.screenshot({path:OUT + '/sagoma_pannello.png'});
  await p.evaluate(() => { $('#selPiano').value = '0'; $('#selPiano').dispatchEvent(new Event('change')); });
  out.terraSagoma = await p.evaluate(() => ({rif:(sagRef(piano()) || {}).nome, scelte:[...document.querySelectorAll('#appan [data-sag] option')].map(o => o.textContent)}));
  // 6) piano secondo disegnato fuori posto (sagoma spenta), scelgo come sagoma il piano terra e allineo con due tocchi
  await p.evaluate(() => { R.piani.push({id:uid(), nome:'Piano secondo', ver:0, nodes:[], walls:[], rooms:[]}); R.cur = 2; ui.sel = null; render(); ui.view = {x:-6, y:-6, s:40}; lSet('G', 'off', true); G = geometry(piano());
    ST([[3,2],[13,2],[13,10],[3,10],[3,2]], 'P'); MIS(); lSet('G', 'off', false); updApPan(); fit(); draw(); });
  await p.selectOption('#appan [data-sag]', {label:'Piano terra'}); await p.waitForTimeout(80);
  out.prima = await p.evaluate(() => ({rif:sagRef(piano()).nome, sagP:!!piano().sagP, org:piano().org}));
  const tap = async q => { const s = await p.evaluate(q => { const r = $('#svg').getBoundingClientRect(); return [r.left + SX(q[0]), r.top + SY(q[1])]; }, q); await p.mouse.click(s[0], s[1]); await p.waitForTimeout(100); };
  await p.click('#bAlli'); await p.waitForTimeout(80);
  const cA = await p.evaluate(() => { const pts = G.walls.flatMap(w => w.pts); return pts.reduce((a, q) => q[0] + q[1] < a[0] + a[1] ? q : a); });
  const cB = await p.evaluate(() => sagGeo(piano()).corners.reduce((a, q) => q[0] + q[1] < a[0] + a[1] ? q : a));
  await tap([cA[0] + 0.05, cA[1] + 0.05]); out.primoTocco = await p.evaluate(() => [!!ui.alli && !!ui.alli.a, $('#toast').textContent]);
  await tap([cB[0] - 0.05, cB[1] - 0.05]);
  out.allineato = await p.evaluate(() => { const terra = BLD(R.piani[0]), sec = BLD(piano()); return {alli:ui.alli, toast:$('#toast').textContent, spigoliSulPianoTerra:sec.filter(q => terra.some(t => Math.abs(t[0] - q[0]) < 1e-3 && Math.abs(t[1] - q[1]) < 1e-3)).length + '/' + sec.length, misure:measItems().filter(m => m.r && !m.r.ext).map(m => f2(m.val)).sort().join(' ')}; });
  await p.screenshot({path:OUT + '/sagoma_allineato.png'});
  await p.evaluate(() => undo()); out.annulla = await p.evaluate(() => piano().org);
  // 7) script: invariato, la sagoma non c'è
  out.script = await p.evaluate(() => /Sagoma/i.test(genScript(piano())));
  console.log(JSON.stringify(out, null, 1)); console.log('errors', errs); await b.close(); })();
