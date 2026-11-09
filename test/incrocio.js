const APP = require('url').pathToFileURL(require('path').resolve(__dirname, '..', 'index.html')).href;
const OUT = require('path').join(__dirname, 'out'); require('fs').mkdirSync(OUT, {recursive: true});
const { chromium } = require('playwright');
// tramezzo che parte vicino a un incrocio (perimetrale ad angolo + tramezzo in linea): deve attaccarsi al nodo dell'incrocio.
// Prima poteva restare «a filo con lo spigolo» con l'estremità libera: il lato a sinistra della stanza saltava il tramezzo
// e la misura in alto partiva 10 cm dentro il muro.
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({viewport:{width:1400,height:950}, colorScheme:'dark'});
  const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  await p.goto(process.argv[2] || APP); await p.evaluate(()=>localStorage.clear()); await p.reload();
  const r = await p.evaluate(()=>{
    const build = (c, s) => { R = blank(); R.id='inc'; tab='pianta'; render(); const pl = piano(); ui.view={x:-6,y:-9,s}; G = geometry(pl);
      const off = () => { const ns = pl.walls.filter(w=>w.tipo==='P').flatMap(w=>[nd(pl,w.a),nd(pl,w.b)]); if (!ns.length) return [0,0]; return [Math.min(...ns.map(n=>n.x))+4, Math.max(...ns.map(n=>n.y))-6]; };
      const st = (pts0, tipo) => { const O = off(); const pts = pts0.map(q=>[q[0]+O[0], q[1]+O[1]]); ui.newType = tipo; const sp = []; for (let i = 0; i < pts.length - 1; i++) { const a = pts[i], cc = pts[i+1]; for (let k = 0; k < 6; k++) sp.push([SX(a[0] + (cc[0]-a[0])*k/6), SY(a[1] + (cc[1]-a[1])*k/6)]); } sp.push([SX(pts[pts.length-1][0]), SY(pts[pts.length-1][1])]); finishStroke(sp); };
      st([[-4,6],[-4,0],[0,0],[0,-6],[5.6,-6],[5.6,-5],[6.6,-5],[6.6,-3],[9,-3],[9,6],[-4,6]], 'P');
      const hz = c.dir ? [[4.1,0],[c.ex,c.ey]] : [[c.ex,c.ey],[4.1,0]];
      if (c.order===0) { st([[0,6],[0,0]],'T'); st(hz,'T'); } else { st(hz,'T'); st([[0,6],[0,0]],'T'); }
      st([[4.1,6],[4.1,-6]],'T'); update(true); return pl; };
    const look = pl => { const ns = pl.walls.filter(w=>w.tipo==='P').flatMap(w=>[nd(pl,w.a),nd(pl,w.b)]); const cx = Math.min(...ns.map(n=>n.x))+4, cy = Math.max(...ns.map(n=>n.y))-6;
      const lr = G.runs.find(r=>!r.ext && !r.H && r.sg>0 && Math.abs(r.P.x-cx)<0.2 && r.P.y < cy-5);
      const tr = G.runs.find(r=>!r.ext && r.H && r.sg<0 && Math.abs(r.P.y-cy)<0.25 && r.Q.x>cx+3 && r.P.x < cx+1);
      return {cx, cy, lr, tr, left:+(lr.Q.y-cy).toFixed(2), top:+(tr.P.x+tr.eA-cx).toFixed(2)}; };
    const bad = []; let n = 0;
    for (const s of [60, 150]) for (const order of [0,1]) for (const ex of [0.3,0.2,0.12,0.05,0,-0.05,-0.12,-0.25]) for (const ey of [0.1,0,-0.1]) for (const dir of [0,1]) {
      const pl = build({order,ex,ey,dir}, s), L = look(pl); n++;
      if (Math.abs(L.left) > 0.01 || Math.abs(L.top - 0.15) > 0.01 || pl.nodes.some(q => q.glue)) bad.push([s,order,ex,ey,dir,L.left,L.top]); }
    // rilievo vecchio con il difetto: estremità libera incollata a 5 cm e 10 cm dal nodo, misure 4,00 sopra e 6,00 a destra
    const pl = build({order:0,ex:0,ey:0,dir:0}, 60); const L0 = look(pl);
    const hw = pl.walls.find(w => w.tipo==='T' && isH(nd(pl,w.a),nd(pl,w.b)) && Math.abs(nd(pl,w.a).x - L0.cx) < 0.01);
    const rr = G.runs.find(r=>!r.ext && !r.H && r.sg<0 && Math.abs(r.P.x-L0.cx-4.1)<0.2 && r.P.y < L0.cy-5);
    const h = nd(pl, hw.a), far = nd(pl, hw.b), q = {id:uid(), x:r4(h.x + 0.05), y:r4(h.y + 0.10), glue:{n:h.id, dx:0.05, dy:0.10}}; pl.nodes.push(q); hw.a = q.id; far.y = r4(h.y + 0.10);
    const kTop = '-:' + q.id + ':' + far.id; pl.fm[kTop] = '4.00'; pl.fm[rr.key] = '6.00'; pl.mord = [kTop, rr.key];
    update(true); const L2 = look(pl);
    const bot = G.runs.find(r=>!r.ext && r.H && r.sg>0 && Math.abs(r.P.x-L2.cx)<0.2 && r.P.y < L2.cy-5);
    return {casi:n, sbagliati:bad, vecchio:{glue:pl.nodes.filter(x=>x.glue).length, left:L2.left, top:L2.top, misSopra:L2.tr.mis, sotto:+bot.face.toFixed(2), err:G.errs.length}};
  });
  await p.click('text=Adatta'); await p.waitForTimeout(200); await p.screenshot({path:require('path').join(OUT, 'incrocio.png')});
  console.log(JSON.stringify(r)); console.log('errors', errs); await b.close();
})();
