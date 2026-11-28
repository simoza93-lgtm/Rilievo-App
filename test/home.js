// Menu iniziale e pagina del rilievo: avvio, Nuovo (disegno, DXF, foto), indietro, file, piani, impostazioni.
const path = require('path'), fs = require('fs');
const APP = require('url').pathToFileURL(path.resolve(__dirname, '..', 'index.html')).href;
const OUT = path.join(__dirname, 'out'); fs.mkdirSync(OUT, {recursive: true});
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const ctx = await b.newContext({viewport:{width:1280, height:854}, acceptDownloads:true, colorScheme:'dark'}); const p = await ctx.newPage();
  const errs = [], giu = []; p.on('pageerror', e => errs.push(e.message)); p.on('dialog', d => { if (d.type() === 'beforeunload') d.accept(); else { console.log('  domanda:', d.message().split('\n')[0]); d.accept(); } }); p.on('download', d => giu.push(d.suggestedFilename().replace(/\d{4}-\d\d-\d\d/, 'DATA')));
  await p.goto(process.argv[2] || APP); await p.evaluate(() => localStorage.clear()); await p.reload(); await p.waitForTimeout(400);
  const dove = () => p.evaluate(() => tab + ' | indietro: ' + (document.querySelector('#bBack').hidden ? '-' : document.querySelector('#bBack').textContent) + ' | tasti in alto: ' + [...document.querySelectorAll('header button')].filter(x => x.offsetParent).map(x => x.textContent).join(',') + ' | rilievi salvati: ' + arcIndex().length);
  const tocca = async s => { await p.click(s); await p.waitForTimeout(300); };
  const indietroAndroid = async () => { await p.evaluate(() => history.back()); await p.waitForTimeout(300); };
  const scatto = n => p.screenshot({path:path.join(OUT, 'home-' + n + '.png')});
  console.log('avvio:', await dove()); await scatto('1-menu');
  console.log('carte:', await p.evaluate(() => [...document.querySelectorAll('.rcard b, .radd span')].map(x => x.textContent).join(' ; ')));
  await tocca('#bNew'); console.log('nuovo:', await dove()); await tocca('#bBack'); console.log('nuovo lasciato vuoto:', await dove());
  // nuovo scritto e disegnato
  await tocca('#bNew'); await p.fill('input[data-s="nome"]', 'Casa Rossi'); await p.fill('input[data-s="indirizzo"]', 'via Roma 1'); await scatto('2-nuovo');
  await tocca('button[data-pdis="0"]'); console.log('disegno:', await dove());
  await p.evaluate(() => { ui.view = {x:-3, y:-8, s:55}; G = geometry(piano()); ui.newType = 'P'; const pts = [[0, 0], [5, 0], [5, 4], [0, 4], [0, 0]], s = []; for (let i = 0; i < 4; i++) { const a = pts[i], c = pts[i + 1]; for (let k = 0; k < 6; k++) s.push([SX(a[0] + (c[0] - a[0]) * k / 6), SY(a[1] + (c[1] - a[1]) * k / 6)]); } s.push([SX(0), SY(0)]); finishStroke(s); update(true);
    G.runs.filter(r => r.comp >= 0).forEach(r => { piano().fm[r.key] = f2(r.H ? 4.4 : 3.4); }); update(true); });
  await p.waitForTimeout(700); await indietroAndroid(); console.log('indietro Android:', await dove()); await p.waitForTimeout(300); await scatto('3-rilievo');
  console.log('totali:', await p.evaluate(() => [...document.querySelectorAll('.tot div')].map(x => x.textContent).join(' ; ')));
  const prima = await p.evaluate(() => JSON.stringify(R.piani));
  await p.evaluate(() => render()); console.log('i totali non toccano il rilievo:', prima === await p.evaluate(() => JSON.stringify(R.piani)));
  await indietroAndroid(); console.log('indietro Android:', await dove()); console.log('stato:', await p.evaluate(() => document.querySelector('.rcard .b').textContent));
  await tocca('.rcard[data-apri]'); console.log('riaperto:', await dove());
  await tocca('#bExp'); console.log('esportato, pallino:', await p.evaluate(() => document.querySelector('#bExp').classList.contains('dirty')));
  await tocca('#bScr'); await p.evaluate(() => { window.print = () => { window.stampato = (document.querySelector('#scheda') || {}).innerHTML.length > 500; }; }); await tocca('#bScheda'); await p.waitForTimeout(600);
  console.log('scheda stampata:', await p.evaluate(() => window.stampato), '| dopo:', await dove()); console.log('file scaricati:', giu.join(', '));
  // secondo piano dalla pagina, poi script con scelta del piano
  await tocca('button[data-piu]'); await tocca('#dPiani button[data-pnome="Piano primo"]'); console.log('piano nuovo:', await dove(), '|', await p.evaluate(() => piano().nome)); await tocca('#bBack');
  console.log('piante:', await p.evaluate(() => [...document.querySelectorAll('.pnome')].map(x => x.textContent).join(', ')));
  await tocca('#bScr'); console.log('scelta piano:', await p.evaluate(() => [...document.querySelectorAll('#dScelta .plist button')].map(x => x.textContent).join(', '))); giu.length = 0; await tocca('#dScelta button[data-scrp="0"]'); console.log('script:', giu.join(', '));
  await tocca('button[data-ppunti="1"]'); await tocca('#dPiani button[data-pren="1"]'); await p.fill('#pNome', 'Sottotetto'); await p.press('#pNome', 'Enter'); await p.waitForTimeout(300); await tocca('#dPiani button[data-pchiudi]');
  console.log('rinominato:', await dove(), '|', await p.evaluate(() => [...document.querySelectorAll('.pnome')].map(x => x.textContent).join(', ')));
  await tocca('button[data-pdis="0"]'); console.log('tocco pianta:', await dove(), '|', await p.evaluate(() => piano().nome + ', muri ' + piano().walls.length)); await tocca('#bBack');
  await tocca('button[data-vai="calc"]'); console.log('vedi tutto:', await dove()); await tocca('#bBack');
  await tocca('button[data-vai="set"]'); console.log('modifica:', await dove()); await tocca('#bBack');
  await tocca('button[data-vai="foto"]'); console.log('foto:', await dove()); await tocca('#bBack');
  // duplica ed elimina
  await tocca('#bDup'); console.log('duplica:', await dove()); await tocca('.rcard[data-apri] >> nth=0'); await tocca('#bElim'); console.log('elimina:', await dove());
  // nuovo da DXF: resta lo stesso rilievo
  const dxf = ['0', 'SECTION', '2', 'ENTITIES']; [[0, 0, 6, 0], [6, 0, 6, 4], [6, 4, 0, 4], [0, 4, 0, 0], [0.3, 0.3, 5.7, 0.3], [5.7, 0.3, 5.7, 3.7], [5.7, 3.7, 0.3, 3.7], [0.3, 3.7, 0.3, 0.3]].forEach(s => dxf.push('0', 'LINE', '8', 'MURI', '10', String(s[0]), '20', String(s[1]), '11', String(s[2]), '21', String(s[3]))); dxf.push('0', 'ENDSEC', '0', 'EOF');
  const file = path.join(OUT, 'home.dxf'); fs.writeFileSync(file, dxf.join('\n'));
  await tocca('#bNew'); await p.fill('input[data-s="nome"]', 'Da disegno'); const [sc] = await Promise.all([p.waitForEvent('filechooser'), p.click('#bDxf')]); await sc.setFiles(file); await p.waitForTimeout(500); await tocca('#dxAv'); await p.waitForTimeout(400);
  console.log('dxf, tasti:', await p.evaluate(() => [...document.querySelectorAll('#dDxf .btns button')].map(x => x.textContent).join(', ')));
  await tocca('#dxCrea'); console.log('dxf nel rilievo nuovo:', await dove(), '|', await p.evaluate(() => R.nome + ', muri ' + piano().walls.length + ', piani ' + R.piani.length)); await tocca('#bBack'); await tocca('#bBack'); console.log('menu:', await dove());
  // nuovo dalla foto della planimetria
  await tocca('#bNew'); const [sc2] = await Promise.all([p.waitForEvent('filechooser'), p.click('button[data-nfoto="fBgGal"]')]); await sc2.setFiles(path.join(__dirname, '..', 'icons', 'icon-512.png')); await p.waitForTimeout(900);
  console.log('foto planimetria:', await dove(), '| sfondo:', await p.evaluate(() => !!piano().bg)); await tocca('#bBack'); await tocca('#bBack'); console.log('menu:', await dove()); await scatto('4-menu-pieno');
  // impostazioni: colori (restano dopo il riavvio) e limiti validi per tutti
  await tocca('#bCfg'); console.log('impostazioni:', await dove()); await p.selectOption('select[data-pref="tema"]', 'chiaro'); await p.fill('input[data-def="rai"]', '10'); await scatto('5-impostazioni');
  const colori = () => p.evaluate(() => tab + ' ' + (document.documentElement.dataset.tema || 'come il tablet') + ' ' + getComputedStyle(document.body).backgroundColor);
  console.log(await colori()); await p.waitForTimeout(600); await p.reload(); await p.waitForTimeout(500); console.log('riavvio:', await colori(), '|', await dove());
  await tocca('.rcard[data-apri] >> nth=1'); console.log('limite in un altro rilievo: RAI 1/' + await p.evaluate(() => R.rai)); await tocca('button[data-pdis="0"]'); console.log(await colori());
  await p.setViewportSize({width:854, height:1280}); await tocca('#bBack'); await p.waitForTimeout(300); await scatto('6-rilievo-verticale'); await tocca('#bBack'); await scatto('7-menu-verticale');
  console.log('errors', errs); await b.close();
})();
