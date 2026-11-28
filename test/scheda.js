// Scheda del rilievo, tappa 1: foglio, particella e subalterno nel rilievo; intestazione dello studio nelle Impostazioni.
const APP = require('url').pathToFileURL(require('path').resolve(__dirname, '..', 'index.html')).href;
const OUT = require('path').join(__dirname, 'out'); require('fs').mkdirSync(OUT, {recursive: true});
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({viewport:{width:1400,height:950}});
  const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  await p.goto(APP); await p.evaluate(()=>localStorage.clear()); await p.reload();
  const r1 = await p.evaluate(() => {
    // rilievo vecchio, salvato prima dei campi catastali: le caselle devono restare vuote
    R = blank(); delete R.fg; delete R.pla; delete R.sub; R.id = 'vecchio'; tab = 'imp'; render();
    const v = k => document.querySelector(`[data-s="${k}"]`).value;
    const vecchio = {fg:v('fg'), pla:v('pla'), sub:v('sub')};
    const set = (el, val) => { el.value = val; el.dispatchEvent(new Event('input', {bubbles:true})); };
    set(document.querySelector('[data-s="fg"]'), '12'); set(document.querySelector('[data-s="pla"]'), '345'); set(document.querySelector('[data-s="sub"]'), '2-3');

    tab = 'cfg'; render(); // l'intestazione dello studio sta nell'ingranaggio del menu
    const ta = document.querySelector('[data-pref="studio"]'); const studio0 = ta.value;
    set(ta, 'Studio prova\nvia Roma 1');
    return {vecchio, studio0, campi:{fg:R.fg, pla:R.pla, sub:R.sub}, nuovo:{fg:blank().fg, pla:blank().pla, sub:blank().sub}};
  });
  await p.screenshot({path:require('path').join(OUT, 'scheda1.png')});
  await p.reload();
  const r2 = await p.evaluate(() => { tab = 'cfg'; render(); return document.querySelector('[data-pref="studio"]').value; });
  console.log(JSON.stringify(r1)); console.log('dopo riapertura:', JSON.stringify(r2)); console.log('errors', errs); await b.close();
})();
