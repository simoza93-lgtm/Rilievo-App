const APP = require('url').pathToFileURL(require('path').resolve(__dirname, '..', 'index.html')).href;
const OUT = require('path').join(__dirname, 'out'); require('fs').mkdirSync(OUT, {recursive: true});
const { chromium } = require('playwright');
// gradini ritoccati a mano (scala a L): «Modifica gradini», trascinare un estremo (ventaglio) e il centro (alzata intera), pedate scritte sui due lati,
// la scala non si sposta, controlli (2a + p sulla linea di passo, pedata minima sul lato interno), ripristina, piano sopra, cambio tipo, script
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({viewport:{width:1400,height:950}});
  const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  await p.goto(process.argv[2] || APP); await p.evaluate(()=>localStorage.clear()); await p.reload();
  await p.evaluate(() => { R = blank(); R.id='gr'; tab='pianta'; render(); var pl = piano(); ui.view={x:-1,y:-1,s:110}; G = geometry(pl);
    const st = (pts, tipo) => { ui.newType = tipo; const sp = []; for (let i = 0; i < pts.length - 1; i++) { const a = pts[i], c = pts[i+1]; for (let k = 0; k < 8; k++) sp.push([SX(a[0] + (c[0]-a[0])*k/8), SY(a[1] + (c[1]-a[1])*k/8)]); } sp.push([SX(pts[pts.length-1][0]), SY(pts[pts.length-1][1])]); finishStroke(sp); };
    st([[0,0],[5,0],[5,4],[0,4],[0,0]], 'P'); ui.mode = 'select'; update(true);
    const s = newStair('L', 0, 0); s.x = 0.3; s.y = 0.3; s.n = '14'; s.n1 = '8'; pl.stairs = [s]; update(true); ui.sel = {k:'s', id:s.id}; renderSide(); draw(); });
  const sv = async (x, y) => p.evaluate(([x, y]) => { const r = $('#svg').getBoundingClientRect(); return [r.left + SX(x), r.top + SY(y)]; }, [x, y]);
  const out = {};
  out.prima = await p.evaluate(() => { const P = stairPrims(piano().stairs[0]); return {bbox:P.bbox.map(v => +v.toFixed(3)), alzate:P.ris.length}; });
  await p.click('#bStEd'); await p.waitForTimeout(80);
  out.modifica = await p.evaluate(() => ({on:stEdOn() === piano().stairs[0], hint:/Trascina i pallini/.test($('#side').innerHTML)}));
  // 1) estremo esterno dell'ultima alzata della prima rampa (alzata 8) trascinato in diagonale nel pianerottolo
  const r8 = await p.evaluate(() => { const r = stairPrims(piano().stairs[0]).ris.find(x => x.k === 7); return {a:r.a, b:r.b}; });
  { const s0 = await sv(r8.a[0], r8.a[1]), s1 = await sv(r8.a[0], r8.a[1] + 0.55); await p.mouse.move(s0[0], s0[1]); await p.mouse.down(); await p.mouse.move(s1[0], s1[1], {steps:6}); await p.mouse.up(); await p.waitForTimeout(100); }
  out.ventaglio = await p.evaluate(() => { const st = piano().stairs[0], P = stairPrims(st), r = P.ris.find(x => x.k === 7); return {ritoccate:Object.keys(st.ed || {}), a:r.a.map(v => +v.toFixed(2)), b:r.b.map(v => +v.toFixed(2)), bbox:P.bbox.map(v => +v.toFixed(3)), marcata:r.ed}; });
  // 2) centro dell'alzata 3 trascinato: si sposta tutta (parallela)
  const r3 = await p.evaluate(() => { const r = stairPrims(piano().stairs[0]).ris.find(x => x.k === 2); return {a:r.a, b:r.b}; });
  { const m = [(r3.a[0] + r3.b[0]) / 2, (r3.a[1] + r3.b[1]) / 2], s0 = await sv(m[0], m[1]), s1 = await sv(m[0], m[1] + 0.05); await p.mouse.move(s0[0], s0[1]); await p.mouse.down(); await p.mouse.move(s1[0], s1[1], {steps:4}); await p.mouse.up(); await p.waitForTimeout(100); }
  out.intera = await p.evaluate(() => { const r = stairPrims(piano().stairs[0]).ris.find(x => x.k === 2); return {dy:[+(r.a[1]).toFixed(3), +(r.b[1]).toFixed(3)]}; });
  // 2b) centro dell'alzata 2 trascinato un po' di lato (6 cm) e in avanti: si aggancia all'asse centrale (resta in linea con le altre); 40 cm di lato no
  const asse = async (k, ddx) => { const r = await p.evaluate(k => { const r = stairPrims(piano().stairs[0]).ris.find(x => x.k === k); return {a:r.a, b:r.b}; }, k);
    const m = [(r.a[0] + r.b[0]) / 2, (r.a[1] + r.b[1]) / 2], s0 = await sv(m[0], m[1]), s1 = await sv(m[0] + ddx, m[1] + 0.04);
    await p.mouse.move(s0[0], s0[1]); await p.mouse.down(); await p.mouse.move(s1[0], s1[1], {steps:4}); await p.mouse.up(); await p.waitForTimeout(80);
    return p.evaluate(([k, x0]) => { const r = stairPrims(piano().stairs[0]).ris.find(x => x.k === k); return {centroX:+((r.a[0] + r.b[0]) / 2 - x0).toFixed(3), avanti:+(((r.a[1] + r.b[1]) / 2)).toFixed(3)}; }, [k, m[0]]); };
  out.asse = await asse(1, 0.06); out.fuoriAsse = await asse(5, 0.40);
  // 3) tocco senza trascinare sull'alzata 5 → pedate da scrivere; lato destro 0,30, lato sinistro 0,22
  const r5 = await p.evaluate(() => stairPrims(piano().stairs[0]).ris.find(x => x.k === 4).b);
  { const s0 = await sv(r5[0], r5[1]); await p.mouse.click(s0[0], s0[1]); await p.waitForTimeout(100); }
  out.campi = await p.evaluate(() => [...document.querySelectorAll('#side [data-sk]')].map(e => e.closest('div').querySelector('label').textContent + '=' + e.value));
  const typ = async (k, v) => p.evaluate(([k, v]) => { const e = document.querySelector(`#side [data-sk="${k}"]`); e.value = v; e.dispatchEvent(new Event('input', {bubbles:true})); }, [k, v]);
  await typ('pa', '0,30'); await typ('pb', '0,22');
  out.pedate = await p.evaluate(() => { const P = stairPrims(piano().stairs[0]), r = P.ris.find(x => x.k === 4), e = edPed(P, r); return [+e.pa.toFixed(3), +e.pb.toFixed(3), +e.pm.toFixed(3)]; });
  // 4) controlli: con la soglia 0,15 sul lato interno; 2a + p sulla linea di passo
  out.controlli = await p.evaluate(() => { R.pedInt = '0,15'; const st = piano().stairs[0]; return edChecks(st); });
  await p.screenshot({path:OUT + '/scalegr.png'});
  // 5) piano sopra: i ritocchi passano alla stessa scala
  await p.evaluate(() => { R.piani.push({id:uid(), nome:'Piano primo', ver:0, nodes:[], walls:[], rooms:[]}); renderSide(); });
  await p.click('#bLinkS'); await p.waitForTimeout(80);
  out.sopra = await p.evaluate(() => { const a = piano().stairs[0], b2 = R.piani[1].stairs[0]; return {stessi:JSON.stringify(a.ed) === JSON.stringify(b2.ed), copia:a.ed !== b2.ed}; });
  // 6) script: la linea dell'alzata 5 ritoccata (sotto il taglio, piena)
  out.script = await p.evaluate(() => { const r = stairPrims(piano().stairs[0]).ris.find(x => x.k === 4), f = q => q.map(v => v.toFixed(3)).join(','); const L = genScript(piano()).split(/\r?\n/);
    return L.some((x, i) => x === '_.LINE' && ((L[i + 1] === f(r.a) && L[i + 2] === f(r.b)) || (L[i + 1] === f(r.b) && L[i + 2] === f(r.a)))); });
  // 7) ripristina l'alzata 3, poi cambio di tipo: i ritocchi si tolgono
  await p.evaluate(() => { ui.stK = 2; renderSide(); }); await p.click('#bStRst'); out.dopoRipristino = await p.evaluate(() => Object.keys(piano().stairs[0].ed || {}));
  await p.evaluate(() => { const e = document.querySelector('#side [data-st="tipo"]'); e.value = 'U'; e.dispatchEvent(new Event('input', {bubbles:true})); });
  out.cambioTipo = await p.evaluate(() => ({ed:piano().stairs[0].ed || null, toast:$('#toast').textContent, modifica:!!stEdOn()}));
  console.log(JSON.stringify(out, null, 1)); console.log('errors', errs); await b.close(); })();
