// Dal video del 26 novembre 2026: con il layer delle scale spento la scala posata non si vedeva (restavano le sue misure).
const APP = require('url').pathToFileURL(require('path').resolve(__dirname, '..', 'index.html')).href;
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({viewport:{width:1280, height:854}});
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto(process.argv[2] || APP); await p.evaluate(() => localStorage.clear()); await p.reload(); await p.waitForTimeout(300);
  await p.evaluate(() => { R = blank(); R.id = 'ss'; tab = 'pianta'; render(); const pl = piano(); ui.view = {x:-2, y:-7, s:60}; G = geometry(pl);
    ui.newType = 'P'; const pts = [[0,0],[0,5],[7,5],[7,0],[0,0]], s = []; for (let i = 0; i < 4; i++) { const a = pts[i], c = pts[i + 1]; for (let k = 0; k < 6; k++) s.push([SX(a[0] + (c[0] - a[0]) * k / 6), SY(a[1] + (c[1] - a[1]) * k / 6)]); } s.push([SX(0), SY(0)]); finishStroke(s);
    R.lay = {S:{off:true}, R:{off:true}}; update(true); ui.sel = null; ui.fitted = false; render(); });
  const stato = () => p.evaluate(() => ({scale:(piano().stairs || []).length, tratti:document.querySelectorAll('#svg line[stroke="var(--wI)"]').length > 10, spentoS:lOff('S'), spentoR:lOff('R'), avviso:$('#toast').textContent.split('. ')[0]}));
  await p.click('[data-cat="scale"]'); await p.click('#appan [data-ap="sc:dritta"]');
  const q = await p.evaluate(() => { const r = $('#svg').getBoundingClientRect(); return [r.left + SX(3), r.top + SY(2.5)]; });
  await p.mouse.move(q[0], q[1]); await p.mouse.down(); await p.mouse.move(q[0] + 15, q[1] + 10, {steps:4}); await p.mouse.up(); await p.waitForTimeout(250);
  console.log('scala', JSON.stringify(await stato()));
  // porta: posata sul muro in alto
  await p.evaluate(() => { dropGhost(ghostAt([SX(2), SY(5)], 'porta', 0.8, null)); }); await p.waitForTimeout(150);
  console.log('porta', JSON.stringify(await stato()), 'porte', await p.evaluate(() => piano().walls.flatMap(w => w.ap || []).length));
  console.log('errors', errs); await b.close();
})();
