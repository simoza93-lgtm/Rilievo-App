const APP = require('url').pathToFileURL(require('path').resolve(__dirname, '..', 'index.html')).href;
const OUT = require('path').join(__dirname, 'out'); require('fs').mkdirSync(OUT, {recursive: true});
const { chromium } = require('playwright');
const FILE = process.argv[2] || require('path').join(__dirname, 'casa-finta.dxf');
// Importa DXF, tappa 1: lettura dei layer, unità, riconoscimento dei muri (coppie parallele, spigoli, T, obliquo, gradini e balcone lasciati da parte), rilievo nuovo senza misure
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({viewport:{width:1400,height:950}});
  const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  await p.goto(APP); await p.evaluate(()=>localStorage.clear()); await p.reload(); await p.evaluate(() => { tab = 'pianta'; render(); }); /* dal menu al disegno */
  const out = {};
  out.layer = await p.evaluate(txt => { const P = dxfParse(txt), g = dxfProposta(P.layers);
    return {layers:Object.keys(P.layers).sort().map(n => [n, P.layers[n].col, P.layers[n].off, P.layers[n].n, g[n]]), segmenti:P.segs.length, blocchi:P.info.insert}; }, require('fs').readFileSync(FILE, 'utf8'));
  out.unita = await p.evaluate(() => { const r = b => dxfUnita(b).opts.map(o => o.k + (o.ok ? '*' : '')).join(' '), q = (w, h) => r({w, h});
    return {metri:q(10, 7), cm:q(1000, 700), mm:q(10000, 7000), troppoPiccolo:q(1, 1)}; });
  // flusso vero: scelta del file, pannello dei layer, anteprima, scarto di un muro, creazione
  await p.setInputFiles('#fDxf', FILE); await p.waitForSelector('#dDxf[open]');
  out.pannello = await p.evaluate(() => ({unita:[...document.querySelectorAll('#dDxf input[name=dxu]')].map(i => i.value + (i.checked ? '*' : '')).join(' '), righe:document.querySelectorAll('#dDxf .dxl').length}));
  await p.click('#dxAv'); await p.waitForSelector('#dxCrea');
  out.muri = await p.evaluate(() => { const r = dxfS.res, t = w => +w.th.toFixed(2), c = v => +v.toFixed(2);
    return {n:r.muri.length, perim:r.muri.filter(w => w.g === 'P').length, tram:r.muri.filter(w => w.g === 'T').length, obliqui:r.muri.filter(w => w.obl).length, scartate:r.sole.length, gradini:r.gradini.length, scale:r.scale.map(c => c.k + " gr passo " + c.th.toFixed(2) + " n" + c.n), fuori:r.fuori.length,
      spessori:[...new Set(r.muri.map(t))].sort(),
      elenco:r.muri.map(w => `${w.g} ${t(w)} (${c(w.p[0])};${c(w.p[1])})-(${c(w.q[0])};${c(w.q[1])})`).sort()}; });
  await p.screenshot({path:OUT + '/dxf_anteprima.png'});
  // tocco un muro: viene scartato, poi lo rimetto
  await p.click('[data-dw]', {force:true}); out.scartato = await p.evaluate(() => dxfS.off.size); await p.click('[data-dw]', {force:true}); out.rimesso = await p.evaluate(() => dxfS.off.size);
  const nR = await p.evaluate(() => arcIndex().length);
  out.infissi = await p.evaluate(() => dxfS.res.inf.map(o => `${o.tipo} ${o.l.toFixed(2)} (${o.c[0].toFixed(2)};${o.c[1].toFixed(2)})`).sort());
  await p.click('#dxCrea'); await p.waitForTimeout(300);
  out.rilievo = await p.evaluate(nR => { const pl = piano(), w = pl.walls; G = geometry(pl);
    return {archivio:[nR, arcIndex().length], piani:R.piani.length, nome:R.nome, muri:w.length, nodi:pl.nodes.length, perimetrali:w.filter(x => x.tipo === 'P').length, tramezzi:w.filter(x => x.tipo === 'T').length, altro:w.filter(x => x.tipo === 'X').map(x => x.sp),
      obliqui:w.filter(x => x.obl).length, misureScritte:w.filter(x => String(x.mis || '').trim() !== '').length, aperture:w.filter(x => (x.ap || []).length).length, apList:w.flatMap(x => (x.ap || []).map(a => `${a.tipo} d${a.d} l${a.l}${a.tipo === 'porta' ? ' cx' + (a.cx ? 1 : 0) + ' vx' + (a.vx ? 1 : 0) : ''}`)).sort(), scale:(pl.stairs || []).length, errori:G.errs.map(e => e.t), avvisi:G.warns.map(e => e.t), ambienti:G.comps.length,
      scollegati:pl.nodes.filter(n => w.filter(x => x.a === n.id || x.b === n.id).length < 2).length}; }, nR);
  await p.click('text=Adatta').catch(() => {}); await p.waitForTimeout(200); await p.screenshot({path:OUT + '/dxf_rilievo.png'});
  // le scelte dei layer restano sul dispositivo
  out.ricordo = await p.evaluate(() => dxfSaved()); 
  // dopo l'import l'app si ricalcola senza errori e il rilievo si può modificare come uno disegnato a mano
  out.dopo = await p.evaluate(() => { update(true); const pl = piano(); return {muri:pl.walls.length, errori:G.errs.length}; });
  // stesso disegno in millimetri; e un perimetro da 0,25 m (non è lo spessore dei perimetrali: nasce un muro con il suo spessore)
  out.mm = await p.evaluate(txt => { const P = dxfParse(txt); P.segs.forEach(s => { s.a = s.a.map(v => v * 1000); s.b = s.b.map(v => v * 1000); }); const u = dxfUnita(dxfBox(P.segs.filter(s => s.l === "PLAN_MURI_PERIM")));
    const r = dxfMuri(P.segs, dxfProposta(P.layers), u.sug); return {fattore:u.sug, muri:r.muri.length, gradini:r.gradini.length}; }, require("fs").readFileSync(FILE, "utf8"));
  out.sp25 = await p.evaluate(() => { const L = (a, b) => ({l:"PLAN_MURI_PERIM", a, b}), s = [L([0, 0], [6, 0]), L([0, 0.25], [6, 0.25]), L([6, 0], [6, 4]), L([5.75, 0.25], [5.75, 3.75]), L([6, 4], [0, 4]), L([5.75, 3.75], [0.25, 3.75]), L([0, 4], [0, 0]), L([0.25, 3.75], [0.25, 0.25])];
    const r = dxfMuri(s, {PLAN_MURI_PERIM:"P"}, 1), n = dxfCrea(r.muri, "x"), w = n.piani[0].walls; return {muri:r.muri.length, tipi:w.map(x => x.tipo + ":" + x.sp).join(" ")}; });
  // un blocco inserito (scala 2, ruotato di 90°) si apre nel disegno sul layer dell'inserimento
  out.blocco = await p.evaluate(() => { const t = ['0','SECTION','2','BLOCKS','0','BLOCK','2','W','10','0','20','0','0','LINE','8','0','10','0','20','0','11','1','21','0','0','ENDBLK','0','ENDSEC','0','SECTION','2','ENTITIES','0','INSERT','8','INF','2','W','10','5','20','2','41','2','42','2','50','90','0','ENDSEC','0','EOF'].join(String.fromCharCode(10));
    return dxfParse(t).segs.map(s => s.l + ' ' + s.a.map(v => +v.toFixed(2)) + '>' + s.b.map(v => +v.toFixed(2))); });
  // un buco di 1 m nel muro senza infissi diventa un varco
  out.varco = await p.evaluate(() => { const L = (a, b) => ({l:'M', a, b}), s = [L([0, 0], [3, 0]), L([0, 0.3], [3, 0.3]), L([4, 0], [8, 0]), L([4, 0.3], [8, 0.3])], r = dxfMuri(s, {M:'P'}, 1); return r.inf.map(o => o.tipo + ' ' + o.l.toFixed(2) + ' (' + o.c.map(v => v.toFixed(2)) + ')'); });
  // scalini d'ingresso: tre «U» annidate sul layer dei tramezzi non sono muri; una «U» sola (testa di muro) resta
  out.scalini = await p.evaluate(() => { const U = pts => pts.flatMap((a, i) => i < 3 ? [{l:'T', a, b:pts[i + 1], u:pts}] : []), M = (a, b) => ({l:'P', a, b});
    const base = [M([0, 0], [8, 0]), M([0, 0.3], [8, 0.3])], gr = [[[2, 0], [2, -0.3], [6, -0.3], [6, 0]], [[1.65, 0], [1.65, -0.6], [6.4, -0.6], [6.4, 0]], [[1.4, 0], [1.4, -0.85], [6.75, -0.85], [6.75, 0]]].flatMap(U), sola = U([[10, 0], [10, -0.15], [12, -0.15], [12, 0]]);
    const n = s => dxfMuri(s, {P:'P', T:'T'}, 1).muri.length; return {senza:n(base), conScalini:n(base.concat(gr)), conUsola:n(base.concat(sola)), senzaRiconoscimento:n(base.concat(gr.map(g => ({l:g.l, a:g.a, b:g.b}))))}; });
  // stesso DXF su «nuovo piano» del rilievo aperto: i muri entrano in un piano nuovo, il resto non cambia
  const nm0 = await p.evaluate(() => ({piani:R.piani.length, muri:R.piani[0].walls.length, id:R.id}));
  p.once('dialog', d => d.accept('Piano primo')); await p.setInputFiles('#fDxf', FILE); await p.waitForSelector('#dDxf[open]'); await p.click('#dxAv'); await p.waitForSelector('#dxPiano'); await p.click('#dxPiano'); await p.waitForTimeout(300);
  out.nuovoPiano = await p.evaluate(m => ({stessoRilievo:R.id === m.id, piani:R.piani.map(x => x.nome + ':' + x.walls.length), muriPianoTerraInvariati:R.piani[0].walls.length === m.muri, era:m.piani}), nm0);
  console.log(JSON.stringify(out, null, 1)); console.log('errors', errs); await b.close(); })();
