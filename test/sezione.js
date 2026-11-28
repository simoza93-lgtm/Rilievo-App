// Sezioni: due linee al massimo, scheda a parte, solai e altezze, muri tagliati, porte e finestre nel taglio, verso girato = sezione specchiata.
const APP = require('url').pathToFileURL(require('path').resolve(__dirname, '..', 'index.html')).href;
const OUT = require('path').join(__dirname, 'out'); require('fs').mkdirSync(OUT, {recursive: true});
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({viewport:{width:1400, height:950}});
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto(process.argv[2] || APP); await p.evaluate(() => localStorage.clear()); await p.reload();
  const prep = await p.evaluate(() => { R = blank(); R.id = 'se'; R.nome = 'Prova sezioni'; tab = 'pianta'; render(); let pl = piano(); ui.view = {x:-1, y:-1, s:60}; G = geometry(pl);
    const st = (pts, tipo) => { ui.newType = tipo; const sp = []; for (let i = 0; i < pts.length - 1; i++) { const a = pts[i], c = pts[i + 1]; for (let k = 0; k < 8; k++) sp.push([SX(a[0] + (c[0] - a[0]) * k / 8), SY(a[1] + (c[1] - a[1]) * k / 8)]); } sp.push([SX(pts[pts.length - 1][0]), SY(pts[pts.length - 1][1])]); finishStroke(sp); };
    ui.mode = 'select'; st([[0,0],[10,0],[10,4],[0,4],[0,0]], 'P'); st([[3,0],[3,4]], 'T'); update(true);
    const tr = pl.walls.find(w => w.tipo === 'T'); tr.ap = [{id:uid(), tipo:'porta', d:'1,50', l:'0,90', h:'2,10', dav:'0', inv:false}];
    const pe = pl.walls.find(w => w.tipo === 'P' && isH(nd(pl, w.a), nd(pl, w.b)) && nd(pl, w.a).y > 3); pe.ap = [{id:uid(), tipo:'finestra', d:'1,00', l:'1,20', h:'1,40', dav:'0,90', inv:false}];
    pl.sol = '0,30'; pl.nome = 'Piano terra'; update(true);
    // piano sopra: stessa forma, solaio 0,25, altezze 2,60
    R.piani.push(JSON.parse(JSON.stringify(Object.assign({}, pl, {id:uid(), nome:'Piano primo', sol:'0,25'})))); R.piani[1].rooms.forEach(r => r.H = '2,60'); R.piani[1].rooms.forEach(r => r.H = '2,60'); R.cur = 0; update(true);
    return {piani:R.piani.length, stanze:R.piani.map(p => p.rooms.length)}; });
  console.log('rilievo', JSON.stringify(prep));
  // linea di sezione col tool: due tocchi
  await p.evaluate(() => { fit(); draw(); }); await p.click('[data-fly="quota"]').catch(() => {}); await p.click('[data-mode="sez"]'); await p.waitForTimeout(150);
  const tocca = async (wx, wy) => { const r = await p.evaluate(([wx, wy]) => { const b = document.querySelector('#svg').getBoundingClientRect(); return [b.left + SX(wx), b.top + SY(wy)]; }, [wx, wy]); await p.mouse.click(r[0], r[1]); await p.waitForTimeout(150); };
  await tocca(-1, 2); await tocca(11, 2.3);
  console.log('linea', JSON.stringify(await p.evaluate(() => ({n:R.sez.length, a:R.sez[0].a, b:R.sez[0].b, v:R.sez[0].v, mode:ui.mode, sel:ui.sel && ui.sel.k}))));
  // seconda e terza
  await p.click('[data-fly="quota"]').catch(() => {}); await p.click('[data-mode="sez"]'); await tocca(5, -1); await tocca(5.2, 5);
  await p.click('[data-fly="quota"]').catch(() => {}); await p.click('[data-mode="sez"]'); await tocca(1, 1); await tocca(2, 1);
  console.log('dopo la terza', JSON.stringify(await p.evaluate(() => ({n:R.sez.length, a:R.sez[1].a, b:R.sez[1].b, mode:ui.mode}))));
  const num2 = v => +v.toFixed(2);
  const dati = () => p.evaluate(() => { const r2 = v => +v.toFixed(2); const d = sezioneDati(R.sez[0]); return {L:r2(d.L), zmin:r2(d.zmin), zmax:r2(d.zmax), piani:d.piani.map(q => ({nome:q.nome, zf:r2(q.zf), zc:r2(q.zc), Hn:r2(q.Hn), sol:r2(q.sol), solP:q.solP, muri:q.muri.map(m => m.map(r2)), aps:q.aps.map(a => ({t:[r2(a.t0), r2(a.t1)], z:[r2(a.z0), r2(a.z1)], tipo:a.tipo, p:a.p})), amb:q.amb.map(a => ({n:a.nome, t:[r2(a.t0), r2(a.t1)], H:r2(a.H)})), e:q.e && q.e.map(r2)}))}; });
  const d1 = await dati(); console.log('sezione A', JSON.stringify(d1));
  await p.evaluate(() => { R.sez[0].v = -1; }); const d2 = await dati();
  console.log('girata', JSON.stringify(d2.piani[0].muri), JSON.stringify(d1.piani[0].muri), 'stessa lunghezza', d2.L === d1.L, '| muri specchiati', JSON.stringify(d1.piani[0].muri.map(m => [num2(d1.L - m[1]), num2(d1.L - m[0])]).reverse()) === JSON.stringify(d2.piani[0].muri));
  // pagina della sezione e scheda nel rilievo
  await p.evaluate(() => { R.sez[0].v = 1; ui.sel = null; vai('prj'); }); await p.waitForTimeout(300);
  console.log('scheda nel rilievo', JSON.stringify(await p.evaluate(() => ({titolo:[...document.querySelectorAll('.cardh')].map(x => x.textContent.trim().slice(0, 12)), mini:document.querySelectorAll('.sezmini svg').length}))));
  await p.screenshot({path:require('path').join(OUT, 'sezione-prj.png')});
  await p.click('.sezmini'); await p.waitForTimeout(300);
  console.log('pagina', JSON.stringify(await p.evaluate(() => ({tab, svg:!!document.querySelector('#sezsvg'), rect:document.querySelectorAll('#sezsvg rect').length, testi:[...document.querySelectorAll('#sezsvg text')].map(t => t.textContent)}))));
  await p.screenshot({path:require('path').join(OUT, 'sezione-pagina.png')});
  await p.evaluate(() => indietro()); await p.waitForTimeout(200); console.log('indietro', await p.evaluate(() => tab));
  console.log('errors', errs); await b.close();
})();
