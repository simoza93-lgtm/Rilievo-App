const APP = require('url').pathToFileURL(require('path').resolve(__dirname, '..', 'index.html')).href;
const OUT = require('path').join(__dirname, 'out'); require('fs').mkdirSync(OUT, {recursive: true});
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({viewport:{width:1400,height:950}});
  const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  await p.goto(process.argv[2] || APP); await p.evaluate(()=>localStorage.clear()); await p.reload();
  const out = [];
  for (const [ox, oy] of [[0.05,-0.05],[0.06,0.05],[-0.05,-0.05],[0.04,0],[0.02,-0.06]]) {
    const r = await p.evaluate(([ox,oy])=>{ R = blank(); R.id='al'+Math.random(); tab='pianta'; render(); const pl = piano(); ui.view={x:-1,y:-1,s:120}; G = geometry(pl);
      const st = (pts, tipo) => { ui.newType = tipo; const sp = []; for (let i = 0; i < pts.length - 1; i++) { const a = pts[i], c = pts[i+1]; for (let k = 0; k < 6; k++) sp.push([SX(a[0] + (c[0]-a[0])*k/6), SY(a[1] + (c[1]-a[1])*k/6)]); } sp.push([SX(pts[pts.length-1][0]), SY(pts[pts.length-1][1])]); finishStroke(sp); };
      st([[0,0],[8,0],[8,5],[0,5],[0,0]], 'P');
      const top = pl.nodes.reduce((m,n)=>Math.max(m,n.y),-9), left = pl.nodes.reduce((m,n)=>Math.min(m,n.x),9);
      st([[3.5, top],[3.5, 2.5]], 'T');                  // verticale dal perimetrale in alto
      const N = pl.nodes.find(n => Math.abs(n.x - 3.5) < 0.3 && n.y < top - 1);
      st([[left, N.y],[N.x, N.y]], 'T');                  // orizzontale da sinistra fino al nodo (angolo a L)
      const N2 = pl.nodes.find(n => Math.abs(n.x - N.x) < 0.01 && Math.abs(n.y - N.y) < 0.01);
      st([[N2.x + ox, N2.y + oy],[N2.x + 3, N2.y + oy]], 'T');   // orizzontale a destra che parte vicino allo spigolo
      const hs = pl.walls.filter(w => w.tipo === "T" && isH(nd(pl,w.a), nd(pl,w.b))).flatMap(w => [+nd(pl,w.a).y.toFixed(3), +nd(pl,w.b).y.toFixed(3)]); const faces = G.walls.flatMap(wl=>wl.pts).filter(q=>q[0]>3.2 && q[0]<4.2 && q[1]>2 && q[1]<3).map(q=>q.map(v=>+v.toFixed(2)));
      const ax = pl.walls.filter(w => w.tipo === "T" && isH(nd(pl,w.a), nd(pl,w.b))).map(w => { const I = G.T.info.get(w.id); return [+(I.a.y + (I.o||0)).toFixed(3), +I.a.x.toFixed(2), +I.b.x.toFixed(2)]; }); return {ax, glue:pl.nodes.filter(n=>n.glue).length, walls:pl.walls.length}; }, [ox, oy]);
    out.push([ox, oy, r]);
  }
  console.log(JSON.stringify(out)); console.log('errors', errs); await b.close();
})();
