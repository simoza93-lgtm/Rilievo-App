// Grafica «muri neri»: spenta di norma, si accende dalle Impostazioni, resta al riavvio e non entra nella Scheda PDF.
const APP = require('url').pathToFileURL(require('path').resolve(__dirname, '..', 'index.html')).href;
const OUT = require('path').join(__dirname, 'out'); require('fs').mkdirSync(OUT, {recursive: true});
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({viewport:{width:1280, height:854}, colorScheme:'dark'});
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto(process.argv[2] || APP); await p.evaluate(() => localStorage.clear()); await p.reload(); await p.waitForTimeout(300);
  const stato = () => p.evaluate(() => { const s = document.querySelector('#svg'), st = n => getComputedStyle(s).getPropertyValue(n).trim();
    return {nuova:s.classList.contains('gn'), muro:st('--wall'), stanze:s.querySelectorAll('.gnr').length, bian:s.querySelectorAll('.gnr[fill="#fff"]').length, dots:!!s.querySelector('#gnp'), righe:s.querySelectorAll('line[stroke="var(--grid)"]').length > 0, misure:measItems().length}; });
  console.log('di norma', JSON.stringify(await stato()));
  await p.getByText('Impostazioni', {exact:true}).click(); await p.check('[data-pref="pnuova"]'); await p.getByText('Pianta', {exact:true}).first().click(); await p.waitForTimeout(200);
  console.log('accesa', JSON.stringify(await stato()));
  await p.evaluate(() => { piano().rooms[0].dest = 'Terrazzo'; update(true); }); console.log('con terra', JSON.stringify(await stato()));
  await p.screenshot({path:require('path').join(OUT, 'grafica.png')});
  const sch = await p.evaluate(() => { const x = schedaPiante(); return {nuova:x.some(q => /gnr|gnp/.test(q.svg)), grid:x.some(q => /var\(--grid\)/.test(q.svg))}; });
  console.log('in stampa', JSON.stringify(sch)); console.log('poi', JSON.stringify(await stato()));
  await p.reload(); await p.waitForTimeout(300); console.log('dopo f5', JSON.stringify(await stato()));
  await p.getByText('Impostazioni', {exact:true}).click(); await p.uncheck('[data-pref="pnuova"]'); await p.getByText('Pianta', {exact:true}).first().click(); await p.waitForTimeout(200);
  console.log('spenta', JSON.stringify(await stato()));
  console.log('errors', errs); await b.close();
})();
