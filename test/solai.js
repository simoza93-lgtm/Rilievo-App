// Sezione, tappa 1: solaio di calpestio per ogni piano (Impostazioni) e altezza per tutti i tipi di vano.
const APP = require('url').pathToFileURL(require('path').resolve(__dirname, '..', 'index.html')).href;
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({viewport:{width:1400,height:950}});
  const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  await p.goto(APP); await p.evaluate(()=>localStorage.clear()); await p.reload();
  const r1 = await p.evaluate(() => {
    // rilievo vecchio, due piani senza solaio: le caselle devono restare vuote
    R = blank(); R.id = 'sol'; R.piani.push({id:'p2', nome:'Piano primo', ver:0, nodes:[], walls:[], rooms:[]}); tab = 'imp'; render();
    const box = [...document.querySelectorAll('[data-sol]')];
    const vuote = box.map(x => x.previousElementSibling.textContent + ' = "' + x.value + '"');
    box[1].value = '0,30'; box[1].dispatchEvent(new Event('input', {bubbles:true}));
    const alt = Object.keys(TIPI_AP).map(k => k + ': ' + apFields({id:'a1', tipo:k}).includes('data-w="ap.a1.h"'));
    return {vuote, sol:R.piani.map(x => x.sol), alt};
  });
  await p.reload();
  const r2 = await p.evaluate(() => { tab = 'imp'; render(); return [...document.querySelectorAll('[data-sol]')].map(x => x.value); });
  console.log(JSON.stringify(r1)); console.log('dopo riapertura:', JSON.stringify(r2)); console.log('errors', errs); await b.close();
})();
