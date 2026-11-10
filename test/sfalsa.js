const APP = require('url').pathToFileURL(require('path').resolve(__dirname, '..', 'index.html')).href;
const OUT = require('path').join(__dirname, 'out'); require('fs').mkdirSync(OUT, {recursive: true});
const { chromium } = require('playwright');
// due ambienti uno sopra l'altro tra gli stessi due tramezzi dritti: misura 3,00 sotto, poi 3,05 sopra.
// La misura non torna (i muri sono in linea): l'app propone di sfalsare il muro a sinistra o a destra; scelto un lato,
// la misura entra e l'ambiente sotto resta 3,00.
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({viewport:{width:1400,height:950}, colorScheme:'dark'});
  const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  await p.goto(process.argv[2] || APP); await p.evaluate(()=>localStorage.clear()); await p.reload();
  const build = () => p.evaluate(()=>{ R = blank(); R.id='sfa'; tab='pianta'; render(); const pl = piano(); ui.view={x:-1,y:-1,s:60}; G = geometry(pl);
    const st = (pts, tipo) => { ui.newType = tipo; const sp = []; for (let i = 0; i < pts.length - 1; i++) { const a = pts[i], c = pts[i+1]; for (let k = 0; k < 6; k++) sp.push([SX(a[0] + (c[0]-a[0])*k/6), SY(a[1] + (c[1]-a[1])*k/6)]); } sp.push([SX(pts[pts.length-1][0]), SY(pts[pts.length-1][1])]); finishStroke(sp); };
    st([[0,0],[9,0],[9,8],[0,8],[0,0]], 'P');
    const box = () => { const xs = pl.nodes.map(n=>n.x), ys = pl.nodes.map(n=>n.y); return [Math.min(...xs), Math.min(...ys)]; };
    let [x0, y0] = box(); st([[x0, y0+4],[x0+9, y0+4]], 'T'); [x0, y0] = box(); st([[x0+3, y0],[x0+3, y0+8]], 'T'); [x0, y0] = box(); st([[x0+6, y0],[x0+6, y0+8]], 'T'); update(true); });
  // larghezza dell'ambiente in mezzo, sotto (lato sotto del tramezzo orizzontale) e sopra (lato sopra)
  const runKey = (sg) => p.evaluate((sg)=>{ const pl = piano(), ys = pl.nodes.map(n=>n.y), xs = pl.nodes.map(n=>n.x), yM = (Math.min(...ys)+Math.max(...ys))/2, xM = (Math.min(...xs)+Math.max(...xs))/2;
    const r = G.runs.find(r => !r.ext && r.H && r.sg === sg && Math.abs(r.P.y - yM) < 0.6 && r.P.x < xM && r.Q.x > xM); return r && r.key; }, sg);
  const type = async (key, txt) => { await p.evaluate((key)=>openInline({kind:'r', key, box:[200,200,40,20]}), key);
    for (const ch of txt) await p.click(`#inl [data-k="${ch}"]`); await p.click('#inl [data-k="ok"]'); await p.waitForTimeout(80); };
  const state = () => p.evaluate(()=>{ const pl = piano(), ys = pl.nodes.map(n=>n.y), xs = pl.nodes.map(n=>n.x), yM = (Math.min(...ys)+Math.max(...ys))/2, xM = (Math.min(...xs)+Math.max(...xs))/2;
    const w = sg => { const r = G.runs.find(r => !r.ext && r.H && r.sg === sg && Math.abs(r.P.y - yM) < 0.6 && r.P.x < xM && r.Q.x > xM); return r ? [+r.face.toFixed(2), r.mis || null] : null; };
    return {sotto:w(-1), sopra:w(1), rej:[...REJ].length, err:G.errs.length, sfal:pl.walls.filter(x=>x.sfal).length, walls:pl.walls.length}; });
  const out = {};
  for (const [lato, val] of [['q','3,05'], ['p','3,05'], ['q','2,9']]) {
    await build(); await type(await runKey(-1), '3'); 
    await type(await runKey(1), val);
    const offer = await p.evaluate(()=>{ const el = document.querySelector('#sfal'); return el ? [...el.querySelectorAll('[data-s]')].map(b=>b.textContent) : null; });
    if (offer) await p.click(`#sfal [data-s="${lato}"]`); await p.waitForTimeout(100);
    out[lato + ' ' + val] = {offer, ...(await state())};
    if (lato === 'q' && val === '3,05') await p.screenshot({path:require('path').join(OUT, 'sfalsa.png')});
  }
  // misura uguale: nessuna proposta
  await build(); await type(await runKey(-1), '3'); await type(await runKey(1), '3');
  out.uguale = {offer: await p.evaluate(()=>!!document.querySelector('#sfal')), ...(await state())};
  // annulla dopo lo sfalsamento: torna la misura non applicata
  await build(); await type(await runKey(-1), '3'); await type(await runKey(1), '3,05'); await p.click('#sfal [data-s="q"]'); await p.waitForTimeout(80);
  await p.evaluate(()=>{ undo(); }); await p.waitForTimeout(80); out.annulla = await state();
  // lati verticali: altezza dell'ambiente in alto a sinistra (3,80) e di quello in alto in mezzo (3,85); in alto c'è il perimetrale: non si propone
  const vKey = (sg) => p.evaluate((sg)=>{ const pl = piano(), xs = pl.nodes.map(n=>n.x), ys = pl.nodes.map(n=>n.y), x3 = Math.min(...xs) + 3.15, yM = (Math.min(...ys)+Math.max(...ys))/2;
    const r = G.runs.find(r => !r.ext && !r.H && r.sg === sg && Math.abs(r.P.x - x3) < 0.4 && r.P.y > yM - 0.5 && r.Q.y > yM + 2); return r && r.key; }, sg);
  await build(); await type(await vKey(-1), '3,8'); await type(await vKey(1), '3,85');
  const offV = await p.evaluate(()=>{ const el = document.querySelector('#sfal'); return el ? [...el.querySelectorAll('[data-s]')].map(b=>b.dataset.s + ':' + b.textContent) : null; });
  if (offV) await p.click('#sfal [data-s="p"]'); await p.waitForTimeout(100);
  out.verticale = {offer:offV, ...(await p.evaluate(()=>{ const pl = piano(), xs = pl.nodes.map(n=>n.x), ys = pl.nodes.map(n=>n.y), x3 = Math.min(...xs) + 3.15, yM = (Math.min(...ys)+Math.max(...ys))/2;
    const h = sg => { const r = G.runs.find(r => !r.ext && !r.H && r.sg === sg && Math.abs(r.P.x - x3) < 0.4 && r.P.y > yM - 0.5 && r.Q.y > yM + 2); return r ? [+r.face.toFixed(2), r.mis || null] : null; };
    return {sinistra:h(-1), mezzo:h(1), rej:[...REJ].length, err:G.errs.length}; }))};
  console.log(JSON.stringify(out)); console.log('errors', errs); await b.close();
})();
