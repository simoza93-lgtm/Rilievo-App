const APP = require('url').pathToFileURL(require('path').resolve(__dirname, '..', 'index.html')).href;
const OUT = require('path').join(__dirname, 'out'); require('fs').mkdirSync(OUT, {recursive: true});
const { chromium } = require('playwright');
// ascensore da solo (pannello Scale e ascensore): blocco con pareti del vano, cabina con la croce e porta; si accosta ai muri,
// «Ruota 90°» gira la porta, si toglie dalla superficie, si riporta ai piani sopra, script; fuori dalla tabella delle scale
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({viewport:{width:1400,height:950}});
  const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  await p.goto(process.argv[2] || APP); await p.evaluate(()=>localStorage.clear()); await p.reload();
  await p.evaluate(() => { R = blank(); R.id='li'; tab='pianta'; render(); var pl = piano(); ui.view={x:-1,y:-1,s:60}; G = geometry(pl);
    const st = (pts, tipo) => { ui.newType = tipo; const sp = []; for (let i = 0; i < pts.length - 1; i++) { const a = pts[i], c = pts[i+1]; for (let k = 0; k < 8; k++) sp.push([SX(a[0] + (c[0]-a[0])*k/8), SY(a[1] + (c[1]-a[1])*k/8)]); } sp.push([SX(pts[pts.length-1][0]), SY(pts[pts.length-1][1])]); finishStroke(sp); };
    st([[0,0],[6,0],[6,4],[0,4],[0,0]], 'P'); ui.mode = 'select'; update(true); draw(); });
  const out = {};
  await p.click('[data-cat="scale"]'); await p.click('#appan [data-ap="sc:lift"]');
  { const bx = await p.evaluate(()=>{ const r = $('#svg').getBoundingClientRect(); return [r.left + SX(1.25), r.top + SY(1.2)]; }); await p.mouse.move(bx[0], bx[1]); await p.mouse.down(); await p.mouse.move(bx[0] + 6, bx[1], {steps:3}); await p.mouse.up(); await p.waitForTimeout(150); }
  const info = () => p.evaluate(() => { const s = piano().stairs[0], P = stairPrims(s), r2 = v => +v.toFixed(2), d = P.lift.door[0];
    return {tipo:s.tipo, ingombro:[r2(P.bbox[0]), r2(P.bbox[1]), r2(P.bbox[2]), r2(P.bbox[3])], pareti:P.lift.walls.length, frecce:P.arrs.length, numeri:P.nums.length,
      porta:Math.abs(d[1][0] - d[0][0]) > Math.abs(d[1][1] - d[0][1]) ? (d[0][1] < (P.bbox[1] + P.bbox[3]) / 2 ? 'sotto' : 'sopra') : (d[0][0] < (P.bbox[0] + P.bbox[2]) / 2 ? 'sinistra' : 'destra'),
      superficie:r2(G.comps[0].area - G.comps[0].foro), foro:r2(G.comps[0].foro)}; });
  out.posato = await info(); out.toast = await p.evaluate(() => $('#toast').textContent);
  await p.evaluate(() => { ui.sel = {k:'s', id:piano().stairs[0].id}; ui.apCat = null; ui.placeSc = false; updTools(); renderSide(); draw(); });
  out.pannello = await p.evaluate(() => ({titolo:$('#side .cardh').textContent.trim(), campi:[...document.querySelectorAll('#side [data-st]')].map(e => e.dataset.st).join(','), tipoScala:!!document.querySelector('#side [data-st="tipo"]')}));
  await p.click('#bRotS'); await p.waitForTimeout(80); out.ruotato = (await info()).porta;
  await p.evaluate(() => { const e = document.querySelector('#side [data-st="ax"]'); e.value = '1,80'; e.dispatchEvent(new Event('input', {bubbles:true})); }); out.largo = await info();
  await p.click('text=Adatta'); await p.waitForTimeout(150); await p.screenshot({path:OUT + '/lift.png'});
  out.script = await p.evaluate(() => { const L = genScript(piano()).split(/\r?\n/), i = L.findIndex(x => /^; ascensore/.test(x)); return {ascensore:i >= 0, layer:L[i + 2], dopo:L[i + 17]}; });
  out.calcoli = await p.evaluate(() => stairsCalc(piano()) === '');
  // riporta al piano sopra
  out.sopra = await p.evaluate(() => { R.piani.push({id:uid(), nome:'Piano primo', ver:0, nodes:[], walls:[], rooms:[]}); renderSide(); return true; });
  await p.click('#bLinkS'); await p.waitForTimeout(80);
  out.riportato = await p.evaluate(() => ({toast:$('#toast').textContent, sopra:(R.piani[1].stairs || []).map(s => s.tipo)}));
  console.log(JSON.stringify(out, null, 1)); console.log('errors', errs); await b.close(); })();
