// Sposta piani: dai tre puntini della scheda Piante, un posto in alto o in basso; il piano aperto resta quello e la sezione segue il nuovo ordine.
const APP = require('url').pathToFileURL(require('path').resolve(__dirname, '..', 'index.html')).href;
const OUT = require('path').join(__dirname, 'out'); require('fs').mkdirSync(OUT, {recursive: true});
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({viewport:{width:1400, height:950}});
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto(process.argv[2] || APP); await p.evaluate(() => localStorage.clear()); await p.reload();
  await p.evaluate(() => { R = blank(); R.id = 'sp'; R.nome = 'Sposta piani'; tab = 'pianta'; render(); ui.view = {x:-1, y:-1, s:60}; G = geometry(piano());
    const st = (pts, tipo) => { ui.newType = tipo; const sp = []; for (let i = 0; i < pts.length - 1; i++) { const a = pts[i], c = pts[i + 1]; for (let k = 0; k < 8; k++) sp.push([SX(a[0] + (c[0] - a[0]) * k / 8), SY(a[1] + (c[1] - a[1]) * k / 8)]); } sp.push([SX(pts[pts.length - 1][0]), SY(pts[pts.length - 1][1])]); finishStroke(sp); };
    ui.mode = 'select'; st([[0,0],[6,0],[6,4],[0,4],[0,0]], 'P'); piano().nome = 'Piano terra'; update(true);
    ['Piano seminterrato', 'Piano primo'].forEach((n, i) => { const c = JSON.parse(JSON.stringify(piano())); c.id = uid(); c.nome = n; c.sol = i ? '0,25' : '0,40'; R.piani.push(c); }); R.cur = 0; R.sez = [{id:uid(), a:[-1, 2], b:[7, 2], v:1}]; update(true); vai('prj'); });
  await p.waitForTimeout(300);
  const nomi = () => p.evaluate(() => ({ordine:R.piani.map(x => x.nome), aperto:piano().nome, sezione:sezioneDati(R.sez[0]).piani.map(x => x.nome + ' ' + x.zf.toFixed(2)), zero:+sezioneDati(R.sez[0]).zero.toFixed(2)}));
  console.log('prima', JSON.stringify(await nomi()));
  await p.click('[data-ppunti="1"]'); await p.waitForTimeout(200);
  console.log('voci del menu', JSON.stringify(await p.evaluate(() => [...document.querySelectorAll('#dPiani .pmenu button')].map(x => x.textContent))));
  await p.click('[data-pmuovi="1:-1"]'); await p.waitForTimeout(200);
  console.log('seminterrato sotto', JSON.stringify(await nomi()));
  await p.evaluate(() => { document.querySelector('#dPiani').close(); ui.sezK = 0; vai('sez'); }); await p.waitForTimeout(200);
  console.log('quote di livello', JSON.stringify(await p.evaluate(() => [...document.querySelectorAll('#sezsvg text')].map(x => x.textContent).filter(x => /[±+−]/.test(x)))));
  await p.evaluate(() => { vai('prj'); }); await p.waitForTimeout(200); await p.click('[data-ppunti="0"]'); await p.waitForTimeout(200);
  console.log('menu aperto sul piano spostato', JSON.stringify(await p.evaluate(() => [...document.querySelectorAll('#dPiani .pmenu button')].map(x => x.textContent))));
  await p.screenshot({path:require('path').join(OUT, 'spostapiani.png')});
  await p.click('[data-pmuovi="0:1"]'); await p.waitForTimeout(150);
  console.log('di nuovo su', JSON.stringify(await nomi()));
  await p.keyboard.press('Escape'); console.log('piani nel rilievo', await p.evaluate(() => [...document.querySelectorAll('.pnome')].map(x => x.textContent).join(' | ')));
  console.log('errors', errs); await b.close();
})();
