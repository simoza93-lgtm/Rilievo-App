const APP = require('url').pathToFileURL(require('path').resolve(__dirname, '..', 'index.html')).href;
const OUT = require('path').join(__dirname, 'out'); require('fs').mkdirSync(OUT, {recursive: true});
const { chromium } = require('playwright');
// tramezzo reso da 0,20 col pannello («Altro spessore»): non deve spostarsi né incollarsi al tramezzo dell'ambiente sotto,
// e i perimetrali restano come sono (prima, con la casella dello spessore ancora vuota, gli incroci si univano a qualsiasi distanza)
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({viewport:{width:1400,height:950}});
  const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  await p.goto(process.argv[2] || APP); await p.evaluate(()=>localStorage.clear()); await p.reload();
  const out = {};
  const stato = () => p.evaluate(()=>{ const pl = piano();
    return {nodi:pl.nodes.length, muri:pl.walls.length, ambienti:G.comps.length,
      verticali:pl.walls.filter(w=>w.tipo!=='P' && !isH(nd(pl,w.a),nd(pl,w.b))).map(w=>{ const a=nd(pl,w.a), c=nd(pl,w.b); return [+a.x.toFixed(2), +a.y.toFixed(2), +c.y.toFixed(2), +thick(w).toFixed(2)]; }).sort((x,y)=>x[1]-y[1]),
      perim:pl.walls.filter(w=>w.tipo==='P').map(w=>{ const a=nd(pl,w.a), c=nd(pl,w.b); return [a.x,a.y,c.x,c.y].map(v=>+v.toFixed(2)).join(' '); }).sort()}; });
  for (const dx of [0.5, 0.12]) {
    await p.evaluate((dx)=>{ R = blank(); R.id='sp'; tab='pianta'; render(); const pl = piano(); ui.view={x:-2,y:-2,s:60}; G = geometry(pl);
      const st = (pts, tipo) => { ui.newType = tipo; const sp = []; for (let i = 0; i < pts.length - 1; i++) { const a = pts[i], cc = pts[i+1]; for (let k = 0; k < 6; k++) sp.push([SX(a[0] + (cc[0]-a[0])*k/6), SY(a[1] + (cc[1]-a[1])*k/6)]); } sp.push([SX(pts[pts.length-1][0]), SY(pts[pts.length-1][1])]); finishStroke(sp); };
      st([[0,0],[8,0],[8,8],[0,8],[0,0]],'P'); st([[0,4],[8,4]],'T'); st([[4,8],[4,4]],'T');
      // tramezzo dell'ambiente sotto: si mette a dx dall'altro senza passare dall'aggancio della penna
      const n1 = getNode(pl, 4 + dx, 4), n2 = getNode(pl, 4 + dx, 0); addSegment(pl, n1, n2, 'T'); update(true);
      const w = pl.walls.find(w=>w.tipo==='T' && !isH(nd(pl,w.a),nd(pl,w.b)) && Math.max(nd(pl,w.a).y,nd(pl,w.b).y) > 6); ui.sel = {k:'w', id:w.id}; draw(); renderSide(); }, dx);
    const k = 'sfalsato' + Math.round(dx * 100);
    out[k] = {prima: await stato()};
    await p.selectOption('select[data-w="tipo"]', 'X'); await p.waitForTimeout(100);
    out[k].casella = await p.inputValue('input[data-w="sp"]');
    out[k].altroSpessore = await stato();
    await p.fill('input[data-w="sp"]', ''); await p.type('input[data-w="sp"]', '0,20'); await p.waitForTimeout(100);
    out[k].dopo = await stato();
    out[k].perimUguali = JSON.stringify(out[k].dopo.perim) === JSON.stringify(out[k].prima.perim);
    out[k].tipo = await p.evaluate(()=>tipoNome(piano().walls.find(w=>w.tipo==='X')));
  }
  await p.click('text=Adatta'); await p.waitForTimeout(200); await p.screenshot({path:require('path').join(OUT, 'spessore.png')});
  console.log(JSON.stringify(out)); console.log('errors', errs); await b.close();
})();
