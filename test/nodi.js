const APP = require('url').pathToFileURL(require('path').resolve(__dirname, '..', 'index.html')).href;
const OUT = require('path').join(__dirname, 'out'); require('fs').mkdirSync(OUT, {recursive: true});
const { chromium } = require('playwright');
// incrocio disegnato due volte a pochi cm (tramezzo a L accanto allo spigolo del perimetrale, tramezzi sfalsati di 10 cm):
// i due nodi diventano uno solo; nessun muro sovrapposto; le misure già scritte restano.
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({viewport:{width:1400,height:950}, colorScheme:'dark'});
  const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  await p.goto(process.argv[2] || APP); await p.evaluate(()=>localStorage.clear()); await p.reload();
  const r = await p.evaluate(()=>{
    const start = s => { R = blank(); R.id='nodi'; tab='pianta'; render(); const pl = piano(); ui.view={x:-3,y:-7,s}; G = geometry(pl); return pl; };
    const off = pl => { const ns = pl.walls.filter(w=>w.tipo==='P').flatMap(w=>[nd(pl,w.a),nd(pl,w.b)]); if (!ns.length) return [0,0]; return [Math.min(...ns.map(n=>n.x))+4, Math.max(...ns.map(n=>n.y))-6]; };
    const st = (pl, pts0, tipo) => { const O = off(pl); const pts = pts0.map(q=>[q[0]+O[0], q[1]+O[1]]); ui.newType = tipo; const sp = []; for (let i = 0; i < pts.length - 1; i++) { const a = pts[i], cc = pts[i+1]; for (let k = 0; k < 6; k++) sp.push([SX(a[0] + (cc[0]-a[0])*k/6), SY(a[1] + (cc[1]-a[1])*k/6)]); } sp.push([SX(pts[pts.length-1][0]), SY(pts[pts.length-1][1])]); finishStroke(sp); };
    const perim = pl => st(pl, [[-4,6],[-4,0],[0,0],[0,-6],[5.6,-6],[5.6,-5],[6.6,-5],[6.6,-3],[9,-3],[9,6],[-4,6]], 'P');
    const overlaps = pl => { let k = 0; pl.walls.forEach((w,i)=>pl.walls.forEach((x,j)=>{ if(j<=i) return; const a=nd(pl,w.a),b=nd(pl,w.b),c=nd(pl,x.a),d=nd(pl,x.b); const H=isH(a,b); if(H!==isH(c,d)) return; if(H? Math.abs(a.y-c.y)>1e-6 : Math.abs(a.x-c.x)>1e-6) return; const lo=Math.max(H?a.x:a.y,H?c.x:c.y), hi=Math.min(H?b.x:b.y,H?d.x:d.y); if(hi-lo>1e-3) k++; })); return k; };
    const nodesNear = (pl, x, y) => { const O = off(pl); return pl.nodes.filter(n => Math.abs(n.x-O[0]-x)<0.4 && Math.abs(n.y-O[1]-y)<0.4).map(n => pl.walls.filter(w=>w.a===n.id||w.b===n.id).length); };
    const bad = []; let n = 0;
    // tramezzo a L che gira accanto allo spigolo del perimetrale
    for (const s of [60,150]) for (const [dx,dy] of [[0.08,0.12],[0.05,0.05],[0.12,0.08],[-0.08,0.1],[0.1,-0.08],[0.15,0.15]]) for (const mode of [0,1]) {
      const pl = start(s); perim(pl); st(pl, [[-4,3],[9,3]],'T');
      if (mode===0) st(pl, [[dx,3],[dx,dy],[4.1,dy]],'T'); else { st(pl, [[dx,3],[dx,dy]],'T'); st(pl, [[dx,dy],[4.1,dy]],'T'); }
      st(pl, [[4.1,3],[4.1,-6]],'T'); update(true); n++;
      const k = nodesNear(pl, 0, 0), ov = overlaps(pl); if (k.length !== 1 || k[0] !== 4 || ov) bad.push(['L',s,dx,dy,mode,k,ov]); }
    // tramezzi sopra e sotto un tramezzo, sfalsati di pochi cm: diventano un incrocio; sfalsati di 30 cm restano due
    for (const s of [60,150]) for (const dx of [0.1,0.06,-0.1,0.3]) for (const mode of [0,1]) {
      const pl = start(s); perim(pl); st(pl, [[-4,3],[9,3]],'T'); st(pl, [[0,0],[4.1,0]],'T'); st(pl, [[0,0],[0,3]],'T');
      if (mode===0) st(pl, [[dx,3],[dx,6]],'T'); else st(pl, [[dx,6],[dx,3]],'T'); update(true); n++;
      const k = nodesNear(pl, 0, 3), ov = overlaps(pl), want = dx === 0.3 ? 2 : 1; if (k.length !== want || ov) bad.push(['X',s,dx,mode,k,ov]); }
    // rilievo vecchio: tramezzo a L con il suo nodo a 8 e 12 cm dallo spigolo, misura 4,00 sul lato sopra della stanza
    const pl = start(60); perim(pl); st(pl, [[-4,3],[9,3]],'T'); st(pl, [[0,3],[0,0],[4.1,0]],'T'); st(pl, [[4.1,3],[4.1,-6]],'T'); update(true);
    const O = off(pl), h = pl.nodes.find(q => Math.abs(q.x-O[0])<0.01 && Math.abs(q.y-O[1])<0.01);
    const m = {id:uid(), x:r4(h.x+0.08), y:r4(h.y+0.12)}; pl.nodes.push(m);
    pl.walls.filter(w => w.tipo==='T' && (w.a===h.id || w.b===h.id)).forEach(w => { const H = isH(nd(pl,w.a),nd(pl,w.b)), o = nd(pl, w.a===h.id ? w.b : w.a); if (H) o.y = m.y; else o.x = m.x; if (w.a===h.id) w.a = m.id; else w.b = m.id; });
    const hw = pl.walls.find(w => w.tipo==='T' && w.a===m.id && isH(nd(pl,w.a),nd(pl,w.b))), key = '-:' + m.id + ':' + hw.b;
    pl.fm[key] = '4.00'; pl.mord = [key]; update(true);
    const tr = G.runs.find(r => !r.ext && r.H && r.sg<0 && r.mis === 4);
    const lr = G.runs.find(r=>!r.ext && !r.H && r.sg>0 && r.walls.some(w=>w.tipo==='P') && Math.abs(r.P.y - (O[1]-6)) < 0.3);
    return {casi:n, sbagliati:bad, vecchio:{nodi:nodesNear(pl,0,0), misSopra:tr ? +tr.face.toFixed(2) : null, latoSinistroFinoA:+(lr.Q.y-lr.P.y).toFixed(2), err:G.errs.length}};
  });
  await p.click('text=Adatta'); await p.waitForTimeout(200); await p.screenshot({path:require('path').join(OUT, 'nodi.png')});
  console.log(JSON.stringify(r)); console.log('errors', errs); await b.close();
})();
