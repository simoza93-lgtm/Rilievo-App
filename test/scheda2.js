// Scheda del rilievo, tappa 2: tasto «Scheda PDF» → pagine A4 con dati della pratica e una pianta per piano.
const APP = require('url').pathToFileURL(require('path').resolve(__dirname, '..', 'index.html')).href;
const OUT = require('path').join(__dirname, 'out'); require('fs').mkdirSync(OUT, {recursive: true});
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({viewport:{width:1400,height:950}, colorScheme:'dark'});
  const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  await p.goto(APP); await p.evaluate(()=>localStorage.clear()); await p.reload();
  const r = await p.evaluate(() => {
    R = demo(); R.data = '2026-11-15'; R.fg = '12'; R.pla = '345'; R.sub = '2';
    // secondo piano copiato dal primo, terzo piano vuoto (non deve avere pagina)
    const p2 = JSON.parse(JSON.stringify(R.piani[0])); p2.id = 'p2'; p2.nome = 'Piano primo'; R.piani.push(p2);
    R.piani.push({id:'p3', nome:'Sottotetto', ver:0, nodes:[], walls:[], rooms:[]});
    R.cur = 1; tab = 'calc'; ui.sel = null; render();
    const prima = {cur:R.cur, tab};
    window.print = () => { window.__stampato = true; };   // niente finestra di stampa nella prova
    $('#bScheda').click();
    const el = $('#scheda'), pg = [...el.querySelectorAll('.spg')];
    return {stampato:!!window.__stampato, pagine:pg.length,
      titoli:pg.map(x => x.querySelector('h2:last-of-type').textContent),
      dati:[...pg[0].querySelectorAll('tr')].map(t => t.textContent.trim().replace(/\s+/g, ' ')),
      intestazione:pg[1].querySelector('.sst').textContent.split('\n')[0],
      muri:pg.map(x => x.querySelectorAll('svg path').length > 10), idDoppi:el.querySelectorAll('[id]').length,
      dopo:{cur:R.cur, tab, svgApp:!!$('#svg')}, prima};
  });
  await p.emulateMedia({media:'print', colorScheme:'dark'});
  await p.pdf({path:require('path').join(OUT, 'scheda.pdf'), format:'A4', preferCSSPageSize:true, printBackground:true});
  const pdfPagine = (require('fs').readFileSync(require('path').join(OUT, 'scheda.pdf'), 'latin1').match(/\/Type\s*\/Page[^s]/g) || []).length;
  console.log(JSON.stringify(r)); console.log('pagine del pdf', pdfPagine); console.log('errors', errs); await b.close();
})();
