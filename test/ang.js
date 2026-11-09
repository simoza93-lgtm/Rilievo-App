const APP = require('url').pathToFileURL(require('path').resolve(__dirname, '..', 'index.html')).href;
const OUT = require('path').join(__dirname, 'out'); require('fs').mkdirSync(OUT, {recursive: true});
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({viewport:{width:1400,height:950}});
  const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  await p.goto((process.argv[2] || APP)); await p.evaluate(()=>localStorage.clear()); await p.reload();
  const cases = [[2,1],[2.05,1],[1.95,1],[2.05,0.95],[1.95,1.05],[2.08,0.97],[2,0.93],[2.1,1.0],[1.97,0.98]];
  for (const [tipo1, tipo2] of [['T','T'],['P','P']]) for (const [sx, sy] of cases) {
    const r = await p.evaluate(([sx, sy, t1, t2])=>{ R = blank(); R.id='a'+Math.random(); tab='pianta'; render(); const pl = piano();
      const pts=[[0,0],[6,0],[6,5],[0,5],[0,0]]; ui.newType='P'; for(let i=0;i<pts.length-1;i++) addSegment(pl,{x:pts[i][0],y:pts[i][1]},{x:pts[i+1][0],y:pts[i+1][1]},'P'); update(true);
      ui.view = {x:-1, y:-1, s:60}; draw();
      const st = (a, c, tipo) => { ui.newType = tipo; finishStroke([[SX(a[0]),SY(a[1])],[SX((a[0]+c[0])/2),SY((a[1]+c[1])/2)],[SX(c[0]),SY(c[1])]]); };
      st([2,5],[2,1], t1);            // verticale dal muro in alto, finisce a (2,1)
      st([sx,sy],[5,sy], t2);        // orizzontale che parte vicino all'estremo
      return {walls:pl.walls.length, nodes:pl.nodes.map(n=>[+n.x.toFixed(3),+n.y.toFixed(3), n.glue?'g':'']).filter(n=>n[1]<2), tiny:pl.walls.filter(w=>{const a=nd(pl,w.a),c=nd(pl,w.b);return Math.hypot(a.x-c.x,a.y-c.y)<0.4;}).length, fills:G.fills.length, comps:G.comps.length};
    }, [sx, sy, tipo1, tipo2]);
    console.log(tipo1, sx, sy, JSON.stringify(r));
  }
  console.log('errors', errs); await b.close();
})();
