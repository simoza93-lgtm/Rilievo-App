// Pilastro pieno: posa dal menu «Perimetrali», distanze dai muri, m² al netto, tondo, layer, riapertura, script AutoCAD.
const APP = require('url').pathToFileURL(require('path').resolve(__dirname, '..', 'index.html')).href;
const OUT = require('path').join(__dirname, 'out'); require('fs').mkdirSync(OUT, {recursive: true});
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({viewport:{width:1280, height:854}});
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto(process.argv[2] || APP); await p.evaluate(() => localStorage.clear()); await p.reload(); await p.waitForTimeout(300); await p.evaluate(() => { tab = 'pianta'; render(); }); /* dal menu al disegno */
  await p.click('#bFull'); await p.waitForTimeout(200);
  // stanza interna 5,00 × 4,00
  await p.evaluate(() => { const st = (pts, tipo) => { ui.newType = tipo; const s = []; for (let i = 0; i < pts.length - 1; i++) { const a = pts[i], c = pts[i + 1]; for (let k = 0; k < 6; k++) s.push([SX(a[0] + (c[0] - a[0]) * k / 6), SY(a[1] + (c[1] - a[1]) * k / 6)]); } s.push([SX(pts[pts.length - 1][0]), SY(pts[pts.length - 1][1])]); finishStroke(s); update(true); };
    R = blank(); R.id = 'pil'; tab = 'pianta'; render(); ui.view = {x:-2, y:-7, s:100}; G = geometry(piano()); st([[0,0],[5.3,0],[5.3,4.3],[0,4.3],[0,0]], 'P');
    const pl = piano(); G.runs.filter(r => !r.ext).forEach(r => { setMeasure(pl, 'r', r.key, f2(r.H ? 5 : 4)); update(true); }); ui.sel = null; ui.mode = 'select'; render(); fit(); draw(); });
  const stanza = () => p.evaluate(() => { const c = G.comps.find(c => c.room); return {netta:f2(cArea(c)), tolta:(c.pil || 0).toFixed(3)}; });
  const dove = () => p.evaluate(() => { const c = G.comps.find(c => c.room), q = (piano().pil || [])[0]; if (!q) return 'nessun pilastro'; const b = pilBox(q); return `da sinistra ${f2(b[0] - c.bbox[0])}, da sotto ${f2(b[1] - c.bbox[1])}, ${f2(b[2] - b[0])} × ${f2(b[3] - b[1])}`; });
  const schermo = (wx, wy) => p.evaluate(([x, y]) => { const r = document.querySelector('#svg').getBoundingClientRect(); return [r.left + SX(x), r.top + SY(y)]; }, [wx, wy]);
  console.log('stanza vuota:', await stanza());
  // posa vera: menu Perimetrali -> Pilastro -> tocco, trascino, sollevo
  await p.click('[data-g="muri"] [data-fly]'); await p.waitForTimeout(150); await p.click('[data-pil]'); await p.waitForTimeout(150);
  const o = await p.evaluate(() => G.comps.find(c => c.room).bbox);
  const a = await schermo(o[0] + 2.0, o[1] + 1.5); await p.mouse.move(a[0], a[1]); await p.mouse.down(); await p.mouse.move(a[0] + 20, a[1], {steps:4}); await p.mouse.up(); await p.waitForTimeout(250);
  console.log('posato:', await dove(), await stanza(), 'pannello:', await p.evaluate(() => (document.querySelector('.cardh') || {}).textContent.trim()));
  // distanze scritte toccando i pallini e usando il tastierino
  const scrivi = async (ax, s, v) => { const q = await p.evaluate(([ax, s]) => { const it = (ui.pbb || []).find(x => x.hb.kind === 'pil' && x.hb.ax === ax && x.hb.s === s); if (!it) return null; const r = document.querySelector('#svg').getBoundingClientRect(); return [r.left + it.box[0] + it.box[2] / 2, r.top + it.box[1] + it.box[3] / 2]; }, [ax, s]);
    if (!q) return console.log('manca la casella', ax, s); await p.mouse.click(q[0], q[1]); await p.waitForTimeout(200); const t = await p.textContent('#inl .ms'); for (const k of v) await p.click(`#inl [data-k="${k}"]`); await p.click('#inl [data-k="ok"]'); await p.waitForTimeout(250); console.log('scritto', v, 'da «' + t + '» →', await dove()); };
  console.log('caselle prima:', await p.evaluate(() => (ui.pbb || []).filter(x => x.hb.kind === 'pil').length), 'in «Prossima»:', await p.evaluate(() => guideList().filter(x => x.hb.kind === 'pil').length));
  await scrivi('x', 1, '1,20');
  console.log('scritta a sinistra, casella di destra toccabile:', await p.evaluate(() => { ui.sel = {k:'pil', id:piano().pil[0].id}; draw(); return (ui.pbb || []).some(x => x.hb.kind === 'pil' && x.hb.ax === 'x' && x.hb.s === -1); }));
  await scrivi('y', 1, '0,80');
  await p.screenshot({path:require('path').join(OUT, 'pilastro.png')});
  // la misura segue il muro: la stanza si allunga, il pilastro resta a 1,20 e 0,80; si misura anche dall'altra parte
  await p.evaluate(() => { const pl = piano(); G.runs.filter(r => !r.ext && r.H).forEach(r => setMeasure(pl, 'r', r.key, '6,00')); update(true); });
  console.log('stanza a 6,00:', await dove(), await stanza());
  await p.evaluate(() => { const q = piano().pil[0]; setPilDist(q, 'x', -1, '0,50'); update(true); });
  console.log('0,50 da destra:', await dove());
  // forma e misure dal pannello
  await p.evaluate(() => { ui.sel = {k:'pil', id:piano().pil[0].id}; draw(); renderSide(); });
  await p.fill('[data-pi="a"]', '0,40'); await p.fill('[data-pi="b"]', '0,50'); await p.waitForTimeout(200); console.log('0,40 × 0,50:', await dove(), await stanza());
  await p.selectOption('[data-pi="f"]', 't'); await p.waitForTimeout(200); await p.fill('[data-pi="d"]', '0,40'); await p.waitForTimeout(200); console.log('tondo 0,40:', await dove(), await stanza());
  await p.screenshot({path:require('path').join(OUT, 'pilastro-tondo.png')});
  // metà dentro il muro: si toglie solo la parte dentro l'ambiente
  await p.evaluate(() => { const q = piano().pil[0]; Object.assign(q, {f:'r', a:'0,40', b:'0,40'}); const c = G.comps.find(c => c.room); q.x = c.bbox[0] - 0.2; q.y = c.bbox[1] + 1; anchorStair(piano(), q, false); update(true); });
  console.log('mezzo nel muro:', await stanza());
  // script: contorno e pieno, quote solo delle distanze scritte
  await p.evaluate(() => { const q = piano().pil[0], c = G.comps.find(c => c.room); q.x = c.bbox[0] + 1; q.y = c.bbox[1] + 1; anchorStair(piano(), q, false); setPilDist(q, 'x', 1, '1,00'); update(true); });
  const conta = () => p.evaluate(() => { const s = genScript(piano()); return {pieno:(s.match(/_\.SOLID/g) || []).length, disco:(s.match(/_\.DONUT/g) || []).length, cerchio:(s.match(/_\.CIRCLE/g) || []).length, quote:(s.match(/_\.?DIMLINEAR/gi) || []).length, commento:/; ---- pilastri/.test(s)}; });
  console.log('script rettangolare:', await conta());
  await p.evaluate(() => { piano().pil[0].f = 't'; update(true); }); console.log('script tondo:', await conta()); console.log('senza distanza scritta:', await p.evaluate(() => { const q = piano().pil[0], m = q.anc.x.m; delete q.anc.x.m; update(true); const n = (genScript(piano()).match(/_.?DIMLINEAR/gi) || []).length; q.anc.x.m = m; update(true); return n; }));
  console.log('scheda PDF col pilastro:', await p.evaluate(() => /class="pil"/.test(schedaPiante()[0].svg)));
  console.log('layer muri perimetrali spento:', await p.evaluate(() => { lSet('P', 'off', true); draw(); const r = document.querySelectorAll('#svg .pil').length; lSet('P', 'off', false); draw(); return [r, document.querySelectorAll('#svg .pil').length]; }));
  await p.waitForTimeout(1500); await p.reload(); await p.waitForTimeout(600); await p.evaluate(() => { tab = 'pianta'; render(); update(true); });
  console.log('riaperta:', await p.evaluate(() => R.id), await dove(), await stanza());
  // appoggiato al muro di sopra: 0,00 da quel lato (si può correggere), il lato lontano non si chiede
  const contro = () => p.evaluate(() => { const q = piano().pil[0]; ui.sel = {k:'pil', id:q.id}; draw(); return {caselle:measItems().filter(x => x.pil && x.hb && x.hb.ax === 'y').map(x => x.hb.s + ':' + x.st + ':' + f2(x.val)), chieste:guideList().filter(x => x.hb.kind === 'pil' && x.hb.ax === 'y').length}; });
  await p.evaluate(() => { const q = piano().pil[0], c = G.comps.find(c => c.room).bbox; q.anc = null; q.y = c[3] - 0.5; snapStair(q); q.y = c[3] - (pilBox(q)[3] - pilBox(q)[1]); anchorStair(piano(), q, false); update(true); ui.mode = 'select'; fit(); draw(); });
  console.log('contro il muro sopra:', await contro());
  await scrivi('y', -1, '0,20'); console.log('corretta:', await contro());
  // il tasto «Perimetrali» dopo un pilastro disegna ancora i muri; una porta accanto al pilastro resta toccabile
  await p.reload(); await p.waitForTimeout(600); await p.evaluate(() => { tab = 'pianta'; render(); update(true); }); await p.waitForTimeout(200);
  const tasto = () => p.evaluate(() => ({modo:ui.mode, posa:ui.placeSc || '', tasto:document.querySelector('[data-g="muri"] [data-fly] span').textContent}));
  await p.click('[data-g="muri"] [data-fly]'); await p.waitForTimeout(200); console.log('primo tocco su «Perimetrali»:', await tasto());
  await p.click('[data-g="muri"] .tfly [data-pil]'); await p.waitForTimeout(150); console.log('scelto Pilastro:', await tasto());
  await p.click('[data-pil]', {force:true}).catch(() => {}); await p.evaluate(() => { ui.placeSc = false; ui.mode = 'select'; updTools(); }); await p.waitForTimeout(150);
  await p.click('[data-g="muri"] [data-fly]'); await p.waitForTimeout(200); console.log('poi di nuovo «Perimetrali»:', await tasto());
  await p.evaluate(() => { ui.mode = 'select'; closeFly(); updTools(); });
  // finestra di selezione ed eliminazione
  console.log('eliminato con la selezione a finestra:', await p.evaluate(() => { ui.mode = 'select'; fit(); draw(); const b = pilBox(piano().pil[0]); winSelect([SX(b[0] - 0.1), SY(b[3] + 0.1)], [SX(b[2] + 0.1), SY(b[1] - 0.1)]); const k = ui.sel && ui.sel.k; if (k === 'pil') { renderSide(); document.querySelector('#bDelPil').click(); } else if (k === 'm') delMulti(); return [k, piano().pil.length, f2(cArea(G.comps.find(c => c.room)))]; }));
  console.log('errors', errs); await b.close();
})();
