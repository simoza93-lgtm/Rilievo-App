// Dalla schermata del 26 novembre 2026: niente quota esterna sui muri interni (anche da 0,30) e quote esterne a 1 m dall'elemento più esterno.
const APP = require('url').pathToFileURL(require('path').resolve(__dirname, '..', 'index.html')).href;
const OUT = require('path').join(__dirname, 'out'); require('fs').mkdirSync(OUT, {recursive: true});
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({viewport:{width:1280, height:854}});
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto(process.argv[2] || APP); await p.evaluate(() => localStorage.clear()); await p.reload(); await p.waitForTimeout(300);
  await p.click('#bFull'); await p.waitForTimeout(200);
  await p.evaluate(() => { const st = (pts, tipo) => { ui.newType = tipo; const s = []; for (let i = 0; i < pts.length - 1; i++) { const a = pts[i], c = pts[i + 1]; for (let k = 0; k < 6; k++) s.push([SX(a[0] + (c[0] - a[0]) * k / 6), SY(a[1] + (c[1] - a[1]) * k / 6)]); } s.push([SX(pts[pts.length - 1][0]), SY(pts[pts.length - 1][1])]); finishStroke(s); update(true); };
    R = blank(); R.id = 'qf'; tab = 'pianta'; render(); ui.view = {x:-3, y:-9, s:55}; G = geometry(piano());
    st([[0,0],[7,0],[7,3.5],[0,3.5],[0,0]], 'P'); st([[0,3.5],[0,6],[7,6],[7,3.5]], 'P'); st([[3,3.5],[3,6]], 'T'); st([[7,0],[9,0],[9,6],[7,6]], 'P');
    ui.sel = null; ui.mode = 'select'; ui.fitted = false; render(); fit(); draw(); });
  // distanza di ogni linea di quota esterna dall'elemento più esterno, e se sta tutta nello schermo
  const stato = () => p.evaluate(() => { const E = quoteFuori(piano()).E; return G.facs.map(f => { const n = f.nome + ' ' + f2(f.tot); if (f.interno) return n + ': interna, ' + (ui.fbb.has(f.key) ? 'CON quota' : 'no quota'); const bx = ui.fbb.get(f.key); if (!bx) return n + ': NON disegnata';
      const c = f.H ? WY(bx[1] + bx[3] / 2) : WX(bx[0] + bx[2] / 2), edge = E[f.H ? (f.out > 0 ? 3 : 1) : (f.out > 0 ? 2 : 0)], d = (c - edge) * f.out, dentro = bx[0] >= 0 && bx[1] >= 0 && bx[0] + bx[2] <= ui.W && bx[1] + bx[3] <= ui.H;
      return n + ': a ' + (d >= 0.99 && d <= 1.6 ? 'un metro' : d.toFixed(2)) + ' dal filo ' + f2(edge) + (dentro ? '' : ' FUORI SCHERMO'); }).sort(); });
  console.log('muro in mezzo da 0,30\n  ' + (await stato()).join('\n  '));
  await p.screenshot({path:require('path').join(OUT, 'quotefuori.png')});
  console.log('pannello del muro interno, totali di facciata:', await p.evaluate(() => { const f = G.facs.find(f => f.interno); if (!f) return 'nessun muro interno'; ui.sel = {k:'w', id:f.walls[0].id}; renderSide(); const r = [...document.querySelectorAll('h3')].some(h => /· totali$/.test(h.textContent)); ui.sel = null; renderSide(); return r; }));
  // una scala che sporge a destra sposta le quote di destra oltre di lei
  await p.evaluate(() => { const pl = piano(); (pl.stairs = pl.stairs || []).push(newStair('dritta', 10, 2)); update(true); fit(); draw(); });
  console.log('con una scala fuori a destra\n  ' + (await stato()).filter(x => /destra/.test(x)).join('\n  '));
  // stanza a destra segnata come balcone: il muro verso la casa torna facciata, quotata verso il balcone
  await p.evaluate(() => { piano().stairs = []; update(true); const r = piano().rooms.slice().sort((a, b) => G.comps[b._c].bbox[2] - G.comps[a._c].bbox[2])[0]; r.dest = 'Balcone'; update(true); fit(); draw(); });
  console.log('stanza di destra come balcone\n  ' + (await stato()).join('\n  '));
  await p.screenshot({path:require('path').join(OUT, 'quotefuori-balcone.png')});
  // balcone con ringhiera attaccata sotto un rientro: la quota non conta l'angolo e le due di destra stanno sulla stessa riga
  for (const balcone of [false, true]) console.log(balcone ? 'rientro con balcone' : 'rientro senza balcone', await p.evaluate(balcone => { const st = (pts, tipo) => { ui.newType = tipo; const s = []; for (let i = 0; i < pts.length - 1; i++) { const a = pts[i], c = pts[i + 1]; for (let k = 0; k < 6; k++) s.push([SX(a[0] + (c[0] - a[0]) * k / 6), SY(a[1] + (c[1] - a[1]) * k / 6)]); } s.push([SX(pts[pts.length - 1][0]), SY(pts[pts.length - 1][1])]); finishStroke(s); update(true); };
    R = blank(); R.id = 'qr' + balcone; tab = 'pianta'; render(); ui.view = {x:-3, y:-9, s:55}; G = geometry(piano());
    st([[0,0],[7.3,0],[7.3,5],[10.3,5],[10.3,7],[0,7],[0,0]], 'P'); st([[0,4],[7.3,4]], 'P'); if (balcone) st([[7.3,0.9],[9.3,0.9],[9.3,3.6],[7.3,3.6]], 'W');
    update(true); ui.sel = null; ui.mode = 'select'; ui.fitted = false; render(); fit(); draw(); const q = quoteFuori(piano());
    return G.facs.filter(f => !f.interno && !f.H && f.out > 0).map(f => f.nome + ' ' + f2(f.tot) + ' linea ' + f2(f.a1 - f.a0) + ' riga ' + q.fila.get(f)).sort().join(' | '); }, balcone));
  // sulla facciata spezzata il totale esterno si scrive toccando la quota (pianta col balcone, rimasta dal giro sopra)
  const scrivi = async v => { const q = await p.evaluate(() => { const f = G.facs.find(f => !f.interno && !f.H && f.out > 0 && f2(f.tot) !== '2,30'), bx = ui.fbb.get(f.key), c = [bx[0] + bx[2] / 2, bx[1] + bx[3] / 2], r = document.querySelector('#svg').getBoundingClientRect(); return [r.left + c[0], r.top + c[1]]; });
    await p.mouse.click(q[0], q[1]); await p.waitForTimeout(200); if (!await p.$('#inl')) return console.log('il tocco sulla quota NON apre il tastierino');
    const titolo = await p.textContent('#inl .ms'), canc = await p.$('#inl [data-k="del"]'); for (let i = 0; canc && i < 5; i++) await p.click('#inl [data-k="⌫"]');
    for (const k of v) await p.click(`#inl [data-k="${k}"]`); await p.click('#inl [data-k="ok"]'); await p.waitForTimeout(200); console.log('scritto ' + v + ' da «' + titolo + '»:', await totale()); };
  const totale = () => p.evaluate(() => { const pl = piano(), f = G.facs.find(f => !f.interno && !f.H && f.out > 0 && f.mis > 0); if (!f) return 'nessun totale esterno, interni ' + JSON.stringify(Object.values(pl.faci || {}));
    return 'quota ' + f2(f.mis) + ', dal disegno ' + f2(f.tot) + ', avvisi ' + G.warns.filter(w => /^Verifica esterna/.test(w.t)).length + (nonTorna() ? ', non torna' : ', torna') + ', interni ' + JSON.stringify(Object.values(pl.faci || {})); });
  await scrivi('5,00');
  // con i lati interni già misurati, un totale esterno sbagliato resta una verifica: la pianta non cambia e c'è l'avviso
  await p.evaluate(() => { const pl = piano(), f = G.facs.find(f => !f.interno && !f.H && f.out > 0 && f.mis > 0); setMeasure(pl, 'r', f.ext.key, ''); update(true);
    G.runs.filter(r => r.sg === -f.out && f.walls.includes(r.walls[0])).map(r => [r.key, f2(r.face)]).forEach(([k, v]) => setMeasure(pl, 'r', k, v)); update(true); fit(); draw(); });
  await scrivi('4,60');
  // totale scritto prima, ringhiera aggiunta dopo: resta un totale esterno
  await p.evaluate(() => { const st = (pts, tipo) => { ui.newType = tipo; const s = []; for (let i = 0; i < pts.length - 1; i++) { const a = pts[i], c = pts[i + 1]; for (let k = 0; k < 6; k++) s.push([SX(a[0] + (c[0] - a[0]) * k / 6), SY(a[1] + (c[1] - a[1]) * k / 6)]); } s.push([SX(pts[pts.length - 1][0]), SY(pts[pts.length - 1][1])]); finishStroke(s); update(true); };
    R = blank(); R.id = 'qdopo'; tab = 'pianta'; render(); ui.view = {x:-3, y:-9, s:55}; G = geometry(piano()); st([[0,0],[7.3,0],[7.3,5],[10.3,5],[10.3,7],[0,7],[0,0]], 'P'); st([[0,4],[7.3,4]], 'P'); update(true);
    const f = G.facs.find(f => !f.interno && !f.H && f.out > 0 && f2(f.tot) === '5,00'); setMeasure(piano(), 'r', f.ext.key, '5,00'); update(true);
    st([[7.3,0.9],[9.3,0.9],[9.3,3.6],[7.3,3.6]], 'W'); update(true); fit(); draw(); });
  console.log('ringhiera aggiunta dopo:', await totale());
  // dopo chiusura e riapertura dell'app il totale resta esterno (campo salvato pl.fx)
  await p.waitForTimeout(1500); await p.reload(); await p.waitForTimeout(600);
  await p.evaluate(() => { tab = 'pianta'; render(); update(true); });
  console.log('riaperta:', await p.evaluate(() => R && R.id), await totale(), await p.evaluate(() => JSON.stringify(Object.values(piano().fm || {}).filter(Boolean))));
  // schermata del 27 novembre 2026: terrazzo disegnato con «Superficie» e lasciato «Camera»: i muri verso di lui si quotano
  console.log('superficie attorno alla casa', await p.evaluate(() => { const st = (pts, tipo) => { ui.newType = tipo; const s = []; for (let i = 0; i < pts.length - 1; i++) { const a = pts[i], c = pts[i + 1]; for (let k = 0; k < 6; k++) s.push([SX(a[0] + (c[0] - a[0]) * k / 6), SY(a[1] + (c[1] - a[1]) * k / 6)]); } s.push([SX(pts[pts.length - 1][0]), SY(pts[pts.length - 1][1])]); finishStroke(s); update(true); };
    R = blank(); R.id = 'qsup'; tab = 'pianta'; render(); ui.view = {x:-4, y:-9, s:55}; G = geometry(piano()); st([[0,0],[7,0],[7,5],[0,5],[0,0]], 'P'); st([[3,0],[3,5]], 'T'); st([[7,2.5],[8.6,2.5],[8.6,6.6],[-1.6,6.6],[-1.6,-1.6],[8.6,-1.6],[8.6,2.5]], 'S'); update(true);
    return piano().rooms.map(r => r.dest).join(',') + ' | ' + G.facs.filter(f => !f.interno).map(f => f.nome + ' ' + f2(f.tot)).sort().join(' | '); }));
  console.log('errors', errs); await b.close();
})();
