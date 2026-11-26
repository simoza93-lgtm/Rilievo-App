// Sui lati con porte e finestre c'è anche il totale del lato: si vede, si tocca in pianta e «Prossima» lo chiede prima delle parziali.
const APP = require('url').pathToFileURL(require('path').resolve(__dirname, '..', 'index.html')).href;
const OUT = require('path').join(__dirname, 'out'); require('fs').mkdirSync(OUT, {recursive: true});
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({viewport:{width:1280, height:854}});
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto(process.argv[2] || APP); await p.evaluate(() => localStorage.clear()); await p.reload(); await p.waitForTimeout(300);
  await p.evaluate(() => { R = blank(); R.id = 'tt'; tab = 'pianta'; render(); const pl = piano(); ui.view = {x:-2, y:-7, s:60}; G = geometry(pl);
    ui.newType = 'P'; const pts = [[0,0],[0,4],[6,4],[6,0],[0,0]], sp = []; for (let i = 0; i < pts.length - 1; i++) { const a = pts[i], c = pts[i + 1]; for (let k = 0; k < 6; k++) sp.push([SX(a[0] + (c[0] - a[0]) * k / 6), SY(a[1] + (c[1] - a[1]) * k / 6)]); } sp.push([SX(0), SY(0)]); finishStroke(sp); update(true);
    const top = pl.walls.find(w => isH(nd(pl, w.a), nd(pl, w.b)) && nd(pl, w.a).y > 2);
    top.ap = [{id:'porta1', tipo:'porta', d:'0,80', l:'0,90', h:'', dav:'', inv:false, dp:true, lp:true}]; update(true); ui.sel = null; ui.mode = 'select'; ui.fitted = false; render(); });
  const tot = () => p.evaluate(() => measItems().filter(x => x.tot).map(x => x.st + ' ' + (isFinite(x.val) ? f2(x.val) : '-')));
  console.log('totali sul lato con porta', JSON.stringify(await tot()), 'pallino', await p.locator('#svg .totd').count());
  await p.screenshot({path:require('path').join(OUT, 'totali-vuoto.png')});
  // «Prossima»: prima i due lati interi, poi i tratti
  await p.click('[data-guide]'); await p.waitForTimeout(300);
  const seq = []; for (let i = 0; i < 12; i++) { const t = await p.evaluate(() => { const d = document.querySelector('#inl .ms'); return d ? d.textContent.replace(/^Misura guidata · \d+ da prendere · /, '') : null; }); if (!t) break; seq.push(t); await p.click('#inl [data-k="skip"]'); await p.waitForTimeout(120); }
  console.log('ordine\n  ' + seq.join('\n  '));
  // tocco vero sul pallino del totale e scrittura col tastierino
  const q = await p.locator('#svg .totd').boundingBox(); await p.mouse.click(q.x + q.width / 2, q.y + q.height / 2); await p.waitForTimeout(200);
  console.log('finestra', await p.evaluate(() => { const d = document.querySelector('#inl .ms'); return d ? d.textContent : 'non aperta'; }));
  for (const k of ['5', ',', '8', '0', 'ok']) await p.click(`#inl [data-k="${k}"]`); await p.waitForTimeout(200);
  console.log('scritto', JSON.stringify(await tot()), JSON.stringify(await p.evaluate(() => Object.values(piano().fm || {}))));
  await p.screenshot({path:require('path').join(OUT, 'totali.png')});
  // scritto solo il lato opposto: il totale del lato con la porta si ricava e si vede in grigio
  await p.evaluate(() => { const pl = piano(); pl.fm = {}; pl.mord = []; const r = G.runs.filter(r => !r.ext && r.H && !r.chain)[0]; setMeasure(pl, 'r', r.key, '5,80'); update(true); });
  const letti = () => p.evaluate(() => [...document.querySelectorAll('#svg text')].filter(t => t.textContent === '5,80').length);
  console.log('ricavo', JSON.stringify(await tot()), 'si legge', await letti());
  await p.evaluate(() => { ui.sel = {k:'r', id:piano().rooms[0].id}; draw(); }); console.log('a stanza', await letti());
  await p.screenshot({path:require('path').join(OUT, 'totali-grigio.png')});
  console.log('errors', errs); await b.close();
})();
