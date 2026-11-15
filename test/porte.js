const APP = require('url').pathToFileURL(require('path').resolve(__dirname, '..', 'index.html')).href;
const OUT = require('path').join(__dirname, 'out'); require('fs').mkdirSync(OUT, {recursive: true});
const { chromium } = require('playwright');
// pannello Porte / Finestre a destra (stile ArcSite) e tipi di porta: battente, doppia anta, anta e mezza, scorrevole esterna,
// a scomparsa, a libro (disegno in pianta, tasti ⇄ ⇅, avvisi, script); il pannello resta aperto, le caselle si toccano lo stesso
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({viewport:{width:1400,height:950}});
  const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  await p.goto(process.argv[2] || APP); await p.evaluate(()=>localStorage.clear()); await p.reload();
  await p.evaluate(() => { R = blank(); R.id='pt'; tab='pianta'; render(); var pl = piano(); ui.view={x:-1,y:-1,s:60}; G = geometry(pl);
    const st = (pts, tipo) => { ui.newType = tipo; const sp = []; for (let i = 0; i < pts.length - 1; i++) { const a = pts[i], c = pts[i+1]; for (let k = 0; k < 8; k++) sp.push([SX(a[0] + (c[0]-a[0])*k/8), SY(a[1] + (c[1]-a[1])*k/8)]); } sp.push([SX(pts[pts.length-1][0]), SY(pts[pts.length-1][1])]); finishStroke(sp); };
    st([[0,0],[12,0],[12,4],[0,4],[0,0]], 'P'); st([[0,2],[12,2]], 'T'); ui.mode = 'select'; update(true); draw(); });
  const box = async () => p.evaluate(()=>{ const r = $('#svg').getBoundingClientRect(); return [r.left, r.top]; });
  const drop = async (x, y) => { const bx = await box(), s = await p.evaluate(([x, y]) => [SX(x), SY(y)], [x, y]); await p.mouse.move(bx[0] + s[0] - 15, bx[1] + s[1]); await p.mouse.down(); await p.mouse.move(bx[0] + s[0], bx[1] + s[1], {steps:4}); await p.mouse.up(); await p.waitForTimeout(120); };
  const out = {};
  // 1) Porte: il pannello si apre a destra con tutti i tipi; il primo è già scelto
  await p.click('[data-cat="porte"]'); await p.waitForTimeout(100);
  out.pannello = await p.evaluate(() => ({aperto:!$('#appan').hidden, titolo:$('#appan .aph span').textContent, tipi:[...document.querySelectorAll('#appan [data-ap]')].map(b => b.dataset.ap), scelto:ui.place}));
  // 2) un tipo per volta, posato sul tramezzo: il pannello resta aperto
  const kinds = ['porta', 'porta:2a', 'porta:am', 'porta:sce', 'porta:sco', 'porta:lib'];
  for (let i = 0; i < kinds.length; i++) { await p.click(`#appan [data-ap="${kinds[i]}"]`); await drop(1.2 + i * 1.9, 2); }
  out.posate = await p.evaluate(() => { const w = piano().walls.find(w => w.tipo === 'T'); return {aperto:!$('#appan').hidden, scelto:ui.place,
    porte:w.ap.map(a => [a.tipo, a.pt || '', a.l]), segni:w.ap.map(a => { const S = G.ops.find(o => o.ap === a).dsym; return [S.pl.length, S.arcs.length, S.dash.length]; }), avvisi:G.warns.map(x => x.t)}; });
  await p.click('text=Adatta'); await p.waitForTimeout(150); await p.screenshot({path:OUT + '/porte_tipi.png'});
  // 3) con il pannello aperto la casella della larghezza si tocca lo stesso
  out.casella = await p.evaluate(() => { const w = piano().walls.find(w => w.tipo === 'T'); ui.sel = {k:'w', id:w.id}; draw(); const it = ui.pbb.find(x => x.hb.kind === 'w' && x.hb.ap === w.ap[1].id); const r = $('#svg').getBoundingClientRect(); return it ? [r.left + it.box[0] + it.box[2] / 2, r.top + it.box[1] + it.box[3] / 2] : null; });
  if (out.casella) { await p.mouse.click(out.casella[0], out.casella[1]); await p.waitForTimeout(150); out.casella = await p.evaluate(() => (document.querySelector('#inl .ms') || {}).textContent || null); await p.keyboard.press('Escape'); await p.waitForTimeout(100); }
  // 4) tasti ⇄ ⇅: doppia anta solo ⇅, a scomparsa solo ⇄; scorrevole: ⇄ cambia il verso; muro corto → avviso
  out.tasti = await p.evaluate(() => { const w = piano().walls.find(w => w.tipo === 'T'), r = {};
    [1, 3, 4].forEach(i => { ui.selAp = w.ap[i].id; draw(); r[w.ap[i].pt] = flipBtns().map(b => b.k).join(''); }); ui.selAp = null;
    const sc = w.ap[3]; sc.cx = true; update(true); r.versoScorrevole = G.warns.filter(x => /scorrevole/.test(x.t)).length;
    w.ap[4].d = '0,30'; w.ap[4].cx = false; update(true); r.scomparsaCorta = G.warns.filter(x => /scomparsa/.test(x.t)).map(x => x.t);
    w.ap[4].d = f2(1.2 + 4 * 1.9 - 0.4); delete w.ap[4].cx; sc.cx = false; update(true); return r; });
  // 5) pannello del vano: «Apertura» cambia il tipo di porta
  out.cambio = await p.evaluate(() => { const w = piano().walls.find(w => w.tipo === 'T'), a = w.ap[0]; ui.sel = {k:'a', id:w.id, ap:a.id}; renderSide();
    const sel = document.querySelector(`[data-w="ap.${a.id}.pt"]`); const r = {opzioni:sel ? [...sel.options].map(o => o.textContent).join('|') : null}; sel.value = '2a'; sel.dispatchEvent(new Event('input', {bubbles:true}));
    r.dopo = [a.pt, G.ops.find(o => o.ap === a).dsym.arcs.length, (document.querySelector('#side .cardh') || {}).textContent]; a.pt = ''; update(true); ui.sel = null; renderSide(); return r; });
  // 6) script: anta + arco per le battenti, freccia per la scorrevole, tratteggi per la scomparsa, linea spezzata per quella a libro
  out.script = await p.evaluate(() => { const L = genScript(piano()).split(/\r?\n/), i = L.findIndex(x => /^; ---- porte/.test(x)), j = L.findIndex((x, k) => k > i && /^; ----/.test(x));
    const part = L.slice(i, j), n = c => part.filter(x => x === c).length; return {plinee:n('_.PLINE'), archi:n('_.ARC'), linee:n('_.LINE')}; });
  // 7) Finestre: pannello con 4 tipi; la strombata nasce incassata strombata; X chiude; un altro strumento chiude
  await p.click('[data-cat="finestre"]'); await p.waitForTimeout(100);
  out.finestre = await p.evaluate(() => [...document.querySelectorAll('#appan [data-ap]')].map(b => b.textContent));
  await p.click('#appan [data-ap="strombata"]'); await drop(3, 0);
  out.strombata = await p.evaluate(() => { const a = piano().walls.flatMap(w => w.ap || []).find(a => a.tipo === 'finestra'); return a ? [a.inc, a.l2p] : null; });
  await p.click('#appan [data-apx]'); await p.waitForTimeout(80);
  out.chiuso = await p.evaluate(() => ({aperto:!$('#appan').hidden, place:ui.place}));
  await p.click('[data-cat="porte"]'); out.ultimo = await p.evaluate(() => ui.place); await p.click('[data-fly="quota"]'); await p.waitForTimeout(80);
  out.altroStrumento = await p.evaluate(() => ({aperto:!$('#appan').hidden, place:ui.place, quota:ui.placeDim}));
  console.log(JSON.stringify(out, null, 1)); console.log('errors', errs); await b.close(); })();
