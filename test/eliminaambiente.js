// «Elimina ambiente»: toglie i muri solo suoi (anche superfici e ringhiere), lascia quelli in comune, si annulla.
const APP = require('url').pathToFileURL(require('path').resolve(__dirname, '..', 'index.html')).href;
const OUT = require('path').join(__dirname, 'out'); require('fs').mkdirSync(OUT, {recursive: true});
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({viewport:{width:1280, height:854}});
  const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('dialog', d => { console.log('FINESTRELLA', d.message()); d.dismiss(); });
  await p.goto(process.argv[2] || APP); await p.evaluate(() => localStorage.clear()); await p.reload(); await p.waitForTimeout(300);
  // casa 6 x 4 divisa in due, terrazzo a «Superficie» sulla destra e ringhiera sotto
  await p.evaluate(() => { R = blank(); R.id = 'ea'; tab = 'pianta'; render(); ui.view = {x:-3, y:-8, s:55}; G = geometry(piano());
    const st = (pts, tipo) => { ui.newType = tipo; const s = []; for (let i = 0; i < pts.length - 1; i++) { const a = pts[i], c = pts[i + 1]; for (let k = 0; k < 6; k++) s.push([SX(a[0] + (c[0] - a[0]) * k / 6), SY(a[1] + (c[1] - a[1]) * k / 6)]); } s.push([SX(pts[pts.length - 1][0]), SY(pts[pts.length - 1][1])]); finishStroke(s); update(true); };
    st([[0, 0], [6, 0], [6, 4], [0, 4], [0, 0]], 'P'); st([[3, 0], [3, 4]], 'T'); st([[6, 4], [9, 4], [9, 0], [6, 0]], 'S'); st([[0, 0], [0, -2], [3, -2], [3, 0]], 'W'); update(true); ui.mode = 'select'; updTools(); });
  const stato = () => p.evaluate(() => { const pl = piano(), n = {}; pl.walls.forEach(w => n[w.tipo] = (n[w.tipo] || 0) + 1); return 'stanze ' + pl.rooms.filter(r => G.comps[r._c].room).map(r => r.nome).sort().join(', ') + ' | muri ' + Object.keys(n).sort().map(k => k + n[k]).join(' '); });
  await p.evaluate(() => { const pl = piano(), nomi = [[1.5, 2, 'Cucina'], [4.5, 2, 'Sala'], [7.5, 2, 'Terrazzo'], [1.5, -1, 'Balcone']]; const o = pl.nodes.reduce((m, q) => [Math.min(m[0], q.x), m[1]], [1e9, 0]);
    const ys = pl.walls.filter(w => w.tipo === 'P').flatMap(w => [nd(pl, w.a).y, nd(pl, w.b).y]), y0 = Math.min(...ys), x0 = Math.min(...pl.walls.filter(w => w.tipo === 'P').map(w => nd(pl, w.a).x));
    nomi.forEach(([x, y, n]) => { const c = G.compAt(x0 + x, y0 + y), r = pl.rooms.find(r => r._c === c); r.nome = n; }); update(true); });
  console.log('prima', await stato());
  const scegli = n => p.evaluate(n => { ui.sel = {k:'r', id:piano().rooms.find(r => r.nome === n).id}; draw(); renderSide(); const t = document.querySelector('#toast'); if (t) t.style.pointerEvents = 'none'; }, n);
  for (const n of ['Terrazzo', 'Balcone', 'Sala']) {
    await scegli(n); await p.screenshot({path:require('path').join(OUT, 'elimina-ambiente.png')}); await p.click('#bDelAmb'); await p.waitForTimeout(150); console.log('eliminato', n + ':', await stato());
    await p.click('#bUndo'); await p.waitForTimeout(150); console.log('  annulla:', await stato()); await scegli(n); await p.click('#bDelAmb'); await p.waitForTimeout(150); }
  // layer delle superfici bloccato o muri tutti in comune: tasto spento
  await p.evaluate(() => { R.lay = {P:{lk:true}, I:{lk:true}}; }); await scegli('Cucina'); console.log('layer bloccati, tasto spento:', await p.isDisabled('#bDelAmb'));
  // stanza interna con fuori marciapiede (a filo) e balcone: via muri esterni e vani, gli esterni restano ambienti
  for (const balcone of [true, false]) {
    await p.evaluate(balcone => { R = blank(); R.id = 'eb'; tab = 'pianta'; render(); ui.view = {x:-3, y:-8, s:55}; G = geometry(piano());
      const st = (pts, tipo) => { ui.newType = tipo; const s = []; for (let i = 0; i < pts.length - 1; i++) { const a = pts[i], c = pts[i + 1]; for (let k = 0; k < 6; k++) s.push([SX(a[0] + (c[0] - a[0]) * k / 6), SY(a[1] + (c[1] - a[1]) * k / 6)]); } s.push([SX(pts[pts.length - 1][0]), SY(pts[pts.length - 1][1])]); finishStroke(s); update(true); };
      st([[0, 0], [6, 0], [6, 4], [0, 4], [0, 0]], 'P'); st([[3, 0], [3, 4]], 'T'); if (balcone) st([[6, 0], [8, 0], [8, 3], [6, 3]], 'W'); st([[0, 0], [0, -2], [6, -2], [6, 0]], 'S'); update(true); ui.mode = 'select'; updTools();
      const pl = piano(), P = pl.walls.filter(w => w.tipo === 'P'), x0 = Math.min(...P.map(w => nd(pl, w.a).x)), y0 = Math.min(...P.flatMap(w => [nd(pl, w.a).y, nd(pl, w.b).y]));
      [[1.5, 2, 'Cucina'], [4.5, 2, 'Sala'], [3, -1, 'Marciapiede']].concat(balcone ? [[7, 1.5, 'Balcone']] : []).forEach(([x, y, n]) => { const c = G.compAt(x0 + x, y0 + y), r = pl.rooms.find(r => r._c === c); r.nome = n; if (n === 'Marciapiede') r.dest = n; });
      P.forEach(w => w.ap.push({id:uid(), tipo:'finestra', d:'0,50', l:'1,00', h:'', hd:''})); update(true);
      G.runs.forEach(r => { const c = G.comps[r.comp0]; if (c && c.rec && r.H && c.rec.nome === 'Marciapiede') pl.fm[r.key] = f2(r.face); }); update(true); }, balcone);
    const q = () => p.evaluate(() => { const pl = piano(), n = {}; pl.walls.forEach(w => n[w.tipo] = (n[w.tipo] || 0) + 1); return pl.rooms.filter(r => G.comps[r._c] && G.comps[r._c].room).map(r => r.nome + ' ' + f2(G.comps[r._c].area)).sort().join(', ') + ' | muri ' + Object.keys(n).sort().map(k => k + n[k]).join(' ') + ' | vani ' + pl.walls.reduce((t, w) => t + w.ap.length, 0) + ' | errori ' + G.errs.length; });
    console.log(balcone ? 'con balcone' : 'senza balcone', await q()); await scegli('Sala'); await p.click('#bDelAmb'); await p.waitForTimeout(150); console.log('  eliminata Sala:', await q()); console.log('  misure:', await p.evaluate(() => Object.values(piano().fm).join(' ') + ' | avviso: ' + document.querySelector('#toast').textContent)); await p.click('#bUndo'); await p.waitForTimeout(150); console.log('  annulla:', await q());
  }
  console.log('errors', errs); await b.close();
})();
