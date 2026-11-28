// Posizione del sopralluogo: punto salvato, via proposta (servizio finto: nessuna richiesta vera), conferma, Google Maps.
const path = require('path'), fs = require('fs');
const APP = require('url').pathToFileURL(path.resolve(__dirname, '..', 'index.html')).href;
const OUT = path.join(__dirname, 'out'); fs.mkdirSync(OUT, {recursive: true});
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(), p = await b.newPage({viewport:{width:1280, height:854}}), errs = [], richieste = [];
  p.on('pageerror', e => errs.push(e.message)); p.on('dialog', d => { if (d.type() !== 'beforeunload') console.log('  finestrella:', d.message()); d.accept(); });
  let servizio = 'ok';
  await p.route('https://nominatim.openstreetmap.org/**', r => { richieste.push(r.request().url()); if (servizio !== 'ok') return r.abort(); return r.fulfill({contentType:'application/json', headers:{'access-control-allow-origin':'*'}, body:JSON.stringify({address:{road:'Via <Prova>', town:'Paese', postcode:'00000'}})}); });
  await p.addInitScript(() => { window.__geo = {acc:12, err:0}; window.__aperti = []; window.open = u => { window.__aperti.push(u); return null; };
    Object.defineProperty(navigator, 'geolocation', {configurable:true, value:{getCurrentPosition(ok, ko) { setTimeout(() => window.__geo.err ? ko({code:window.__geo.err}) : ok({coords:{latitude:42.1234567, longitude:13.7654321, accuracy:window.__geo.acc}}), 50); }}}); });
  await p.goto(process.argv[2] || APP); await p.evaluate(() => localStorage.clear()); await p.reload(); await p.waitForTimeout(300);
  const tocca = async s => { await p.click(s); await p.waitForTimeout(400); };
  const stato = () => p.evaluate(() => `${tab} | indirizzo «${R.indirizzo}» | punto ${R.pos ? R.pos.lat + ',' + R.pos.lon + ' ±' + R.pos.acc : '-'} | riquadro: ${(document.querySelector('.luogo') || {}).innerText?.replace(/\n+/g, ' / ') || '-'}`);
  await tocca('#bNew'); await tocca('button[data-pos]');
  console.log('proposta:', await p.evaluate(() => document.querySelector('#posVia').value), '| fonte:', await p.evaluate(() => document.querySelector('#dScelta a').textContent));
  console.log('prima di confermare:', await stato());
  await p.fill('#posVia', 'Via di Prova 7, 00000 Paese'); await tocca('#dScelta button[data-posok]'); console.log('confermato:', await stato(), '| casella:', await p.inputValue('input[data-s="indirizzo"]'));
  await tocca('#bBack'); console.log('menu, il rilievo resta:', await p.evaluate(() => arcIndex().length + ' ' + arcIndex()[0].indirizzo));
  await tocca('.rcard[data-apri]'); console.log('pagina:', await stato()); await p.screenshot({path:path.join(OUT, 'posizione.png')});
  await tocca('.luogo'); console.log('maps:', await p.evaluate(() => window.__aperti.pop()));
  // senza internet: il punto si salva lo stesso, l'indirizzo non si tocca
  servizio = 'giu'; await p.evaluate(() => { window.__geo.acc = 800; }); await tocca('button[data-pos]');
  console.log('senza rete:', await p.evaluate(() => document.querySelector('#dScelta').innerText.replace(/\n+/g, ' / '))); await tocca('#dScelta button[data-chiudi]'); console.log('  poi:', await stato());
  await tocca('button[data-posvia]'); console.log('tolta:', await stato()); await tocca('.luogo'); console.log('maps con solo indirizzo:', await p.evaluate(() => window.__aperti.pop()));
  await p.evaluate(() => { window.__geo.err = 1; }); await tocca('button[data-pos]'); console.log('permesso negato:', await stato(), '| velo rimasto:', await p.evaluate(() => !!document.querySelector('#lavoro')));
  console.log('richieste al servizio:', richieste.length, richieste[0]);
  console.log('errors', errs); await b.close();
})();
