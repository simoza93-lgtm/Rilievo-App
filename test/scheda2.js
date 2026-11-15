// Scheda del rilievo: tasto «Scheda PDF» → pagine A4 con dati della pratica, una pianta per piano,
// tabelle di ambienti, porte e finestre e note per piano, foto quattro per pagina.
const APP = require('url').pathToFileURL(require('path').resolve(__dirname, '..', 'index.html')).href;
const OUT = require('path').join(__dirname, 'out'); require('fs').mkdirSync(OUT, {recursive: true});
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({viewport:{width:1400,height:950}, colorScheme:'dark'});
  const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  await p.goto(APP); await p.evaluate(()=>localStorage.clear()); await p.reload();
  const r = await p.evaluate(async () => {
    R = demo(); R.demo = false; R.id = 'sch2'; R.data = '2026-11-15'; R.fg = '12'; R.pla = '345'; R.sub = '2';
    // secondo piano copiato dal primo, terzo piano vuoto (non deve avere pagina)
    const p2 = JSON.parse(JSON.stringify(R.piani[0])); p2.id = 'p2'; p2.nome = 'Piano primo'; R.piani.push(p2);
    R.piani.push({id:'p3', nome:'Sottotetto', ver:0, nodes:[], walls:[], rooms:[]});
    R.piani[0].notes = (R.piani[0].notes || []).concat([{id:'nt1', x:1, y:1, t:'Contatore del gas in cucina\nverificare canna fumaria'}]);
    // cinque foto finte: quattro al piano terra (una in cucina), una al piano primo
    const foto = async (col, n, piano, room, nome) => { const c = document.createElement('canvas'); c.width = 1600; c.height = 1200; const g = c.getContext('2d'); g.fillStyle = col; g.fillRect(0, 0, 1600, 1200); g.fillStyle = '#fff'; g.font = '300px Arial'; g.fillText(String(n), 650, 700);
      const blob = await new Promise(res => c.toBlob(res, 'image/jpeg', 0.8)); const pl = R.piani.find(x => x.id === piano);
      const rm = room ? pl.rooms.find(x => x.nome === room) : null;
      await fPut({id:'f' + n, ril:R.id, piano, room:rm ? rm.id : undefined, data:'2026-11-15T10:0' + n, nome, blob, type:'image/jpeg', size:blob.size, fname:'', thumb:'', w:1600, h:1200, x:2, y:2}); };
    await foto('#3a7', 1, R.piani[0].id, 'Cucina', 'parete nord'); await foto('#37a', 2, R.piani[0].id, null, ''); await foto('#a73', 3, R.piani[0].id, null, 'facciata');
    await foto('#777', 4, R.piani[0].id, null, ''); await foto('#a3a', 5, 'p2', null, 'balcone');
    R.cur = 1; tab = 'calc'; ui.sel = null; render();
    const prima = {cur:R.cur, tab};
    window.print = () => { window.__stampato = true; };   // niente finestra di stampa nella prova
    await stampaScheda();
    const el = $('#scheda'), pg = [...el.querySelectorAll('.spg, .stab')];
    const tabella = (x, h) => { const t = [...x.querySelectorAll('h2')].find(e => e.textContent === h); return t ? [...t.nextElementSibling.querySelectorAll('tr')].map(r => [...r.children].map(c => c.textContent.trim()).join(' | ')) : null; };
    return {stampato:!!window.__stampato, pagine:pg.map(x => x.className + ': ' + [...x.querySelectorAll('h2')].map(h => h.textContent).join(', ')),
      dati:[...pg[0].querySelectorAll('tr')].map(t => t.textContent.trim().replace(/\s+/g, ' ')),
      intestazione:pg[1].querySelector('.sst').textContent.split('\n')[0],
      muri:[...el.querySelectorAll('.spl svg')].map(x => x.querySelectorAll('path').length > 10), idDoppi:el.querySelectorAll('[id]').length,
      ambienti:tabella(pg[1], 'Ambienti'), aperture:tabella(pg[1], 'Porte e finestre'), note:tabella(pg[1], 'Note'), noteP2:tabella(pg[3], 'Note'),
      foto:[...el.querySelectorAll('figcaption')].map(x => x.textContent), fotoOk:[...el.querySelectorAll('figure img')].map(i => i.naturalWidth),
      tasto:$('#bScheda').textContent, dopo:{cur:R.cur, tab, svgApp:!!$('#svg')}, prima};
  });
  await p.emulateMedia({media:'print', colorScheme:'dark'});
  await p.pdf({path:require('path').join(OUT, 'scheda.pdf'), format:'A4', preferCSSPageSize:true, printBackground:true});
  const pdfPagine = (require('fs').readFileSync(require('path').join(OUT, 'scheda.pdf'), 'latin1').match(/\/Type\s*\/Page[^s]/g) || []).length;
  for (const [k, v] of Object.entries(r)) console.log(k + ': ' + JSON.stringify(v));
  console.log('pagine del pdf', pdfPagine); console.log('errors', errs); await b.close();
})();
