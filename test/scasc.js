const APP = require('url').pathToFileURL(require('path').resolve(__dirname, '..', 'index.html')).href;
const OUT = require('path').join(__dirname, 'out'); require('fs').mkdirSync(OUT, {recursive: true});
const { chromium } = require('playwright');
// scala attorno all'ascensore: dal pannello Scale, 2/3/4 rampe, alzate per rampa, controllo delle rampe che non entrano nel lato del vano,
// ascensore al centro (pareti del vano, cabina con la croce, porta di piano), foro nella superficie, script
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({viewport:{width:1400,height:950}});
  const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  await p.goto(process.argv[2] || APP); await p.evaluate(()=>localStorage.clear()); await p.reload();
  await p.evaluate(() => { R = blank(); R.id='sa'; tab='pianta'; render(); var pl = piano(); ui.view={x:-1,y:-1,s:60}; G = geometry(pl);
    const st = (pts, tipo) => { ui.newType = tipo; const sp = []; for (let i = 0; i < pts.length - 1; i++) { const a = pts[i], c = pts[i+1]; for (let k = 0; k < 8; k++) sp.push([SX(a[0] + (c[0]-a[0])*k/8), SY(a[1] + (c[1]-a[1])*k/8)]); } sp.push([SX(pts[pts.length-1][0]), SY(pts[pts.length-1][1])]); finishStroke(sp); };
    st([[0,0],[5,0],[5,5],[0,5],[0,0]], 'P'); ui.mode = 'select'; update(true); draw(); });
  const out = {};
  await p.click('[data-cat="scale"]'); await p.click('#appan [data-ap="sc:asc"]');
  { const bx = await p.evaluate(()=>{ const r = $('#svg').getBoundingClientRect(); return [r.left + SX(2.4), r.top + SY(2.4)]; }); await p.mouse.move(bx[0], bx[1]); await p.mouse.down(); await p.mouse.move(bx[0] + 6, bx[1], {steps:3}); await p.mouse.up(); await p.waitForTimeout(150); }
  const info = () => p.evaluate(() => { const s = piano().stairs[0], P = stairPrims(s), S = stP(s), r2 = v => +v.toFixed(2);
    return {tipo:s.tipo, rampe:S.nr, alzate:S.n, perRampa:S.ms.join('-'), ingombro:[r2(P.bbox[2] - P.bbox[0]), r2(P.bbox[3] - P.bbox[1])], vano:P.lift ? r2(P.lift.area) : null, pareti:P.lift ? P.lift.walls.length : 0,
      fuori:P.fit.map(f => [f.i, r2(f.L), r2(f.side)]), foro:r2(G.comps[0].foro), ok:stCheck(s).okBl}; });
  out.posata = await info();
  await p.click('text=Adatta'); await p.waitForTimeout(150); await p.screenshot({path:OUT + '/scasc.png'});
  // pannello della scala: rampe, alzate per rampa, porta dell'ascensore
  await p.evaluate(() => { ui.sel = {k:'s', id:piano().stairs[0].id}; renderSide(); });
  out.campi = await p.evaluate(() => [...document.querySelectorAll('#side [data-st]')].map(e => e.dataset.st).filter(k => ['nr', 'ax', 'ay', 'as', 'pw', 'ps', 'na'].includes(k)).join(','));
  const set = async (k, v) => { await p.evaluate(([k, v]) => { const e = document.querySelector(`#side [data-st="${k}"]`); e.value = v; e.dispatchEvent(new Event('input', {bubbles:true})); }, [k, v]); await p.waitForTimeout(80); };
  await set('nr', '2'); out.due = await info();
  await set('nr', '4'); out.quattro = await info();
  await set('nr', '3'); await set('na', '7-4-7'); out.lista = await info();
  await set('na', '9-4-5'); out.troppoLunga = await info(); out.avviso = await p.evaluate(() => /Rampa 1/.test($('#sInfo').innerHTML));
  await set('na', ''); await set('ps', 'r1'); out.ps = await p.evaluate(() => [piano().stairs[0].ps, stP(piano().stairs[0]).ps]);
  out.porta = await p.evaluate(() => { const L = stairPrims(piano().stairs[0]).lift, d = L.door[0]; return Math.abs(d[1][0] - d[0][0]) < Math.abs(d[1][1] - d[0][1]) ? 'lato verticale' : 'lato orizzontale'; });
  // piano intermedio e script
  out.script = await p.evaluate(() => { const s = piano().stairs[0]; s.dir = 'inter'; update(true); const L = genScript(piano()).split(/\r?\n/), i = L.indexOf('; ascensore: pareti del vano sul layer dei muri perimetrali (portanti), cabina con la croce e porta di piano sul layer delle scale');
    return {ascensore:i >= 0, layer:L[i + 2], plinea:L[i + 3], punti:L.slice(i + 4, i + 17).filter(x => /,/.test(x)).length, vanoInter:!!stairPrims(s).lift}; });
  console.log(JSON.stringify(out, null, 1)); console.log('errors', errs); await b.close(); })();
