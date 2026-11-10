const APP = require('url').pathToFileURL(require('path').resolve(__dirname, '..', 'index.html')).href;
const OUT = require('path').join(__dirname, 'out'); require('fs').mkdirSync(OUT, {recursive: true});
const { chromium } = require('playwright');
// tramezzo dritto che continua lo spigolo del perimetrale e attraversa un altro tramezzo: i due tratti restano allineati
// (stessa «Posizione»), comunque sia disegnato; cambiando la Posizione nel pannello cambia tutto il muro dritto.
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({viewport:{width:1400,height:950}});
  const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  await p.goto(process.argv[2] || APP); await p.evaluate(()=>localStorage.clear()); await p.reload();
  const out = {};
  const build = async mode => p.evaluate((mode)=>{
    R = blank(); R.id='lin'; tab='pianta'; render(); const pl = piano(); ui.view={x:-6,y:-9,s:60}; G = geometry(pl);
    const off = () => { const ns = pl.walls.filter(w=>w.tipo==='P').flatMap(w=>[nd(pl,w.a),nd(pl,w.b)]); if (!ns.length) return [0,0]; return [Math.min(...ns.map(n=>n.x))+4, Math.max(...ns.map(n=>n.y))-6]; };
    const st = (pts0, tipo) => { const O = off(); const pts = pts0.map(q=>[q[0]+O[0], q[1]+O[1]]); ui.newType = tipo; const sp = []; for (let i = 0; i < pts.length - 1; i++) { const a = pts[i], cc = pts[i+1]; for (let k = 0; k < 6; k++) sp.push([SX(a[0] + (cc[0]-a[0])*k/6), SY(a[1] + (cc[1]-a[1])*k/6)]); } sp.push([SX(pts[pts.length-1][0]), SY(pts[pts.length-1][1])]); finishStroke(sp); };
    st([[-4,6],[-4,0],[0,0],[0,-6],[5.6,-6],[5.6,-5],[6.6,-5],[6.6,-3],[9,-3],[9,6],[-4,6]], 'P');
    if (mode!=='primaV') st([[-4,3],[9,3]],'T');
    if (mode==='uno') st([[0,6],[0,0]],'T');
    if (mode==='due') { st([[0,3],[0,0]],'T'); st([[0,6],[0,3]],'T'); }
    if (mode==='dueInv') { st([[0,6],[0,3]],'T'); st([[0,3],[0,0]],'T'); }
    if (mode==='primaV') { st([[0,6],[0,0]],'T'); st([[-4,3],[9,3]],'T'); }
    if (mode==='dalBasso') st([[0,0],[0,6]],'T');
    update(true); }, mode);
  const offs = () => p.evaluate(()=>{ const pl = piano(), ns = pl.walls.filter(w=>w.tipo==='P').flatMap(w=>[nd(pl,w.a),nd(pl,w.b)]), x0 = Math.min(...ns.map(n=>n.x))+4;
    return pl.walls.filter(w=>w.tipo==='T' && !isH(nd(pl,w.a),nd(pl,w.b)) && Math.abs(nd(pl,w.a).x-x0)<0.3).sort((a,c)=>nd(pl,a.a).y-nd(pl,c.a).y).map(w=>+(G.T.info.get(w.id).o||0).toFixed(2)); });
  for (const mode of ['uno','due','dueInv','primaV','dalBasso']) { await build(mode); out[mode] = await offs(); }
  // pannello del muro: tocco il tratto in alto e cambio la Posizione
  const pick = async v => { await p.evaluate(()=>{ const pl = piano(), ns = pl.walls.filter(w=>w.tipo==='P').flatMap(w=>[nd(pl,w.a),nd(pl,w.b)]), x0 = Math.min(...ns.map(n=>n.x))+4;
      const w = pl.walls.filter(w=>w.tipo==='T' && !isH(nd(pl,w.a),nd(pl,w.b)) && Math.abs(nd(pl,w.a).x-x0)<0.3).sort((a,c)=>nd(pl,c.a).y-nd(pl,a.a).y)[0]; ui.sel = {k:'w', id:w.id}; draw(); renderSide(); });
    await p.selectOption('select[data-w="filo"]', v); await p.waitForTimeout(100); return offs(); };
  out.centrato = await pick(''); out.sinistra = await pick('-'); out.destra = await pick('+');
  out.etichetta = await p.evaluate(()=>document.querySelector('select[data-w="filo"]').closest('div').querySelector('label').textContent);
  await p.click('text=Adatta'); await p.waitForTimeout(200); await p.screenshot({path:require('path').join(OUT, 'linea.png')});
  console.log(JSON.stringify(out)); console.log('errors', errs); await b.close();
})();
