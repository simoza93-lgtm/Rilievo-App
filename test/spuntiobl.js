// Porte e finestre sui muri obliqui: il taglio nel muro non lascia fili sottili lungo le facce (prima restava una riga nera a metà del vano).
const APP = require('url').pathToFileURL(require('path').resolve(__dirname, '..', 'index.html')).href;
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({viewport:{width:1400,height:950}});
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto(process.argv[2] || APP); await p.evaluate(() => localStorage.clear()); await p.reload();
  const r = await p.evaluate(() => { R = blank(); R.id = 'so'; tab = 'pianta'; render(); const pl = piano(); ui.view = {x:-1, y:-1, s:80}; G = geometry(pl);
    const st = (pts, tipo) => { ui.newType = tipo; const sp = []; for (let i = 0; i < pts.length - 1; i++) { const a = pts[i], c = pts[i + 1]; for (let k = 0; k < 8; k++) sp.push([SX(a[0] + (c[0] - a[0]) * k / 8), SY(a[1] + (c[1] - a[1]) * k / 8)]); } sp.push([SX(pts[pts.length - 1][0]), SY(pts[pts.length - 1][1])]); finishStroke(sp); };
    ui.mode = 'select'; st([[0,0],[6,0],[5,4],[0,4],[0,0]], 'P'); update(true);
    const w = pl.walls.find(w => w.obl), out = {};
    // un filo = tre punti di fila che tornano indietro sulla stessa retta
    const fili = () => { let n = 0; G.fpolys.forEach(poly => poly.forEach(r => { for (let i = 1; i < r.length - 1; i++) { const a = r[i - 1], c = r[i], d = r[i + 1], x1 = c[0] - a[0], y1 = c[1] - a[1], x2 = d[0] - c[0], y2 = d[1] - c[1];
      if (Math.abs(x1 * y2 - y1 * x2) < 1e-3 * Math.hypot(x1, y1) * Math.hypot(x2, y2) && x1 * x2 + y1 * y2 < 0) n++; } })); return n; };
    const prove = [['finestra', {}], ['uscita', {}], ['porta', {}], ['porta', {cx:true, vx:true}], ['finestra', {inc:'scal', l2:'1,60', lw:1}], ['finestra', {inc:'strom', l2:'1,60', lw:-1}]];
    prove.forEach(([tipo, x], i) => { w.ap = [Object.assign({id:uid(), tipo, d:'1,50', l:'1,20', h:'1,40', dav:'0,90', inv:false, dp:true, lp:true}, x)]; update(true); out[i + ' ' + tipo + (x.inc || '')] = {aperture:G.ops.length, fili:fili(), errori:G.errs.length}; });
    return out; });
  console.log(JSON.stringify(r, null, 1)); console.log('errors', errs); await b.close();
})();
