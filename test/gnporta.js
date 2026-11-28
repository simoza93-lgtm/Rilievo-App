// Grafica «muri neri»: il vuoto di una porta o di una finestra prende il colore della stanza accanto (prima ci si vedevano i puntini della griglia).
const APP = require('url').pathToFileURL(require('path').resolve(__dirname, '..', 'index.html')).href;
const OUT = require('path').join(__dirname, 'out'); require('fs').mkdirSync(OUT, {recursive: true});
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({viewport:{width:1400,height:950}});
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto(process.argv[2] || APP); await p.evaluate(() => localStorage.clear()); await p.reload();
  const r = await p.evaluate(() => { R = blank(); R.id = 'gp'; tab = 'pianta'; render(); const pl = piano(); ui.view = {x:-2, y:-2, s:80}; G = geometry(pl);
    const st = (pts, tipo) => { ui.newType = tipo; const sp = []; for (let i = 0; i < pts.length - 1; i++) { const a = pts[i], c = pts[i + 1]; for (let k = 0; k < 6; k++) sp.push([SX(a[0] + (c[0] - a[0]) * k / 6), SY(a[1] + (c[1] - a[1]) * k / 6)]); } sp.push([SX(pts[pts.length - 1][0]), SY(pts[pts.length - 1][1])]); finishStroke(sp); };
    st([[0,0],[6,0],[6,4],[0,4],[0,0]], 'P'); st([[3,0],[3,4]], 'T'); ui.mode = 'select';
    const tr = pl.walls.find(w => w.tipo === 'T'); tr.ap = [{id:uid(), tipo:'porta', d:'1,50', l:'0,90', h:'2,10', dav:'0', inv:false, dp:true, lp:true}]; update(true);
    ui.pnew = true; ui.perScheda = false; draw();
    return {stanze:(pl.rooms || []).length, porte:G.ops.length, vuoti:document.querySelectorAll('#svg .gno').length}; });
  await p.waitForTimeout(150);
  await p.screenshot({path:require('path').join(OUT, 'gnporta.png')});
  console.log(JSON.stringify(r)); console.log('errors', errs); await b.close();
})();
