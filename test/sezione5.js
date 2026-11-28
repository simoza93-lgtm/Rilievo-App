// Sezioni 5: script AutoCAD della sezione e pagine nella scheda. Base: sezione2.
// Sezioni, scale e ascensore: la scala tagliata lungo la rampa fa il profilo a gradini, di traverso un gradino; il vano scala apre il solaio; l'ascensore ha pareti e vuoto.
const APP = require('url').pathToFileURL(require('path').resolve(__dirname, '..', 'index.html')).href;
const OUT = require('path').join(__dirname, 'out'); require('fs').mkdirSync(OUT, {recursive: true});
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({viewport:{width:1400, height:950}});
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto(process.argv[2] || APP); await p.evaluate(() => localStorage.clear()); await p.reload();
  const r = await p.evaluate(() => { R = blank(); R.id = 's2'; R.nome = 'Scale e ascensore'; tab = 'pianta'; render(); let pl = piano(); ui.view = {x:-1, y:-1, s:60}; G = geometry(pl);
    const st = (pts, tipo) => { ui.newType = tipo; const sp = []; for (let i = 0; i < pts.length - 1; i++) { const a = pts[i], c = pts[i + 1]; for (let k = 0; k < 8; k++) sp.push([SX(a[0] + (c[0] - a[0]) * k / 8), SY(a[1] + (c[1] - a[1]) * k / 8)]); } sp.push([SX(pts[pts.length - 1][0]), SY(pts[pts.length - 1][1])]); finishStroke(sp); };
    ui.mode = 'select'; st([[0,0],[10,0],[10,4],[0,4],[0,0]], 'P'); pl.nome = 'Piano terra'; pl.sol = '0,30'; R.solC = '0,25';
    const sc = (extra) => Object.assign({id:uid(), tipo:'dritta', n:16, a:'0,18', b:'0,90', p:'0,27'}, extra);
    pl.stairs = [sc({x:1, y:1, rot:90, dir:'sale'}), sc({x:1, y:2.5, rot:0, dir:'sale', n:12, id:uid()}), {id:uid(), tipo:'lift', x:7, y:1, rot:0, dir:'sale', ax:'1,50', ay:'1,50', as:'0,20', pw:'0,80'}]; update(true);
    const up = JSON.parse(JSON.stringify(pl)); up.id = uid(); up.nome = 'Piano primo'; up.sol = '0,25'; up.stairs[0].dir = 'scende'; up.stairs[1].dir = 'scende'; up.rooms.forEach(r => r.H = '2,70'); R.piani.push(up); R.cur = 0; update(true);
    R.sez = [{id:uid(), a:[-1, 0.5], b:[11, 0.5], v:1}, {id:uid(), a:[7.8, -1], b:[7.8, 5], v:1}];
    pl.rooms.forEach(r => r.H = '2,70'); update(true); return R.piani.length; });
  console.log('piani', r);
  const x = await p.evaluate(async () => { const out = {};
    R.sez.forEach((q, i) => { const d = sezDati(i), t = genScriptSez(d, d.nome), L = t.split('\r\n'); out['s' + i] = {righe:L.length > 80, solid:L.filter(l => l === '_.SOLID').length > 5, line:L.filter(l => l === '_.LINE').length > 5, dim:L.filter(l => l === '_.DIMLINEAR').length, nan:/NaN|undefined|Infinity/.test(t), testi:L.filter(l => l === '_.TEXT').length > 3, chiusura:L[L.length - 2] === 'EXPERT' || /OSMODE/.test(t)}; });
    const h = await schedaHTML(); out.scheda = {pagine:(h.match(/<h2>Sezione /g) || []).length, svg:/<svg width=/.test(h), titolo:/Sezione A–A/.test(h)};
    const e = document.createElement('div'); e.id = 'scheda'; e.innerHTML = h; document.body.appendChild(e); return out; });
  console.log(JSON.stringify(x));
  require('fs').writeFileSync(require('path').join(OUT, 'sezione5.scr'), await p.evaluate(() => genScriptSez(sezDati(0), sezDati(0).nome)));
  await p.emulateMedia({media:'print'}); await p.waitForTimeout(300); const pg = await p.$$('#scheda .spg'); if (pg.length) await pg[pg.length - 1].screenshot({path:require('path').join(OUT, 'sezione5-scheda.png')});
  console.log('errors', errs); await b.close();
})();
