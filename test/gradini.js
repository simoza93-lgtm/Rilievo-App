const APP = require('url').pathToFileURL(require('path').resolve(__dirname, '..', 'index.html')).href;
const OUT = require('path').join(__dirname, 'out'); require('fs').mkdirSync(OUT, {recursive: true});
const { chromium } = require('playwright');
// tratto obliquo vicino agli spigoli di un altro muro: l'aggancio agli allineamenti non deve fare gradini (video di Simone, 11/11)
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({viewport:{width:1400,height:950}});
  const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  await p.goto(process.argv[2] || APP); await p.evaluate(()=>localStorage.clear()); await p.reload();
  await p.evaluate(()=>{ R = blank(); R.id='gr'; tab='pianta'; render(); ui.view={x:-1,y:-6,s:50}; ui.mode = 'draw'; ui.newType = 'P'; updTools(); draw(); const t = document.querySelector('#toast'); if (t) t.style.pointerEvents = 'none'; });
  const box = await p.evaluate(()=>{ const r = $('#svg').getBoundingClientRect(); return [r.left, r.top]; });
  const S = (x, y) => p.evaluate(([x, y])=>[SX(x), SY(y)], [x, y]);
  const pen = async (pts, steps = 40) => { let a = await S(...pts[0]); await p.mouse.move(box[0] + a[0], box[1] + a[1]); await p.mouse.down();
    for (let k = 1; k < pts.length; k++) { const c = await S(...pts[k]); for (let i = 1; i <= steps; i++) { const j = (i % 3 - 1) * 0.8;   // un po' di tremolio della mano
      await p.mouse.move(box[0] + a[0] + (c[0] - a[0]) * i / steps + j, box[1] + a[1] + (c[1] - a[1]) * i / steps - j); } a = c; }
    await p.mouse.up(); await p.waitForTimeout(150); };
  // triangolo come nel video
  await pen([[0,0],[6,0],[6,4],[0,0]], 25);
  const n0 = await p.evaluate(()=>piano().walls.length);
  // muro obliquo staccato: parte all'altezza della base (y 0) e finisce all'altezza del vertice (y 4), passando vicino agli allineamenti
  await pen([[7,0.05],[11.5,4.02]], 60);
  const out = await p.evaluate((n0)=>{ const pl = piano(), nw = pl.walls.slice(n0);
    return {nuovi:nw.map(w => (w.obl ? 'OBL ' : 'DRITTO ') + [nd(pl, w.a), nd(pl, w.b)].map(n => n.x.toFixed(2) + ',' + n.y.toFixed(2)).join(' > ')), triangolo:n0}; }, n0);
  await p.click('text=Adatta'); await p.waitForTimeout(150); await p.screenshot({path:OUT + '/gradini.png'});
  console.log(JSON.stringify(out)); console.log('errors', errs); await b.close(); })();
