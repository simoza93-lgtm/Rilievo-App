const APP = require('url').pathToFileURL(require('path').resolve(__dirname, '..', 'index.html')).href;
const OUT = require('path').join(__dirname, 'out'); require('fs').mkdirSync(OUT, {recursive: true});
const { chromium } = require('playwright');
// Taglia ed Estendi nel gruppo Disegno (separato da Note)
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({viewport:{width:1400,height:950}});
  const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  await p.goto(process.argv[2] || APP); await p.evaluate(()=>localStorage.clear()); await p.reload();
  await p.evaluate(()=>{ R = blank(); R.id='te'; tab='pianta'; render(); const pl = piano(); ui.view={x:-4,y:-4,s:55};
    pl.ink = [{id:'terra', lin:true, pts:[[0,0],[8,0]]}, {id:'p1', cs:true, pts:[[1,-2],[1,6]]}, {id:'p7', cs:true, pts:[[7,-2],[7,6]]},
      {id:'gronda', lin:true, pts:[[-1,5],[9,5]]}, {id:'mezzo', lin:true, pts:[[0,3],[8,3]]}, {id:'corta', lin:true, pts:[[3,2],[5,2]]}, {id:'sola', lin:true, pts:[[10,-1],[12,-1]]}];
    update(true); draw(); const t = document.querySelector('#toast'); if (t) t.style.pointerEvents = 'none'; });
  const box = await p.evaluate(()=>{ const r = $('#svg').getBoundingClientRect(); return [r.left, r.top]; });
  const tap = async (x, y) => { const s = await p.evaluate(([x, y])=>[SX(x), SY(y)], [x, y]); await p.mouse.click(box[0] + s[0], box[1] + s[1]); await p.waitForTimeout(60); };
  const out = {};
  out.gruppi = await p.evaluate(()=>({note:[...document.querySelectorAll('[data-g="note"] .tfly [data-mode]')].map(b => b.dataset.mode), disegno:[...document.querySelectorAll('[data-g="disegno"] .tfly .tb')].map(b => b.dataset.mode || 'vedi')}));
  await p.click('[data-fly="disegno"]'); await p.click('[data-mode="taglia"]');
  await tap(0, 5); await tap(8.5, 5);        // gronda: via i pezzi fuori dalle proiezioni
  await tap(1, -1);                          // proiezione sotto la linea di terra
  await tap(4, 3);                           // pezzo centrale: la linea si divide in due
  await tap(11, -1); out.toastSola = await p.evaluate(()=>document.querySelector('#toast').textContent.slice(0, 40));
  await p.click('[data-fly="disegno"]'); await p.click('[data-mode="estendi"]');
  await tap(4.9, 2); await tap(3.1, 2);      // corta: fino alle due proiezioni
  out.linee = await p.evaluate(()=>piano().ink.map(k => k.id.length < 8 ? k.id + ' ' + k.pts.map(q => q.map(v => +v.toFixed(2)).join(',')).join(' > ') : 'nuova ' + k.pts.map(q => q.map(v => +v.toFixed(2)).join(',')).join(' > ')));
  await p.click('#bUndo'); out.annulla = await p.evaluate(()=>piano().ink.find(k => k.id === 'corta').pts.map(q => q.map(v => +v.toFixed(2))));
  await p.screenshot({path:require('path').join(OUT, 'taglia.png')});
  console.log(JSON.stringify(out)); console.log('errors', errs); await b.close();
})();
