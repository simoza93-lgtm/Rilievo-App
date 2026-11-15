const APP = require('url').pathToFileURL(require('path').resolve(__dirname, '..', 'index.html')).href;
const { chromium } = require('playwright');
// obliqui tappa 4: nello script le facce dei muri obliqui escono come quote allineate (_.DIMALIGNED) a 0,40 dentro la stanza:
// tutta la faccia se il muro non ha vani, i tratti tra spigoli e vani se li ha; i lati senza misura non si quotano (e si contano)
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({viewport:{width:1400,height:950}});
  const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  await p.goto(process.argv[2] || APP); await p.evaluate(()=>localStorage.clear()); await p.reload();
  const prep = `R = blank(); R.id='so'; tab='pianta'; render(); var pl = piano(); ui.view={x:-1,y:-1,s:80}; G = geometry(pl);
    var st = (pts, tipo) => { ui.newType = tipo; const sp = []; for (let i = 0; i < pts.length - 1; i++) { const a = pts[i], c = pts[i+1]; for (let k = 0; k < 8; k++) sp.push([SX(a[0] + (c[0]-a[0])*k/8), SY(a[1] + (c[1]-a[1])*k/8)]); } sp.push([SX(pts[pts.length-1][0]), SY(pts[pts.length-1][1])]); finishStroke(sp); };
    var r2 = v => +v.toFixed(2);
    // quote allineate dello script: estremi, lunghezza e distanza della linea di quota dalla retta dei due estremi
    var al = () => { const L = genScript(piano()).split(/\\r?\\n/), out = []; L.forEach((x, i) => { if (x !== '_.DIMALIGNED') return; const P = k => L[i + k].split(',').map(Number), a = P(1), b = P(2), c = P(3);
        const len = Math.hypot(b[0] - a[0], b[1] - a[1]), off = Math.abs((b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])) / len; out.push([r2(len), r2(off)]); }); return out; };
    var head = () => genScript(piano()).split(/\\r?\\n/).filter(x => /Quote parziali|muri senza misure|obliqui: quote/.test(x));
    var trap = () => { st([[0,0],[6,0],[5,4],[0,4],[0,0]], 'P'); update(true); const runs = G.runs.filter(r => !r.ext);
      setMeasure(pl, 'r', runs.find(r => !r.H && r.walls.some(w => nd(pl,w.a).x < 1)).key, '3,70'); setMeasure(pl, 'r', runs.find(r => r.H && r.sg < 0 && r.walls.some(w => nd(pl,w.a).y > 3)).key, '4,70'); update(true); return pl.walls.find(w => w.obl); };`;
  const out = {};
  // 1) muro obliquo senza lunghezza: non si quota, si conta; con la lunghezza 4,10: una quota allineata da 4,10 a 0,40 dalla faccia
  out.senza = await p.evaluate(new Function(prep + `trap(); return {quote:al(), testa:head()};`));
  out.misurato = await p.evaluate(new Function(prep + `const w = trap(); setMeasure(pl, 'o', w.id, '4,10'); update(true); return {quote:al(), testa:head()};`));
  // 2) con una finestra e le parziali: tre tratti (0,80 + 1,20 vano + 2,10) → quote 0,80 e 2,10 lungo la faccia
  out.vani = await p.evaluate(new Function(prep + `const w = trap(); w.ap = [{id:uid(), tipo:'finestra', d:'1', l:'1,20', h:'1,40', dav:'0,90', inv:false, dp:true}]; update(true);
    const k = oKey(w, G.ochains.find(c => c.w === w).sg); w.ap[0].pos = {k, v:'0,80', prev:''}; delete w.ap[0].dp; setMeasure(pl, 'l', k, '2,10'); update(true); return {quote:al(), testa:head()};`));
  // 3) tramezzo obliquo tra due stanze, fissato dalle misure dei lati sopra e sotto: una quota per ogni faccia
  out.tramezzo = await p.evaluate(new Function(prep + `st([[0,0],[6,0],[6,4],[0,4],[0,0]], 'P'); st([[2,0],[4,4]], 'T'); update(true);
    const runs = G.runs.filter(r => !r.ext); runs.filter(r => r.H).forEach(r => { const a = G.T.N.get(r.p), q = G.T.N.get(r.q); setMeasure(pl, 'r', r.key, f2(Math.abs(q.x - a.x) - r.eA - r.eB)); });
    runs.filter(r => !r.H).forEach(r => setMeasure(pl, 'r', r.key, '3,70')); update(true); return {quote:al(), testa:head(), facce:[...G.oblFace.values()].map(F => [r2(F.int), r2(F.est)])};`));
  console.log(JSON.stringify(out, null, 1)); console.log('errors', errs); await b.close(); })();
