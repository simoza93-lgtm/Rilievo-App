// Zoom sul disegno: niente tasti in barra; la lente sopra il tasto del piano apre lo slider, anche a schermo intero.
const APP = require('url').pathToFileURL(require('path').resolve(__dirname, '..', 'index.html')).href;
const OUT = require('path').join(__dirname, 'out'); require('fs').mkdirSync(OUT, {recursive: true});
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({viewport:{width:1280, height:854}});
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto(process.argv[2] || APP); await p.evaluate(() => localStorage.clear()); await p.reload(); await p.waitForTimeout(300);
  console.log('tasti zoom in barra:', await p.evaluate(() => [...document.querySelectorAll('.tbar button')].filter(e => /zoom/i.test(e.textContent)).length), "Adatta c'è:", await p.isVisible('#bFit'));
  const stato = () => p.evaluate(() => ({s:+ui.view.s.toFixed(1), centro:[+WX(ui.W / 2).toFixed(2), +WY(ui.H / 2).toFixed(2)], aperto:!document.querySelector('#zpan').hidden, cursore:+document.querySelector('#zrange').value}));
  for (const full of [false, true]) {
    if (full) { await p.click('#bFull'); await p.waitForTimeout(200); }
    await p.locator('#bZoom').scrollIntoViewIfNeeded();
    console.log(full ? 'schermo intero' : 'normale', 'sopra il tasto del piano:', await p.evaluate(() => { const z = document.querySelector('#bZoom').getBoundingClientRect(), q = document.querySelector('#bPiani').getBoundingClientRect(); return z.bottom <= q.top && q.top - z.bottom < 20 && Math.abs(z.left - q.left) < 2; }));
    await p.click('#bFit'); console.log('chiuso', JSON.stringify(await stato()));
    await p.click('#bZoom'); console.log('aperto', JSON.stringify(await stato()));
    if (full) await p.screenshot({path:require('path').join(OUT, 'zoom.png')});
    // trascino il cursore col dito/mouse: in alto avvicina, in basso allontana, il centro resta fermo
    const r = await p.locator('#zrange').boundingBox();
    for (const [nome, f] of [['in alto', 0.1], ['in basso', 0.9]]) { await p.mouse.move(r.x + r.width / 2, r.y + r.height / 2); await p.mouse.down(); await p.mouse.move(r.x + r.width / 2, r.y + r.height * f, {steps:8}); await p.mouse.up(); console.log(nome, JSON.stringify(await stato())); }
    await p.$eval('#zrange', e => { e.value = 1000; e.dispatchEvent(new Event('input', {bubbles:true})); }); const max = (await stato()).s;
    await p.$eval('#zrange', e => { e.value = 0; e.dispatchEvent(new Event('input', {bubbles:true})); }); console.log('limiti', max, (await stato()).s);
    await p.click('#bFit'); console.log('tocco altrove, si chiude:', !(await stato()).aperto);
    await p.click('#bZoom'); await p.click('#bZoom'); console.log('secondo tocco sulla lente, si chiude:', !(await stato()).aperto);
  }
  console.log('disegni non aggiunti, muri:', await p.evaluate(() => piano().walls.length));
  console.log('errors', errs); await b.close();
})();
