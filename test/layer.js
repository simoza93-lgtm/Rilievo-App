const APP = require('url').pathToFileURL(require('path').resolve(__dirname, '..', 'index.html')).href;
const OUT = require('path').join(__dirname, 'out'); require('fs').mkdirSync(OUT, {recursive: true});
const { chromium } = require('playwright');
// layer: pannello «Layer» a destra (👁 acceso/spento, 🔒 bloccato); spento = non si vede e non si tocca; bloccato = si vede ma non si seleziona,
// non si sposta, non si cancella con la gomma; lo script esce sempre completo; lo stato resta nel rilievo
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({viewport:{width:1400,height:950}});
  const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  await p.goto(process.argv[2] || APP); await p.evaluate(()=>localStorage.clear()); await p.reload();
  await p.evaluate(() => { R = blank(); R.id='ly'; tab='pianta'; render(); var pl = piano(); ui.view={x:-1,y:-1,s:70}; G = geometry(pl);
    const st = (pts, tipo) => { ui.newType = tipo; const sp = []; for (let i = 0; i < pts.length - 1; i++) { const a = pts[i], c = pts[i+1]; for (let k = 0; k < 8; k++) sp.push([SX(a[0] + (c[0]-a[0])*k/8), SY(a[1] + (c[1]-a[1])*k/8)]); } sp.push([SX(pts[pts.length-1][0]), SY(pts[pts.length-1][1])]); finishStroke(sp); };
    st([[0,0],[8,0],[8,5],[0,5],[0,0]], 'P'); st([[4,0],[4,5]], 'T'); update(true);
    const t = pl.walls.find(w => w.tipo === 'T'); t.ap = [{id:uid(), tipo:'porta', d:'1', l:'0,80', h:'', dav:'', inv:false}];
    pl.stairs = [Object.assign(newStair('dritta', 0, 0), {x:0.6, y:0.6})]; pl.notes = [{id:uid(), x:6, y:3, t:'NOTA'}]; pl.ink = [{id:uid(), pts:[[5, 1], [7, 1.5]], lin:true}, {id:uid(), pts:[[5, 2], [7, 2]], cs:true}];
    ui.mode = 'select'; updTools(); update(true); draw(); });
  const sv = async (x, y) => p.evaluate(([x, y]) => { const r = $('#svg').getBoundingClientRect(); return [r.left + SX(x), r.top + SY(y)]; }, [x, y]);
  const tap = async (x, y) => { const q = await sv(x, y); await p.mouse.click(q[0], q[1]); await p.waitForTimeout(80); const r = await p.evaluate(() => ui.inl ? 'casella' : ui.sel ? ui.sel.k : null); if (r === 'casella') { await p.keyboard.press('Escape'); await p.waitForTimeout(60); } return r; };
  const svgHas = () => p.evaluate(() => { const h = $('#svg').innerHTML; return {nota:/NOTA/.test(h), muri:(h.match(/stroke="var\(--wP\)"/g) || []).length, tramezzi:(h.match(/stroke="var\(--wI\)"/g) || []).length}; });
  const out = {};
  await p.click('[data-cat="layer"]'); await p.waitForTimeout(80);
  out.pannello = await p.evaluate(() => ({aperto:!$('#appan').hidden, voci:[...document.querySelectorAll('#appan .lyn')].map(e => e.textContent), lucchetti:document.querySelectorAll('#appan [data-lyl]').length}));
  out.prima = await svgHas();
  // tramezzo bloccato: si vede, ma toccandolo non si seleziona; la porta (Porte e finestre) resta toccabile
  await p.click('#appan [data-lyl="I"]'); out.tramezzoBloccato = {tocco:await tap(4, 3.5), vista:(await svgHas()).tramezzi > 0};
  await p.evaluate(() => { ui.sel = null; draw(); });
  // perimetrali spenti: non si vedono, non si toccano
  await p.click('#appan [data-lyv="P"]'); out.perimetraliSpenti = {vista:(await svgHas()).muri, tocco:await tap(8, 1.2)};
  // nota spenta, linea bloccata (gomma e tocco), costruzione spenta
  await p.click('#appan [data-lyv="H"]'); out.notaSpenta = (await svgHas()).nota;
  await p.click('#appan [data-lyl="D"]'); out.lineaBloccata = await tap(6, 1.25);
  out.gomma = await p.evaluate(() => { const n = piano().ink.length; gomAt([SX(6), SY(1.25)], {}); return [n, piano().ink.length]; });
  await p.click('#appan [data-lyv="C"]'); out.costruzione = await p.evaluate(() => ({nascoste:csHidden(), tasto:R.opt.csHide}));
  // scala bloccata: non si sposta e non si seleziona
  await p.click('#appan [data-lyl="S"]'); out.scalaBloccata = await tap(1.05, 1.5);
  // il pannello resta aperto scegliendo un altro strumento
  await p.click('[data-fly="quota"]'); out.restaAperto = await p.evaluate(() => !$('#appan').hidden && ui.apCat === 'layer');
  await p.screenshot({path:OUT + '/layer.png'});
  // lo script esce completo anche con i layer spenti
  await p.evaluate(() => { window._s1 = genScript(piano()); });
  // lo stato resta nel rilievo
  out.salvato = await p.evaluate(() => JSON.parse(JSON.stringify(R.lay)));
  await p.click('#appan [data-lyall="on"]'); await p.click('#appan [data-lyall="free"]');
  out.tutti = await p.evaluate(() => LAYS.map(([id]) => (lOff(id) ? 'off' : '') + (lLk(id) ? 'lk' : '')).join(','));
  out.scriptUguale = await p.evaluate(() => { const s2 = genScript(piano()), n = x => x.replace(/^; .*$/mg, ''); return n(s2) === n(window._s1) && /PLAN_MURI_PERIM/.test(s2); });
  console.log(JSON.stringify(out, null, 1)); console.log('errors', errs); await b.close(); })();
