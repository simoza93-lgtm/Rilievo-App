const APP = require('url').pathToFileURL(require('path').resolve(__dirname, '..', 'index.html')).href;
const OUT = require('path').join(__dirname, 'out'); require('fs').mkdirSync(OUT, {recursive: true});
const { chromium } = require('playwright');
// obliqui tappa 3: porte e finestre sui muri obliqui. Posa col tasto sul muro obliquo, parziali lungo la faccia (caselle in pianta),
// ultima parziale di controllo, larghezza, incassata e strombata, porta, Rendi obliquo con le parziali già prese, script
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({viewport:{width:1400,height:950}});
  const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  await p.goto(process.argv[2] || APP); await p.evaluate(()=>localStorage.clear()); await p.reload();
  const prep = `R = blank(); R.id='ao'; tab='pianta'; render(); var pl = piano(); ui.view={x:-1,y:-1,s:80}; G = geometry(pl);
    var st = (pts, tipo) => { ui.newType = tipo; const sp = []; for (let i = 0; i < pts.length - 1; i++) { const a = pts[i], c = pts[i+1]; for (let k = 0; k < 8; k++) sp.push([SX(a[0] + (c[0]-a[0])*k/8), SY(a[1] + (c[1]-a[1])*k/8)]); } sp.push([SX(pts[pts.length-1][0]), SY(pts[pts.length-1][1])]); finishStroke(sp); };
    var r3 = v => +v.toFixed(3); ui.mode = 'select'; updTools();`;
  const box = async () => p.evaluate(()=>{ const r = $('#svg').getBoundingClientRect(); return [r.left, r.top]; });
  const keys = async ks => { for (const k of ks) await p.click(`#inl [data-k="${k}"]`); await p.click('#inl [data-k="ok"]'); await p.waitForTimeout(150); };
  const info = () => p.evaluate(() => { const pl = piano(), w = pl.walls.find(w => w.obl), o = G.ops.find(o => o.w === w), I = o && o.I, ch = (G.ochains || []).filter(c => c.w === w);
    return o ? {aperture:(w.ap || []).length, tipo:o.ap.tipo, quad:!!o.q, dallaFaccia:+(o.s0 - I.fa[ch[0].sg]).toFixed(3), larghezza:+(o.s1 - o.s0).toFixed(3), lati:ch.length,
      tratti:ch[0].pcs.map(pc => [+pc.len.toFixed(2), pc.meas >= 0 ? pc.meas : null]), avvisi:G.warns.map(x => x.t).filter(t => /obliquo/i.test(t)), errori:G.errs.map(x => x.t),
      area:+G.comps.filter(c => c.room)[0].area.toFixed(3)} : {aperture:(w.ap || []).length}; });
  const out = {};
  // 1) trapezio: il lato destro è obliquo; finestra posata col tasto a metà del muro obliquo
  await p.evaluate(new Function(prep + `st([[0,0],[6,0],[5,4],[0,4],[0,0]], 'P'); update(true); draw();`));
  await p.click('[data-cat="finestre"]'); await p.click('#appan [data-ap="finestra"]');
  { const bx = await box(), s = await p.evaluate(() => [SX(5.5), SY(2)]); await p.mouse.move(bx[0] + s[0] - 20, bx[1] + s[1]); await p.mouse.down(); await p.mouse.move(bx[0] + s[0], bx[1] + s[1], {steps:4});
    out.fantasma = await p.evaluate(() => ui.ghost && !ui.ghost.free ? {obliquo:!!ui.ghost.I.obl, ok:ui.ghost.ok} : null); await p.mouse.up(); await p.waitForTimeout(150); }
  out.posata = await info();
  // 2) caselle in pianta: prima parziale (dallo spigolo in basso) 0,80 e larghezza 1,20 toccando le caselle
  const tapHb = async (kind, last) => { const r = await p.evaluate(([kind, last]) => { const pl = piano(), w = pl.walls.find(w => w.obl); ui.sel = {k:'w', id:w.id}; draw();
      const it = ui.pbb.find(x => x.hb.kind === kind && (kind !== 'p' || !!x.hb.last === last) && (x.hb.wid === w.id || (x.hb.ap && w.ap.some(a => a.id === x.hb.ap)))); if (!it) return null;
      const b = it.box, cv = $('#svg').getBoundingClientRect(); return [cv.left + b[0] + b[2] / 2, cv.top + b[1] + b[3] / 2]; }, [kind, last]);
    if (!r) return false; await p.mouse.click(r[0], r[1]); await p.waitForTimeout(150); return p.evaluate(() => (document.querySelector('#inl .ms') || {}).textContent || ''); };
  out.casellaP = await tapHb('p', false); await keys(['0', ',', '8']);
  out.casellaW = await tapHb('w', false); await keys(['1', ',', '2']);
  out.misurata = await info();
  // 3) ultima parziale: sbagliata → avviso; giusta → niente avviso
  const lastLen = await p.evaluate(() => { const w = piano().walls.find(w => w.obl), ch = G.ochains.find(c => c.w === w); return ch.pcs[ch.pcs.length - 1].len; });
  out.casellaL = await tapHb('p', true); await keys(['0', ',', '5']);
  out.ultimaSbagliata = (await info()).avvisi;
  await p.evaluate(v => { const pl = piano(), w = pl.walls.find(w => w.obl); pushUndo(); setMeasure(pl, 'l', oKey(w, G.ochains.find(c => c.w === w).sg), f2(v)); update(true); }, lastLen);
  out.ultimaGiusta = (await info()).avvisi;
  out.script = await p.evaluate(() => { const s = genScript(piano()); const m = s.match(/_\.TEXT\r?\n_S\r?\nSTUDIO\r?\n_J\r?\n_BC\r?\n[^\r\n]+\r?\n0\.17\r?\n(-?[\d.]+)\r?\n1\.20/); return {finestra:(s.match(/_.LINE/g) || []).length, angolo:m ? m[1] : null}; });
  await p.click('text=Adatta'); await p.waitForTimeout(150); await p.screenshot({path:OUT + '/apobl_finestra.png'});
  // 4) incassata a scalino e strombata, porta: sul muro obliquo
  out.incassata = await p.evaluate(() => { const pl = piano(), w = pl.walls.find(w => w.obl), ap = w.ap[0]; ap.inc = 'scal'; ap.l2 = '1,60'; ap.lw = G.ops.find(o => o.ap === ap).side; update(true);
    const o = G.ops.find(o => o.ap === ap), r = {parteLarga:!!o.q2, larga:+(o.inc.w1 - o.inc.w0).toFixed(3), errori:G.errs.length}; const mat = () => G.fpolys.reduce((t, poly) => t + poly.reduce((u, rg, k) => { let a = 0; for (let i = 0; i < rg.length - 1; i++) a += rg[i][0] * rg[i + 1][1] - rg[i + 1][0] * rg[i][1]; return u + (k ? -1 : 1) * Math.abs(a / 2); }, 0), 0), a0 = mat(); ap.inc = 'strom'; update(true); r.cuneiTornanoMuro = +(mat() - a0).toFixed(3); ap.inc = ''; delete ap.l2; delete ap.lw; update(true); return r; });
  out.porta = await p.evaluate(() => { const pl = piano(), w = pl.walls.find(w => w.obl); pushUndo(); w.ap[0].tipo = 'porta'; w.ap[0].l = '0,90'; update(true); draw(); const o = G.ops.find(o => o.w === w);
    const r = {anta:!!o.door, raggio:+o.door.r.toFixed(2), archi:(genScript(pl).match(/_.ARC/g) || []).length}; w.ap[0].tipo = 'finestra'; w.ap[0].l = '1,20'; update(true); return r; });
  // 5) muro dritto con finestra e parziale già presa → Rendi obliquo: la parziale passa sulla faccia del muro obliquo
  await p.evaluate(new Function(prep + `st([[0,0],[5,0],[5,4],[0,4],[0,0]], 'P'); update(true);
    const w = pl.walls.find(w => !isH(nd(pl,w.a), nd(pl,w.b)) && nd(pl,w.a).x > 4); w.ap = [{id:uid(), tipo:'finestra', d:'1', l:'1,00', h:'1,40', dav:'0,90', inv:false}]; update(true);
    const r = G.runs.find(r => !r.ext && r.walls.includes(w)); w.ap[0].pos = {k:r.key, v:'1,10', prev:''}; update(true); ui.sel = {k:'w', id:w.id}; renderSide(); window._w = w.id;`));
  out.primaDritto = await p.evaluate(() => { const o = G.ops[0], r = G.runs.find(r => !r.ext && r.walls.includes(o.w)); return +(o.s0 + o.I.a.y - (r.P.y + r.eA)).toFixed(3); });
  await p.click('#bMkObl'); await p.waitForTimeout(150);
  out.dopoObliquo = await p.evaluate(() => { const w = piano().walls.find(x => x.id === window._w), o = G.ops.find(o => o.w === w), ch = G.ochains.find(c => c.w === w);
    return {obliquo:!!w.obl, chiave:w.ap[0].pos && w.ap[0].pos.k.startsWith('o:'), dallaFaccia:+(o.s0 - o.I.fa[ch.sg]).toFixed(3), pannello:!!document.querySelector('#side [data-aprow]'), toast:(document.querySelector('#toast') || {}).textContent || ''}; });
  await p.click('#bMkStr'); await p.waitForTimeout(150);
  out.dopoDritto = await p.evaluate(() => { const w = piano().walls.find(x => x.id === window._w); return {obliquo:!!w.obl, posizione:!!w.ap[0].pos, proposta:!!w.ap[0].dp, aperture:G.ops.length}; });
  // 6) tramezzo obliquo tra due stanze con una porta: parziali dai due lati; la misura guidata le chiede
  out.tramezzo = await p.evaluate(new Function(prep + `st([[0,0],[6,0],[6,4],[0,4],[0,0]], 'P'); st([[2,0],[4,4]], 'T'); update(true);
    const w = pl.walls.find(w => w.obl); w.ap = [{id:uid(), tipo:'porta', d:'1,5', l:'0,80', h:'', dav:'', inv:false, dp:true, lp:true}]; update(true);
    const ch = G.ochains.filter(c => c.w === w), gl = guideList().filter(x => x.k.startsWith('p:o:') || (x.hb.kind === 'w' && x.hb.ap === w.ap[0].id));
    w.ap[0].pos = {k:ch[1].key, v:'1,00', prev:''}; delete w.ap[0].dp; update(true);
    const ch2 = G.ochains.filter(c => c.w === w), o = G.ops.find(o => o.w === w);
    return {obliquo:!!w, lati:ch.length, stanze:ch.map(c => c.comp).sort().join(','), daMisurare:gl.length, dalLato2:+(o.s0 - o.I.fa[ch2[1].sg]).toFixed(3), anta:!!o.door,
      primoTrattoLato1:ch2[0].pcs[0].known, errori:G.errs.length};`));
  await p.click('text=Adatta'); await p.waitForTimeout(150); await p.screenshot({path:OUT + '/apobl_tramezzo.png'});
  // 7) muro obliquo senza lunghezza: le parziali di tutta la faccia (0,80 + 1,20 + 2,10 = 4,10) ne fissano la lunghezza (Pitagora)
  out.catena = await p.evaluate(new Function(prep + `st([[0,0],[6,0],[5,4],[0,4],[0,0]], 'P'); update(true);
    const runs = G.runs.filter(r => !r.ext); setMeasure(pl, 'r', runs.find(r => !r.H && r.walls.some(w => nd(pl,w.a).x < 1)).key, '3,70'); setMeasure(pl, 'r', runs.find(r => r.H && r.sg < 0 && r.walls.some(w => nd(pl,w.a).y > 3)).key, '4,70'); update(true);
    const w = pl.walls.find(w => w.obl); w.ap = [{id:uid(), tipo:'finestra', d:'1', l:'1,20', h:'1,40', dav:'0,90', inv:false, dp:true}]; update(true);
    const sg = G.ochains.find(c => c.w === w).sg, k = oKey(w, sg), prima = r3(G.oblFace.get(w.id).int);
    w.ap[0].pos = {k, v:'0,80', prev:''}; delete w.ap[0].dp; setMeasure(pl, 'l', k, '2,10'); update(true);
    const ob = measItems().find(x => x.hb && x.hb.kind === 'ob');
    return {prima, faccia:r3(G.oblFace.get(w.id).int), avvisi:G.warns.map(x => x.t), lunghezzaRicavata:ob.st};`));
  // 8) muro obliquo già fissato dalle altre misure (lato sotto misurato prima): le parziali che non tornano restano NON APPLICATE
  out.controllo = await p.evaluate(new Function(prep + `st([[0,0],[6,0],[5,4],[0,4],[0,0]], 'P'); update(true);
    const runs = G.runs.filter(r => !r.ext); setMeasure(pl, 'r', runs.find(r => !r.H && r.walls.some(w => nd(pl,w.a).x < 1)).key, '3,70'); setMeasure(pl, 'r', runs.find(r => r.H && r.sg < 0 && r.walls.some(w => nd(pl,w.a).y > 3)).key, '4,70');
    setMeasure(pl, 'r', runs.find(r => r.H && r.sg > 0 && r.walls.some(w => nd(pl,w.a).y < 1)).key, '6,00'); update(true);
    const w = pl.walls.find(w => w.obl); w.ap = [{id:uid(), tipo:'finestra', d:'1', l:'1,20', h:'1,40', dav:'0,90', inv:false, dp:true}]; update(true);
    const sg = G.ochains.find(c => c.w === w).sg, k = oKey(w, sg), faccia = r3(G.oblFace.get(w.id).int);
    w.ap[0].pos = {k, v:'0,80', prev:''}; delete w.ap[0].dp; setMeasure(pl, 'l', k, '1,00'); update(true);
    return {faccia, dopo:r3(G.oblFace.get(w.id).int), avvisi:G.warns.map(x => x.t)};`));
  console.log(JSON.stringify(out, null, 1)); console.log('errors', errs); await b.close(); })();
