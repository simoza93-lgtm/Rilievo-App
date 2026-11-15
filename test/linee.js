const APP = require('url').pathToFileURL(require('path').resolve(__dirname, '..', 'index.html')).href;
const OUT = require('path').join(__dirname, 'out'); require('fs').mkdirSync(OUT, {recursive: true});
const { chromium } = require('playwright');
// prospetto sulla pianta: proiezioni (costruzione) dagli spigoli, linea di terra, linee agganciate con lunghezza scritta
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({viewport:{width:1400,height:950}});
  const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  await p.goto(process.argv[2] || APP); await p.evaluate(()=>localStorage.clear()); await p.reload();
  await p.evaluate(()=>{ R = blank(); R.id='ln'; tab='pianta'; render(); const pl = piano(); ui.view={x:-2,y:-5.5,s:45}; G = geometry(pl);
    const st = (pts, tipo) => { ui.newType = tipo; const sp = []; for (let i = 0; i < pts.length - 1; i++) { const a = pts[i], c = pts[i+1]; for (let k = 0; k < 6; k++) sp.push([SX(a[0] + (c[0]-a[0])*k/6), SY(a[1] + (c[1]-a[1])*k/6)]); } sp.push([SX(pts[pts.length-1][0]), SY(pts[pts.length-1][1])]); finishStroke(sp); };
    st([[0,0],[6,0],[6,4],[0,4],[0,0]], 'P'); update(true); draw(); });
  const box = await p.evaluate(()=>{ const r = $('#svg').getBoundingClientRect(); return [r.left, r.top]; });
  const scr = (x, y) => p.evaluate(([x, y])=>[SX(x), SY(y)], [x, y]);
  const drag = async (a, c, steps = 8) => { await p.evaluate(()=>{ const t = document.querySelector('#toast'); if (t) t.style.pointerEvents = 'none'; }); await p.mouse.move(box[0] + a[0], box[1] + a[1]); await p.mouse.down(); for (let i = 1; i <= steps; i++) await p.mouse.move(box[0] + a[0] + (c[0]-a[0])*i/steps, box[1] + a[1] + (c[1]-a[1])*i/steps); await p.mouse.up(); await p.waitForTimeout(60); };
  const out = {};
  // costruzione: dalle due facce esterne in basso (spigoli -0,15 e 6,15) verso il basso, a mano un po' storte
  await p.click('[data-fly="disegno"]'); await p.click('[data-mode="costr"]');
  let a = await scr(-0.13, -0.17), c = await scr(-0.05, -4.5); await drag(a, c);
  a = await scr(6.17, -0.12); c = await scr(6.2, -4.4); await drag(a, c);
  // linea di terra: orizzontale da una proiezione all'altra, a quota -3
  await p.click('[data-fly="disegno"]'); await p.click('[data-mode="linea"]');
  a = await scr(-0.12, -3.02); c = await scr(6.1, -2.9);
  await drag(a, c);
  out.dopoTerra = await p.evaluate(()=>({inl:!!document.querySelector("#inl"), mode:ui.mode, ink:(piano().ink||[]).length, toast:(document.querySelector("#toast")||{}).textContent}));
  await p.click('#inl [data-k="x"]');
  // spigolo sinistro: dalla linea di terra in su, poi scrivo 6,50
  a = await scr(-0.15, -3.0); c = await scr(-0.1, -1.0); await drag(a, c);
  for (const k of ['6', ',', '5']) await p.click(`#inl [data-k="${k}"]`); await p.click('#inl [data-k="ok"]'); await p.waitForTimeout(80);
  out.linee = await p.evaluate(()=>piano().ink.map(k => ({t:k.cs ? 'cs' : k.lin ? 'lin' : 'mano', pts:k.pts.map(q => q.map(v => +v.toFixed(3))), v:k.v || ''})));
  // nascondi le costruzioni e script
  await p.click('[data-fly="disegno"]'); await p.click('[data-csvis]');
  out.nascoste = await p.evaluate(()=>({opt:R.opt.csHide, svgTratteggi:$('#svg').innerHTML.split('stroke-dasharray="6 4"').length - 1}));
  out.script = await p.evaluate(()=>{ const sc = genScript(piano()).split(/\r?\n/), i = sc.findIndex(l => /linee disegnate|note a mano/.test(l)); return i < 0 ? [] : sc.slice(i, i + 12).filter(l => l.trim()); });
  await p.click('[data-fly="disegno"]'); await p.click('[data-csvis]');
  // pannello: selezione e cambio lunghezza
  out.pannello = await p.evaluate(()=>{ const k = piano().ink.find(k => k.v); ui.mode = 'select'; ui.sel = {k:'ink', id:k.id}; draw(); renderSide();
    const i = document.querySelector('[data-ink="len"]'); return {titolo:document.querySelector('#side .cardh').textContent.trim().split(' ')[0], val:i && i.value}; });
  await p.fill('[data-ink="len"]', '7,20'); await p.waitForTimeout(60);
  out.dopoPannello = await p.evaluate(()=>piano().ink.filter(k => k.v).map(k => [k.v, +lnLen(k).toFixed(3)]));
  await p.evaluate(()=>{ ui.view = {x:-2,y:-5.5,s:45}; draw(); });
  await p.screenshot({path:require('path').join(OUT, 'linee.png')});
  console.log(JSON.stringify(out)); console.log('errors', errs); await b.close();
})();
