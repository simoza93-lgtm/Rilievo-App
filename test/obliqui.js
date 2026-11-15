const APP = require('url').pathToFileURL(require('path').resolve(__dirname, '..', 'index.html')).href;
const OUT = require('path').join(__dirname, 'out'); require('fs').mkdirSync(OUT, {recursive: true});
const { chromium } = require('playwright');
// muri obliqui (tappa 1): trapezio con perimetrale obliquo, lunghezza che fissa il cateto libero (Pitagora), controllo quando è tutto fissato,
// tramezzo obliquo, smusso, incrocio a X, pannello, guida, calcoli, script, elimina/annulla
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({viewport:{width:1400,height:950}});
  const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  await p.goto(process.argv[2] || APP); await p.evaluate(()=>localStorage.clear()); await p.reload();
  const prep = `R = blank(); R.id='ob'; tab='pianta'; render(); var pl = piano(); ui.view={x:-2,y:-2,s:60}; G = geometry(pl);
    var st = (pts, tipo) => { ui.newType = tipo; const sp = []; for (let i = 0; i < pts.length - 1; i++) { const a = pts[i], c = pts[i+1]; for (let k = 0; k < 8; k++) sp.push([SX(a[0] + (c[0]-a[0])*k/8), SY(a[1] + (c[1]-a[1])*k/8)]); } sp.push([SX(pts[pts.length-1][0]), SY(pts[pts.length-1][1])]); finishStroke(sp); };
    var r3 = v => +v.toFixed(3), res = () => ({muri:pl.walls.length, obliqui:pl.walls.filter(w=>w.obl).length, ambienti:G.comps.map(c => r3(c.area)), errori:G.errs.map(e=>e.t), avvisi:G.warns.map(e=>e.t)});`;
  const out = {};
  out.trapezio = await p.evaluate(new Function(prep + `st([[0,0],[6,0],[5,4],[0,4],[0,0]], 'P'); st([[2.5,0],[2.5,4]], 'T'); update(true);
    const F0 = G.oblFace.get(pl.walls.find(w => w.obl).id), runs = () => G.runs.filter(r => !r.ext);
    const left = runs().find(r => !r.H && r.walls.some(w => nd(pl,w.a).x < 1)); setMeasure(pl, 'r', left.key, '3,70');
    const botR = runs().find(r => r.H && r.sg > 0 && nd(pl, r.walls[0].a).y < 1 && nd(pl, r.walls[0].a).x > 2); setMeasure(pl, 'r', botR.key, '3,50');
    const ob = pl.walls.find(w => w.obl); setMeasure(pl, 'o', ob.id, '3,90'); update(true);
    const F1 = G.oblFace.get(ob.id), top = [nd(pl, ob.b).x, nd(pl, ob.b).y];
    const topR = runs().find(r => r.H && r.sg < 0 && nd(pl, r.walls[0].a).y > 3 && nd(pl, r.walls[0].a).x > 2); setMeasure(pl, 'r', topR.key, '2,40'); update(true);
    const F2 = G.oblFace.get(ob.id);
    return Object.assign(res(), {facceSchizzo:[r3(F0.int), r3(F0.est), r3(F0.asse)], internaDopoMisura:r3(F1.int), spigoloAlto:[r3(top[0]), r3(top[1])], conAltraMisura:r3(F2.int), rossa:G.oblBad.has(ob.id), nonApplicata:REJ.has('r:' + topR.key)});`));
  await p.click('text=Adatta'); await p.waitForTimeout(150); await p.screenshot({path:OUT + '/obliqui_trapezio.png'});
  out.tramezzo = await p.evaluate(new Function(prep + `st([[0,0],[6,0],[6,4],[0,4],[0,0]], 'P'); st([[1,0],[4,4]], 'T'); update(true); return res();`));
  out.smusso = await p.evaluate(new Function(prep + `st([[0,0],[5,0],[6,1],[6,4],[0,4],[0,0]], 'P'); update(true); return res();`));
  out.incrocio = await p.evaluate(new Function(prep + `st([[0,0],[6,0],[6,4],[0,4],[0,0]], 'P'); st([[1,0],[5,4]], 'T'); st([[5,0],[1,4]], 'T'); update(true);
    const w = pl.walls.find(w => w.obl); ui.mode = 'select'; ui.sel = {k:'w', id:w.id}; draw(); renderSide(); return res();`));
  await p.click('text=Adatta'); await p.waitForTimeout(150); await p.screenshot({path:OUT + '/obliqui_incrocio.png'});
  out.pannello = await p.evaluate(() => document.querySelector('#side .cardh').textContent.trim().split(' ').slice(0, 2).join(' '));
  await p.fill('#side input[data-w="mis"]', '3,00'); await p.waitForTimeout(100);
  out.misuraPannello = await p.evaluate(() => ({avvisi:G.warns.map(e => e.t), faccia:+G.oblFace.get(ui.sel.id).int.toFixed(3)}));
  out.guida = await p.evaluate(() => measItems().filter(it => it.o).map(it => it.st).join(''));
  out.calcoli = await p.evaluate(() => { tab = 'calc'; render(); const t = document.body.innerText; tab = 'pianta'; render(); return /SUP\. NETTA/i.test(t); });
  out.script = await p.evaluate(() => { const sc = genScript(piano()); return {polilinee:(sc.match(/_.PLINE/g) || []).length, ambienti:(sc.match(/AMBIENTE \d/g) || []).length}; });
  await p.click('#bDelW'); await p.waitForTimeout(80); out.elimina = await p.evaluate(() => [piano().walls.length, G.comps.length]);
  await p.click('#bUndo'); await p.waitForTimeout(80); out.annulla = await p.evaluate(() => [piano().walls.length, G.comps.length]);
  console.log(JSON.stringify(out)); console.log('errors', errs); await b.close(); })();
