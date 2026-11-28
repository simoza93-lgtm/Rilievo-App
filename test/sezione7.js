// Sezioni 7: tutti i tipi di apertura, nel taglio e in proiezione (quota da terra, altezza, larghezza).
const APP = require('url').pathToFileURL(require('path').resolve(__dirname, '..', 'index.html')).href;
const OUT = require('path').join(__dirname, 'out'); require('fs').mkdirSync(OUT, {recursive: true});
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({viewport:{width:1400, height:950}});
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto(process.argv[2] || APP); await p.evaluate(() => localStorage.clear()); await p.reload();
  const r = await p.evaluate(() => { R = blank(); R.id = 's7'; R.nome = 'Aperture'; tab = 'pianta'; render(); let pl = piano(); ui.view = {x:-1, y:-1, s:60}; G = geometry(pl);
    const st = (pts, tipo) => { ui.newType = tipo; const sp = []; for (let i = 0; i < pts.length - 1; i++) { const a = pts[i], c = pts[i + 1]; for (let k = 0; k < 8; k++) sp.push([SX(a[0] + (c[0] - a[0]) * k / 8), SY(a[1] + (c[1] - a[1]) * k / 8)]); } sp.push([SX(pts[pts.length - 1][0]), SY(pts[pts.length - 1][1])]); finishStroke(sp); };
    ui.mode = 'select'; st([[0,0],[14,0],[14,4],[0,4],[0,0]], 'P'); pl.nome = 'Piano terra'; pl.sol = '0,30'; R.solC = '0,25'; pl.rooms.forEach(q => q.H = '2,70'); update(true);
    const K = [['porta',''], ['porta','2a'], ['porta','sce'], ['porta','strom'], ['ingresso',''], ['varco',''], ['finestra',''], ['uscita',''], ['finestra','scal'], ['finestra','strom']];
    const pe = pl.walls.find(w => w.tipo === 'P' && isH(nd(pl, w.a), nd(pl, w.b)) && nd(pl, w.a).y > 3);
    pe.ap = K.map((k, i) => { const B = AP_KIND[k[0] === 'finestra' && k[1] ? (k[1] === 'scal' ? 'incassata' : 'strombata') : k[0] === 'porta' && k[1] === 'strom' ? 'porta:strom' : k[0] === 'porta' && k[1] ? 'porta:' + k[1] : k[0]];
      return Object.assign({id:uid(), tipo:B.tipo, d:f2(0.35 + i * 1.3).replace('.', ','), l:B.l, h:B.h || (B.tipo === 'porta' ? '2,10' : ''), dav:B.dav || '0', inv:false}, B.pt ? {pt:B.pt} : {}, B.inc ? {inc:B.inc} : {}); });
    update(true); const r2 = v => +v.toFixed(2), out = {n:pe.ap.length, ops:G.ops.length};
    const prj = sezioneDati({id:uid(), a:[-1, 2], b:[15, 2], v:1}).piani[0].prj.filter(x => x.k === 'o').map(x => [x.tipo, r2(x.t0), r2(x.t1), r2(x.z0), r2(x.z1)]);
    out.proiezione = prj;
    out.taglio = pe.ap.map((a, i) => { const o = G.ops.find(q => q.ap === a), x = (o.c[0] + o.c[2]) / 2, d = sezioneDati({id:uid(), a:[x, -1], b:[x, 5], v:1}), q = d.piani[0]; return [a.tipo + (a.pt || a.inc || ''), q.aps.map(y => [y.tipo, r2(y.z0), r2(y.z1)])]; });
    out.linee_infisso_nel_taglio = pe.ap.map(a => { const o = G.ops.find(q => q.ap === a), x = (o.c[0] + o.c[2]) / 2; return [a.tipo, (sezioneSvg(sezioneDati({id:uid(), a:[x, -1], b:[x, 5], v:1})).match(/stroke-width="1\.2"/g) || []).length]; });
    return out; });
  console.log(JSON.stringify(r, null, 0));
  await p.evaluate(() => { R.sez = [{id:uid(), a:[-1, 2], b:[15, 2], v:1}]; update(true); ui.sezK = 0; vai('sez'); }); await p.waitForTimeout(300); await p.screenshot({path:require('path').join(OUT, 'sezione7.png')});
  console.log('errors', errs); await b.close();
})();
