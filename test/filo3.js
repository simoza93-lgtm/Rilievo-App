const APP = require('url').pathToFileURL(require('path').resolve(__dirname, '..', 'index.html')).href;
const OUT = require('path').join(__dirname, 'out'); require('fs').mkdirSync(OUT, {recursive: true});
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({viewport:{width:1400,height:950}});
  const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  await p.goto(process.argv[2] || APP); await p.evaluate(()=>localStorage.clear()); await p.reload();
  const r = await p.evaluate(()=>{ R = blank(); R.id='f3'; tab='pianta'; render(); const pl = piano(); ui.view={x:-3,y:-6,s:60}; G = geometry(pl);
    const st = (pts, tipo) => { ui.newType = tipo; const sp = []; for (let i = 0; i < pts.length - 1; i++) { const a = pts[i], c = pts[i+1]; for (let k = 0; k < 6; k++) sp.push([SX(a[0] + (c[0]-a[0])*k/6), SY(a[1] + (c[1]-a[1])*k/6)]); } sp.push([SX(pts[pts.length-1][0]), SY(pts[pts.length-1][1])]); finishStroke(sp); };
    st([[0,0],[6,0],[6,-4],[0,-4],[0,0]], 'P');
    const B = pl.nodes.find(n => n.x < 1 && n.y > -1);
    st([[B.x,B.y],[B.x,B.y+2.5],[B.x+3,B.y+2.5]], 'T');    // parapetto a filo (automatico)
    const par = pl.walls.find(w => w.tipo === 'T' && !isH(nd(pl,w.a),nd(pl,w.b)));
    const before = {filo:par.filo, o:G.T.info.get(par.id).o};
    // tutti i perimetrali diventano tramezzi (come con «Tipo dei muri selezionati»)
    pl.walls.forEach(w => { w.tipo = 'T'; }); update(true);
    const par2 = pl.walls.find(w => w.filo); const o2 = par2 ? G.T.info.get(par2.id).o : null;
    return {before, after:{filo:par2 && par2.filo, o:o2}}; });
  console.log(JSON.stringify(r)); console.log('errors', errs); await b.close();
})();
