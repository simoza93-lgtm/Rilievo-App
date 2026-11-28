const APP = require('url').pathToFileURL(require('path').resolve(__dirname, '..', 'index.html')).href;
const { chromium } = require('playwright');
// Importa DXF, correzioni: nomi dei layer, layer spenti, scelte ricordate, anteprima con coordinate lontane, più piante nello stesso file (gruppi e nome dal testo),
// avvisi (muri a linea sola, tratti curvi, gradini obliqui), codifica dei DXF vecchi, velocità, scale di righe in ogni verso
const dxf = (layers, ents, testa) => { const o = testa ? ['999', testa] : []; const g = (c, v) => o.push(String(c), String(v));
  g(0, 'SECTION'); g(2, 'TABLES'); g(0, 'TABLE'); g(2, 'LAYER'); g(70, layers.length);
  layers.forEach(([n, c, fl]) => { g(0, 'LAYER'); g(2, n); g(70, fl || 0); g(62, c); g(6, 'Continuous'); });
  g(0, 'ENDTAB'); g(0, 'ENDSEC'); g(0, 'SECTION'); g(2, 'ENTITIES'); ents.forEach(e => e(g)); g(0, 'ENDSEC'); g(0, 'EOF'); return o.join('\n'); };
const LW = (l, pts, closed, bul) => g => { g(0, 'LWPOLYLINE'); g(8, l); g(90, pts.length); g(70, closed ? 1 : 0); pts.forEach((p, i) => { g(10, p[0]); g(20, p[1]); if (bul && bul[i]) g(42, bul[i]); }); };
const LN = (l, a, b) => g => { g(0, 'LINE'); g(8, l); g(10, a[0]); g(20, a[1]); g(11, b[0]); g(21, b[1]); };
const TX = (l, p, s) => g => { g(0, 'TEXT'); g(8, l); g(10, p[0]); g(20, p[1]); g(40, 0.2); g(1, s); };
const rc = (x0, y0, x1, y1) => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];
const casa = (dx, dy) => [LW('MURI', rc(dx, dy, dx + 10, dy + 7), true), LW('MURI', rc(dx + 0.3, dy + 0.3, dx + 9.7, dy + 6.7), true), LW('TRAMEZZI', rc(dx + 4.95, dy + 0.3, dx + 5.05, dy + 6.7), true)];
const LY = [['MURI', 7], ['TRAMEZZI', 2], ['INFISSI', 1]];
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({viewport:{width:1400, height:950}});
  const errs = []; p.on('pageerror', e => errs.push(e.message)); let dlgMsg = '', dlgOk = true; p.on('dialog', d => { dlgMsg = d.message(); (dlgOk ? d.accept('Piano primo') : d.dismiss()).catch(() => {}); });
  await p.goto(APP); await p.evaluate(() => localStorage.clear()); await p.reload(); await p.evaluate(() => { tab = 'pianta'; render(); }); /* dal menu al disegno */
  const out = {};
  const apri = async (nome, txt, enc) => { await p.evaluate(() => { const d = document.querySelector('#dDxf'); if (d.open) d.close(); }); await p.setInputFiles('#fDxf', {name:nome, mimeType:'application/dxf', buffer:Buffer.from(txt, enc || 'utf8')}); await p.waitForSelector('#dDxf[open]'); };
  const testo = () => p.evaluate(() => document.querySelector('#dDxf').innerText);
  // nomi dei layer veri: infissi, scale, quote e arredi da ignorare, layer dello studio
  out.nomi = await p.evaluate(() => [['PLAN_INFISSI_TESTI', 1], ['PLAN_MURI_PERIM', 7], ['PLAN_MURI_INT', 2], ['PORTE', 3], ['FINESTRE', 4], ['SERRAMENTI', 5], ['A-DOOR', 3], ['WINDOW', 4], ['SCALE', 3], ['SCALA_1', 5], ['QUOTE', 3], ['DS_ST_quote 1_50', 130], ['TESTI', 2], ['ARREDI', 1], ['CARTIGLIO', 7], ['HATCH', 7], ['VERDE prato', 130], ['0', 7], ['Defpoints', 7], ['A-WALL', 7], ['MURI', 7], ['muri 10', 2], ['SUPPORTO', 3], ['PORTICO', 3], ['Muri 30', 7]].map(([n, c]) => n + ':' + dxfGrp(n, c)));
  out.spento = await p.evaluate(() => [dxfGrp('MURI_VECCHI', 7, true), dxfGrp('MURI_INT_VECCHI', 2, true), dxfGrp('MURI', 7, false)]);
  // anteprima con le coordinate vere di un DXF (migliaia di metri lontano dall'origine): i muri riempiono il disegno
  await apri('lontana.dxf', dxf(LY, casa(2045, 1270))); await p.click('#dxAv'); await p.waitForSelector('#dxCrea');
  out.lontana = await p.evaluate(() => { const v = document.querySelector('#dDxf svg').getAttribute('viewBox').split(' ').map(Number); return {larghezza:v[2], altezza:v[3]}; });
  // scelte ricordate: solo quelle cambiate a mano
  out.ricordoNessuno = await p.evaluate(() => dxfSaved());
  await apri('layer.dxf', dxf(LY, casa(0, 0))); await p.selectOption('[data-dl="TRAMEZZI"]', 'P'); await p.click('#dxAv'); await p.waitForSelector('#dxCrea');
  out.ricordoUno = await p.evaluate(() => dxfSaved());
  await p.evaluate(() => localStorage.removeItem('rilievo-dxf-layer2'));
  // due piante nello stesso file, con il nome scritto sotto ciascuna
  const due = casa(0, 0).concat(casa(20, 0), [TX('TESTI', [4, -1.5], 'PIANO TERRA'), TX('TESTI', [24, -1.5], 'PIANO PRIMO'), TX('TESTI', [10, -3], 'Scala 1:100')]);
  await apri('due.dxf', dxf(LY.concat([['TESTI', 2]]), due)); await p.click('#dxAv'); await p.waitForSelector('#dxCrea');
  out.gruppi = await p.evaluate(() => ({n:dxfS.gr.length, nomi:dxfS.gr.map(g => g.nome), muri:dxfS.gr.map(g => [...g.ids].length), numeriNelDisegno:[...document.querySelectorAll('#dDxf svg text')].map(t => t.textContent)}));
  await p.click('[data-gr="0"]'); out.primo = await p.evaluate(() => ({scartati:dxfS.off.size, solo:dxfS.solo}));
  await p.click('#dxCrea'); await p.waitForTimeout(300);
  const coord = () => p.evaluate(() => { const pl = piano(); return pl.nodes.map(n => n.x.toFixed(2) + ';' + n.y.toFixed(2)).sort().join(' '); });
  const c1 = await coord(); out.nuovoRilievo = await p.evaluate(() => ({muri:piano().walls.length, piani:R.piani.length}));
  await apri('due.dxf', dxf(LY.concat([['TESTI', 2]]), due)); await p.click('#dxAv'); await p.waitForSelector('#dxCrea'); await p.click('[data-gr="1"]');
  dlgMsg = ''; await p.click('#dxPiano'); await p.waitForTimeout(300);
  out.secondoPiano = await p.evaluate(() => ({piani:R.piani.map(x => x.nome + ':' + x.walls.length)})); out.proposta = dlgMsg;
  const c2 = await p.evaluate(() => { const pl = R.piani[1]; return pl.nodes.map(n => n.x.toFixed(2) + ';' + n.y.toFixed(2)).sort().join(' '); });
  out.sovrapposti = c1 === c2;
  // senza gruppi scelti l'origine resta quella del primo DXF (piani dello stesso disegno sovrapposti per coordinate)
  // muri a linea sola: nessun muro e avviso chiaro
  await apri('asse.dxf', dxf(LY, [LW('MURI', rc(0, 0, 10, 7), true), LW('TRAMEZZI', [[5, 0], [5, 7]], false)])); await p.click('#dxAv'); await p.waitForSelector('#dxCrea');
  out.asse = {avviso:/Non ho trovato muri/.test(await testo()), creaDisattivo:await p.evaluate(() => document.querySelector('#dxCrea').disabled)};
  // muro curvo
  await apri('curvo.dxf', dxf(LY, [LW('MURI', [[0, 0], [10, 0], [10, 7], [5, 9], [0, 7]], true, [0, 0, 0, 0.4, 0]), LW('MURI', [[0.3, 0.3], [9.7, 0.3], [9.7, 6.7], [5, 8.5], [0.3, 6.7]], true, [0, 0, 0, 0.4, 0])])); await p.click('#dxAv'); await p.waitForSelector('#dxCrea');
  out.curvo = /tratti curvi/.test(await testo());
  // gradini obliqui: nessuna scala, avviso
  await apri('obl.dxf', dxf(LY, casa(0, 0).concat(Array.from({length:10}, (_, i) => { const q = a => [3 + (a[0] - 3) * Math.cos(0.5) - (a[1] - 3) * Math.sin(0.5), 3 + (a[0] - 3) * Math.sin(0.5) + (a[1] - 3) * Math.cos(0.5)]; return LN('TRAMEZZI', q([1 + i * 0.28, 1.5]), q([1 + i * 0.28, 2.5])); })))); await p.click('#dxAv'); await p.waitForSelector('#dxCrea');
  out.obliqua = {scale:await p.evaluate(() => dxfS.res.scale.length), avviso:/non formano una scala dritta/.test(await testo())};
  // codifica: DXF vecchio in Windows-1252 con una lettera accentata nel nome del layer; commento 999 in testa
  await apri('vecchio.dxf', dxf([['MURI_PERIM_perimetràli', 7]].concat(LY.slice(1)), [LW('MURI_PERIM_perimetràli', rc(0, 0, 10, 7), true), LW('MURI_PERIM_perimetràli', rc(0.3, 0.3, 9.7, 6.7), true)], 'Creato da un altro programma'), 'latin1');
  out.codifica = await p.evaluate(() => Object.keys(dxfS.P.layers).filter(n => /perimetr/.test(n)));
  // velocità: tante linee oblique su un layer di muri (prima: oltre 200 secondi con 6000); sopra 8000 linee l'app chiede conferma
  const ob = n => Array.from({length:n}, (_, i) => LN('MURI', [i * 0.01, 0], [i * 0.01 + 1, 1.5]));
  out.veloce = await p.evaluate(async txt => { const P = dxfParse(txt), t0 = performance.now(); dxfMuri(P.segs, dxfProposta(P.layers), 1, P.arcs); return {righe:P.segs.length, sotto10s:performance.now() - t0 < 10000}; }, dxf(LY, casa(0, 0).concat(ob(3000))));
  dlgOk = false; dlgMsg = ''; await apri('troppe.dxf', dxf(LY, casa(0, 0).concat(ob(9000)))); await p.click('#dxAv'); await p.waitForTimeout(300);
  out.troppe = {chiesto:/linee/.test(dlgMsg), restaAlPasso1:await p.evaluate(() => !!document.querySelector('#dxAv'))}; dlgOk = true;
  // scale di righe in ogni verso: n, passo, larghezza e ingombro dell'app uguali al disegno (layer SCALE: va con i tramezzi)
  const rampa = (o) => { const S = [], c = Math.round(Math.cos(o.rot * Math.PI / 180)), sn = Math.round(Math.sin(o.rot * Math.PI / 180)), pt = (s, t) => [o.x + s * c - t * sn, o.y + s * sn + t * c];
    for (let i = 0; i < o.n; i++) S.push(LN('SCALE', pt(i * o.p, 0), pt(i * o.p, o.b))); return S; };
  out.scale = [];
  for (const o of [{x:0.6, y:3, rot:0, n:12, p:0.28, b:1}, {x:3, y:1, rot:90, n:12, p:0.28, b:1}, {x:4.6, y:3, rot:180, n:12, p:0.28, b:1}, {x:3, y:6, rot:270, n:14, p:0.25, b:0.8}, {x:0.6, y:3, rot:0, n:4, p:0.28, b:1}, {x:0.6, y:2, rot:0, n:16, p:0.28, b:1.6}]) {
    await apri('scala.dxf', dxf(LY.concat([['SCALE', 3]]), casa(0, 0).concat(rampa(o)))); await p.click('#dxAv'); await p.waitForSelector('#dxCrea'); await p.click('#dxCrea'); await p.waitForTimeout(250);
    out.scale.push(await p.evaluate(o => { const pl = piano(), st = (pl.stairs || []), bb = st[0] ? stairPrims(st[0]).bbox : null; const esp = [(o.rot % 180 === 0 ? (o.n - 1) * o.p : o.b), (o.rot % 180 === 0 ? o.b : (o.n - 1) * o.p)];
      return {rot:o.rot, scale:st.length, n:st[0] && st[0].n, p:st[0] && st[0].p, b:st[0] && st[0].b, ingombroUguale:bb ? Math.abs(bb[2] - bb[0] - esp[0]) < 0.011 && Math.abs(bb[3] - bb[1] - esp[1]) < 0.011 : false, muri:pl.walls.length}; }, o)); }
  // scala a U (due rampe affiancate con pianerottolo): una sola scala, non due; le alzate del disegno cadono sulle alzate dell'app in tutti e quattro i versi
  const UO = {'0false':[0.6, 1], '90false':[3, 1], '180false':[3.6, 3], '270false':[0.6, 5], '0true':[3.6, 1]};   // origini scelte perché la scala non tocchi il tramezzo a x = 5
  const uScala = (rot, spec) => { const p = 0.28, n1 = 11, n2 = 9, b1 = 1.07, b2 = 0.93, g = 0.25, L1 = (n1 - 1) * p, S = [], c = Math.round(Math.cos(rot * Math.PI / 180)), sn = Math.round(Math.sin(rot * Math.PI / 180)), P = (s, t) => { const x = spec ? -s : s; const O = UO[rot + '' + spec]; return [O[0] + x * c - t * sn, O[1] + x * sn + t * c]; };
    for (let i = 0; i < n1; i++) S.push(LN('SCALE', P(i * p, 0), P(i * p, b1)));
    for (let j = 0; j < n2; j++) S.push(LN('SCALE', P(L1 - j * p, b1 + g), P(L1 - j * p, b1 + g + b2)));
    return S; };
  const uMedi = (rot, spec) => { const p = 0.28, n1 = 11, n2 = 9, b1 = 1.07, b2 = 0.93, g = 0.25, L1 = (n1 - 1) * p, M = [], c = Math.round(Math.cos(rot * Math.PI / 180)), sn = Math.round(Math.sin(rot * Math.PI / 180)), P = (s, t) => { const x = spec ? -s : s; const O = UO[rot + '' + spec]; return [O[0] + x * c - t * sn, O[1] + x * sn + t * c]; };
    for (let i = 0; i < n1; i++) M.push(P(i * p, b1 / 2)); for (let j = 0; j < n2; j++) M.push(P(L1 - j * p, b1 + g + b2 / 2)); return M; };
  out.scalaU = [];
  for (const [rot, spec] of [[0, false], [90, false], [180, false], [270, false], [0, true]]) {
    await apri('u.dxf', dxf(LY.concat([['SCALE', 3]]), casa(0, 0).concat(uScala(rot, spec)))); await p.click('#dxAv'); await p.waitForSelector('#dxCrea');
    const src = await p.evaluate(() => dxfS.res.scale.map(c => ({U:!!c.U, n:c.n, n1:c.n1, b1:+(c.b1 || 0).toFixed(2), b2:+(c.b2 || 0).toFixed(2), g:+(c.g || 0).toFixed(2)})));
    await p.click('#dxCrea'); await p.waitForTimeout(250);
    out.scalaU.push({rot, specchio:spec, trovate:src, creata:await p.evaluate(M => { const st = piano().stairs || [], pr = st[0] ? stairPrims(st[0]).ris : [], nm = [Math.min(...piano().nodes.map(n => n.x)), Math.min(...piano().nodes.map(n => n.y))], o = [R.dxo[0] - nm[0], R.dxo[1] - nm[1]], err = Math.max(...M.map(m => Math.min(...pr.map(r => Math.hypot((r.a[0] + r.b[0]) / 2 - (m[0] - o[0]), (r.a[1] + r.b[1]) / 2 - (m[1] - o[1])))))); return {scale:st.length, tipo:st[0].tipo, n:st[0].n, n1:st[0].n1, b:st[0].b, b2:st[0].b2, g:st[0].g, p:st[0].p, alzateSulDisegno:err < 0.05}; }, uMedi(rot, spec))}); }
  console.log(JSON.stringify(out, null, 1)); console.log('errors', errs); await b.close(); })();
