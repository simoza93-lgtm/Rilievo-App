// Sezioni 6: la porta di piano dell'ascensore si vede in proiezione se sta sul lato verso la linea di sezione (e non se sta dall'altra parte).
const APP = require('url').pathToFileURL(require('path').resolve(__dirname, '..', 'index.html')).href;
const OUT = require('path').join(__dirname, 'out'); require('fs').mkdirSync(OUT, {recursive: true});
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({viewport:{width:1400, height:950}});
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto(process.argv[2] || APP); await p.evaluate(() => localStorage.clear()); await p.reload();
  const r = await p.evaluate(() => { R = blank(); R.id = 's6'; R.nome = 'Porta ascensore'; tab = 'pianta'; render(); let pl = piano(); ui.view = {x:-1, y:-1, s:60}; G = geometry(pl);
    const st = (pts, tipo) => { ui.newType = tipo; const sp = []; for (let i = 0; i < pts.length - 1; i++) { const a = pts[i], c = pts[i + 1]; for (let k = 0; k < 8; k++) sp.push([SX(a[0] + (c[0] - a[0]) * k / 8), SY(a[1] + (c[1] - a[1]) * k / 8)]); } sp.push([SX(pts[pts.length - 1][0]), SY(pts[pts.length - 1][1])]); finishStroke(sp); };
    ui.mode = 'select'; st([[0,0],[10,0],[10,4],[0,4],[0,0]], 'P'); pl.nome = 'Piano terra'; pl.sol = '0,30'; R.solC = '0,25'; pl.rooms.forEach(q => q.H = '2,70');
    pl.stairs = [{id:uid(), tipo:'lift', x:7, y:1, rot:0, dir:'sale', ax:'1,50', ay:'1,50', as:'0,20', pw:'0,80'}]; update(true);
    R.sez = [{id:uid(), a:[-1, 0.5], b:[11, 0.5], v:1}];
    const conta = () => { const d = sezioneDati(R.sez[0]); return d.piani[0].prj.filter(x => x.k === 'o' && x.tipo === 'porta').map(x => ({larg:+(x.t1 - x.t0).toFixed(2), alta:x.z1 - x.z0})); };
    const out = {porta_verso_la_linea:conta()};
    pl.stairs[0].rot = 180; update(true); out.porta_dall_altra_parte = conta();
    pl.stairs[0].rot = 90; update(true); out.porta_di_lato = conta();
    pl.stairs[0].rot = 0; R.sez[0].a = [-1, 4.5]; R.sez[0].b = [11, 4.5]; update(true); out.linea_dietro_la_porta = conta();
    R.sez[0].v = -1; update(true); out.guardando_dall_alto_porta_nascosta = conta(); pl.stairs[0].rot = 180; update(true); out.guardando_dall_alto_porta_visibile = conta();
    return out; });
  console.log(JSON.stringify(r));
  await p.evaluate(() => { piano().stairs[0].rot = 0; R.sez = [{id:uid(), a:[-1, 0.5], b:[11, 0.5], v:1}]; update(true); ui.sezK = 0; vai('sez'); }); await p.waitForTimeout(300); await p.screenshot({path:require('path').join(OUT, 'sezione6.png')});
  console.log('errors', errs); await b.close();
})();
