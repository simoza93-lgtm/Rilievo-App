const APP = require('url').pathToFileURL(require('path').resolve(__dirname, '..', 'index.html')).href;
const OUT = require('path').join(__dirname, 'out'); require('fs').mkdirSync(OUT, {recursive: true});
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({viewport:{width:1400,height:950}});
  const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  await p.goto(APP); await p.evaluate(()=>localStorage.clear()); await p.reload();
  const res = await p.evaluate(()=>{ const bad = []; let tot = 0;
    const offs = [-0.12,-0.06,-0.03,0,0.03,0.06,0.12];
    // muro 1: da A a E (E estremità libera); muro 2: parte (o arriva) vicino a E in direzione perpendicolare
    const confs = [];
    for (const [A, E] of [[[2,4],[2,1]], [[2,1],[2,4]], [[1,2],[4,2]], [[4,2],[1,2]]]) for (const dir of [1,-1]) for (const t1 of ['T','P']) for (const t2 of ['T','P']) for (const rev of [false,true]) confs.push({A,E,dir,t1,t2,rev});
    for (const c of confs) for (const ox of offs) for (const oy of offs) {
      R = blank(); R.id='x'; tab='pianta'; render(); const pl = piano(); ui.view = {x:-1, y:-1, s:60}; G = geometry(pl);
      const st = (a, z, tipo) => { ui.newType = tipo; finishStroke([[SX(a[0]),SY(a[1])],[SX((a[0]+z[0])/2),SY((a[1]+z[1])/2)],[SX(z[0]),SY(z[1])]]); };
      st(c.A, c.E, c.t1);
      const V = c.A[0] === c.E[0], ns = pl.nodes.slice().sort((u,v)=> V ? (u.y-v.y) : (u.x-v.x)), Ep = (V ? c.E[1] < c.A[1] : c.E[0] < c.A[0]) ? ns[0] : ns[1], E = [Ep.x, Ep.y];
      const s0 = [E[0]+ox, E[1]+oy], far = V ? [E[0] + c.dir*3, s0[1]] : [s0[0], E[1] + c.dir*3];
      if (c.rev) st(far, s0, c.t2); else st(s0, far, c.t2);
      tot++;
      const near = pl.nodes;
      const tiny = pl.walls.filter(w=>{const a=nd(pl,w.a),z=nd(pl,w.b);return Math.hypot(a.x-z.x,a.y-z.y)<0.5;}).length;
      if (pl.walls.length !== 2 || tiny || near.length !== 3) bad.push({c:[c.A,c.E,c.dir,c.t1,c.t2,c.rev], ox, oy, walls:pl.walls.map(w=>{const a=nd(pl,w.a),z=nd(pl,w.b);return [w.tipo,a.x,a.y,z.x,z.y];}), near:near.length, glue:pl.nodes.filter(n=>n.glue).length});
    }
    return {tot, nbad:bad.length, bad:bad.slice(0,12)}; });
  console.log(JSON.stringify(res)); console.log('errors', errs); await b.close();
})();
