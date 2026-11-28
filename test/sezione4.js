// Sezioni 4: scale e ascensore oltre la linea (proiezione) e corpo continuo con solaio e copertura. Base: sezione2.
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
    R.sez = [{id:uid(), a:[-1, 0.5], b:[11, 0.5], v:1}];
    const d = sezioneDati(R.sez[0]), r2 = v => +v.toFixed(2);
    return d.piani.map(q => ({nome:q.nome, zf:r2(q.zf), zc:r2(q.zc), sol:r2(q.sol), gradini:q.prj.filter(x => x.k === 's').length, muri:q.prj.filter(x => x.k === 'w').length, ordine:q.prj.every((x, k) => !k || q.prj[k - 1].di >= x.di - 1e-9)})); });
  console.log('oltre la linea', JSON.stringify(r));
  await p.evaluate(() => { ui.sezK = 0; vai('sez'); }); await p.waitForTimeout(300); await p.screenshot({path:require('path').join(OUT, 'sezione4.png')});
  console.log('errors', errs); await b.close();
})();
