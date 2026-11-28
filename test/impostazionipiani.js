// Altezze e solai di ogni piano nella pagina del rilievo (non più nei dati del rilievo): l'altezza vale per tutti gli ambienti del piano, anche nuovi; la sezione la segue.
const APP = require('url').pathToFileURL(require('path').resolve(__dirname, '..', 'index.html')).href;
const OUT = require('path').join(__dirname, 'out'); require('fs').mkdirSync(OUT, {recursive: true});
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({viewport:{width:1400, height:950}});
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto(process.argv[2] || APP); await p.evaluate(() => localStorage.clear()); await p.reload();
  await p.evaluate(() => { R = blank(); R.id = 'ip'; R.nome = 'Impostazioni piani'; tab = 'pianta'; render(); ui.view = {x:-1, y:-1, s:60}; G = geometry(piano());
    const st = (pts, tipo) => { ui.newType = tipo; const sp = []; for (let i = 0; i < pts.length - 1; i++) { const a = pts[i], c = pts[i + 1]; for (let k = 0; k < 8; k++) sp.push([SX(a[0] + (c[0] - a[0]) * k / 8), SY(a[1] + (c[1] - a[1]) * k / 8)]); } sp.push([SX(pts[pts.length - 1][0]), SY(pts[pts.length - 1][1])]); finishStroke(sp); };
    ui.mode = 'select'; st([[0,0],[8,0],[8,4],[0,4],[0,0]], 'P'); st([[3,0],[3,4]], 'T'); piano().nome = 'Piano terra'; update(true);
    const c = JSON.parse(JSON.stringify(piano())); c.id = uid(); c.nome = 'Piano primo'; R.piani.push(c); piano().rooms[0].H = '2,40'; R.cur = 0; R.sez = [{id:uid(), a:[-1, 2], b:[9, 2], v:1}]; update(true); vai('prj'); });
  await p.waitForTimeout(300);
  console.log('scheda nel rilievo', JSON.stringify(await p.evaluate(() => ({titoli:[...document.querySelectorAll('.cardh')].map(x => x.textContent.trim().slice(0, 24)), campi:[...document.querySelectorAll('[data-ph],[data-sol],[data-solc]')].map(x => (x.dataset.ph ? 'h:' : x.dataset.sol ? 'sol:' : 'cop:') + x.value + '/' + x.placeholder)}))));
  const f = await p.$$('[data-ph]'); await f[0].fill('2,70'); await f[1].fill('2,60');
  const s = await p.$$('[data-sol]'); await s[0].fill('0,30'); await s[1].fill('0,25'); await p.fill('[data-solc]', '0,20');
  console.log('dopo', JSON.stringify(await p.evaluate(() => ({H:R.piani.map(x => [x.H, x.rooms.map(r => r.H)]), sol:R.piani.map(x => x.sol), cop:R.solC, sezione:(d => ({zf:d.piani.map(x => +x.zf.toFixed(2)), zc:d.piani.map(x => +x.zc.toFixed(2)), cop:+d.cop.sol.toFixed(2)}))(sezioneDati(R.sez[0]))}))));
  // i dati del rilievo non hanno più la scheda Solai
  await p.evaluate(() => { vai('set'); }); await p.waitForTimeout(200);
  console.log('dati del rilievo senza Solai', await p.evaluate(() => !document.body.textContent.includes('Copertura: solaio') && ![...document.querySelectorAll('.cardh')].some(x => /^Solai/.test(x.textContent.trim()))));
  await p.evaluate(() => { vai('prj'); }); await p.waitForTimeout(200); await p.screenshot({path:require('path').join(OUT, 'impostazionipiani.png')});
  console.log('errors', errs); await b.close();
})();
