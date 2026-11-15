const APP = require('url').pathToFileURL(require('path').resolve(__dirname, '..', 'index.html')).href;
const OUT = require('path').join(__dirname, 'out'); require('fs').mkdirSync(OUT, {recursive: true});
const { chromium } = require('playwright');
// Parallela a distanza: dalla linea di terra le quote dei piani (3,10 e 6,20 sopra), da una proiezione una costruzione a 1,00 di lato
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({viewport:{width:1400,height:950}});
  const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  await p.goto(process.argv[2] || APP); await p.evaluate(()=>localStorage.clear()); await p.reload();
  await p.evaluate(()=>{ R = blank(); R.id='par'; tab='pianta'; render(); const pl = piano(); ui.view={x:-5,y:-6,s:50};
    pl.ink = [{id:'terra', lin:true, pts:[[0,-4],[8,-4]]}, {id:'pr', cs:true, pts:[[0,0],[0,-6]]}]; update(true); draw();
    const t = document.querySelector('#toast'); if (t) t.style.pointerEvents = 'none'; });
  const box = await p.evaluate(()=>{ const r = $('#svg').getBoundingClientRect(); return [r.left, r.top]; });
  const tap = async (x, y) => { const s = await p.evaluate(([x, y])=>[SX(x), SY(y)], [x, y]); await p.mouse.click(box[0] + s[0], box[1] + s[1]); await p.waitForTimeout(60); };
  const keys = async ks => { for (const k of ks) await p.click(`#inl [data-k="${k}"]`); await p.click('#inl [data-k="ok"]'); await p.waitForTimeout(60); };
  const out = {};
  await p.click('[data-fly="disegno"]'); await p.click('[data-mode="paral"]');
  await tap(5, -4.02);                 // la linea di terra
  out.origine = await p.evaluate(()=>ui.parSrc);
  await tap(5, -3); await keys(['3', ',', '1']);       // sopra: 3,10
  await tap(5, -3); await keys(['6', ',', '2']);       // ancora dalla linea di terra: 6,20
  await tap(0.01, -5);                 // la proiezione (costruzione)
  await tap(-1, -5); await keys(['1']);                // a sinistra: 1,00
  out.linee = await p.evaluate(()=>piano().ink.map(k => ({id:k.par ? 'par' : k.id, t:k.cs ? 'cs' : 'lin', pts:k.pts.map(q => q.map(v => +v.toFixed(3)))})));
  // annulla l'ultima
  await p.click('#bUndo'); out.dopoAnnulla = await p.evaluate(()=>piano().ink.length);
  await p.screenshot({path:require('path').join(OUT, 'paral.png')});
  console.log(JSON.stringify(out)); console.log('errors', errs); await b.close();
})();
