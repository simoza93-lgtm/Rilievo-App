// Piani dal tasto in basso a sinistra: aggiunta in ordine di livello, cambio, rinomina, eliminazione, pagina Calcoli, riapertura.
const APP = require('url').pathToFileURL(require('path').resolve(__dirname, '..', 'index.html')).href;
const OUT = require('path').join(__dirname, 'out'); require('fs').mkdirSync(OUT, {recursive: true});
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({viewport:{width:1280, height:854}});
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  let risposta = null; p.on('dialog', d => { console.log('  domanda:', d.message()); risposta === null ? d.dismiss() : d.accept(risposta); });
  await p.goto(process.argv[2] || APP); await p.evaluate(() => localStorage.clear()); await p.reload(); await p.waitForTimeout(300);
  console.log('in alto restano comandi dei piani:', await p.evaluate(() => [...document.querySelectorAll('header button, header select')].some(e => /piano/i.test(e.textContent))));
  await p.click('#bFull'); await p.waitForTimeout(200);
  const stato = () => p.evaluate(() => `${R.piani.map((x, i) => (i === R.cur ? '[' + x.nome + ']' : x.nome) + ' ' + x.walls.length + ' muri').join(' | ')} — tasto «${document.querySelector('#bPiani span').textContent}»`);
  const voci = () => p.$$eval('[data-pnome]', l => l.map(e => e.textContent).join(', '));
  console.log('tasto in basso a sinistra a schermo intero:', await p.evaluate(() => { const r = document.querySelector('#bPiani').getBoundingClientRect(), c = document.querySelector('#cv').getBoundingClientRect(); return r.left - c.left < 20 && c.bottom - r.bottom < 20; }));
  console.log(await stato());
  const aggiungi = async n => { await p.click('#bPiani'); await p.click('[data-padd]'); await p.click(`[data-pnome="${n}"]`); await p.waitForTimeout(150); console.log('aggiunto', n + ':', await stato()); };
  await p.click('#bPiani span'); console.log('miniature:', await p.$$eval('[data-pvai]', l => l.length), 'con muri disegnati:', await p.evaluate(() => document.querySelectorAll('[data-pvai] line').length > 0));
  await p.click('[data-padd]'); console.log('nomi proposti:', await voci()); await p.click('[data-pchiudi]');
  await aggiungi('Piano secondo'); await aggiungi('Piano primo'); await aggiungi('Interrato');
  await p.click('#bPiani'); await p.click('[data-padd]'); console.log('nomi rimasti:', await voci());
  risposta = 'Soppalco'; await p.click('[data-paltro]'); await p.waitForTimeout(150); console.log(await stato());
  await p.click('#bPiani'); await p.screenshot({path:require('path').join(OUT, 'piani.png')});
  await p.click('[data-pvai="1"]'); await p.waitForTimeout(150); console.log('toccata la seconda miniatura:', await stato(), 'finestra chiusa:', await p.evaluate(() => !document.querySelector('#dPiani').open));
  // rinomina di un piano non aperto
  await p.click('#bPiani'); await p.click('[data-pmenu="4"]'); risposta = 'Sottotetto'; await p.click('[data-pren="4"]'); await p.click('[data-pchiudi]'); console.log('rinominato:', await stato());
  // eliminazione: annullata, poi di un piano non aperto, poi di quello aperto
  await p.click('#bPiani'); await p.click('[data-pmenu="0"]'); risposta = null; await p.click('[data-pdel="0"]'); console.log('annullata:', await stato());
  await p.click('[data-pmenu="0"]'); risposta = ''; await p.click('[data-pdel="0"]'); await p.waitForTimeout(150); console.log('eliminato l\'interrato:', await stato());
  await p.click('[data-pmenu="0"]'); await p.click('[data-pdel="0"]'); await p.waitForTimeout(150); console.log('eliminato quello aperto:', await stato());
  await p.click('[data-pchiudi]');
  // pagina Calcoli: stesso tasto
  console.log('  a schermo intero dopo le domande:', await p.evaluate(() => ui.full)); if (await p.evaluate(() => ui.full)) await p.click('#bFull'); await p.waitForTimeout(150); await p.click('[data-tab="calc"]');
  await p.click('#bPiani'); await p.click('[data-pvai="1"]'); await p.waitForTimeout(150);
  console.log('in Calcoli scelto il secondo:', await p.evaluate(() => tab + ' ' + piano().nome + ' / ' + document.querySelector('#bPiani span').textContent));
  await p.evaluate(() => { R.demo = false; R.id = 'piani'; save(); }); await p.waitForTimeout(1500); await p.reload(); await p.waitForTimeout(600);
  console.log('riaperta:', await stato());
  // con un piano solo non si elimina
  for (let i = 0; i < 4; i++) { if (await p.evaluate(() => R.piani.length) === 1) break; await p.click('#bPiani'); await p.click('[data-pmenu="0"]'); risposta = ''; await p.click('[data-pdel="0"]'); await p.click('[data-pchiudi]'); }
  await p.click('#bPiani'); await p.click('[data-pmenu="0"]'); await p.click('[data-pdel="0"]'); await p.click('[data-pchiudi]'); console.log('ultimo piano:', await stato());
  console.log('errors', errs); await b.close();
})();
