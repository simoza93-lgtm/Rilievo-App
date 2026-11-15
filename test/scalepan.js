const APP = require('url').pathToFileURL(require('path').resolve(__dirname, '..', 'index.html')).href;
const OUT = require('path').join(__dirname, 'out'); require('fs').mkdirSync(OUT, {recursive: true});
const { chromium } = require('playwright');
// pannello «Scale e ascensore» a destra: il tasto Scala lo apre, il tipo scelto è quello che si posa, il pannello resta aperto
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({viewport:{width:1400,height:950}});
  const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  await p.goto(process.argv[2] || APP); await p.evaluate(()=>localStorage.clear()); await p.reload();
  await p.evaluate(() => { R = blank(); R.id='sp'; tab='pianta'; render(); var pl = piano(); ui.view={x:-1,y:-1,s:50}; G = geometry(pl);
    const st = (pts, tipo) => { ui.newType = tipo; const sp = []; for (let i = 0; i < pts.length - 1; i++) { const a = pts[i], c = pts[i+1]; for (let k = 0; k < 8; k++) sp.push([SX(a[0] + (c[0]-a[0])*k/8), SY(a[1] + (c[1]-a[1])*k/8)]); } sp.push([SX(pts[pts.length-1][0]), SY(pts[pts.length-1][1])]); finishStroke(sp); };
    st([[0,0],[14,0],[14,6],[0,6],[0,0]], 'P'); ui.mode = 'select'; update(true); draw(); });
  const box = async () => p.evaluate(()=>{ const r = $('#svg').getBoundingClientRect(); return [r.left, r.top]; });
  const drop = async (x, y) => { const bx = await box(), s = await p.evaluate(([x, y]) => [SX(x), SY(y)], [x, y]); await p.mouse.move(bx[0] + s[0], bx[1] + s[1]); await p.mouse.down(); await p.mouse.move(bx[0] + s[0] + 6, bx[1] + s[1], {steps:3}); await p.mouse.up(); await p.waitForTimeout(120); };
  const out = {};
  await p.click('[data-cat="scale"]'); await p.waitForTimeout(100);
  out.pannello = await p.evaluate(() => ({aperto:!$('#appan').hidden, titolo:$('#appan .aph span').textContent, tipi:[...document.querySelectorAll('#appan [data-ap]')].map(b => b.textContent), scelto:ui.placeSc, on:$('[data-cat="scale"]').classList.contains('on')}));
  const ts = ['dritta', 'L', 'U', 'chiocciola'];
  for (let i = 0; i < ts.length; i++) { await p.click(`#appan [data-ap="sc:${ts[i]}"]`); await drop(2 + i * 3.3, 3); }
  out.posate = await p.evaluate(() => ({tipi:(piano().stairs || []).map(s => s.tipo), aperto:!$('#appan').hidden, scelto:ui.placeSc}));
  await p.click('text=Adatta'); await p.waitForTimeout(150); await p.screenshot({path:OUT + '/scale_pannello.png'});
  await p.click('#appan [data-apx]'); out.chiuso = await p.evaluate(() => ({aperto:!$('#appan').hidden, placeSc:ui.placeSc}));
  await p.click('[data-cat="scale"]'); out.ultimo = await p.evaluate(() => ui.placeSc); await p.click('[data-cat="porte"]');
  out.passaAPorte = await p.evaluate(() => ({cat:ui.apCat, placeSc:ui.placeSc, place:ui.place}));
  console.log(JSON.stringify(out, null, 1)); console.log('errors', errs); await b.close(); })();
