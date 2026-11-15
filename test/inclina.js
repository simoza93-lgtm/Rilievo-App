const APP = require('url').pathToFileURL(require('path').resolve(__dirname, '..', 'index.html')).href;
const OUT = require('path').join(__dirname, 'out'); require('fs').mkdirSync(OUT, {recursive: true});
const { chromium } = require('playwright');
// diagonale rossa → «Sistema inclinando un muro»: scelta del muro e dell'estremo che scorre, misure che diventano ricavate
// (anche nella stanza vicina), Annulla / Conferma, parziali dei vani, facciata, vista girata
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({viewport:{width:1400,height:950}});
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto(process.argv[2] || APP); await p.evaluate(() => localStorage.clear()); await p.reload();
  // due stanze con tramezzo a x=4, tutte le misure interne; diagonale nella stanza di sinistra 8 cm più lunga
  const prep = (extra) => p.evaluate(new Function(`R = blank(); R.id='inc'; tab='pianta'; render(); var pl = piano(); ui.view={x:-1,y:-1,s:70}; G = geometry(pl);
    var st = (pts, tipo) => { ui.newType = tipo; const sp = []; for (let i = 0; i < pts.length - 1; i++) { const a = pts[i], c = pts[i+1]; for (let k = 0; k < 8; k++) sp.push([SX(a[0] + (c[0]-a[0])*k/8), SY(a[1] + (c[1]-a[1])*k/8)]); } sp.push([SX(pts[pts.length-1][0]), SY(pts[pts.length-1][1])]); finishStroke(sp); };
    st([[0,0],[8,0],[8,4],[0,4],[0,0]], 'P'); st([[4,0],[4,4]], 'T'); update(true);
    G.runs.filter(r => !r.ext).forEach(r => { const a = G.T.N.get(r.p), q = G.T.N.get(r.q); setMeasure(pl, 'r', r.key, f2(Math.abs(r.H ? q.x - a.x : q.y - a.y) - r.eA - r.eB)); }); update(true);
    ${extra || ''}
    var cr = (x, y) => { let best = null, bd = 1.5; G.walls.forEach(wl => wl.pts.forEach(q => { const d = Math.hypot(q[0]-x, q[1]-y); if (d < bd) { bd = d; best = q; } })); return best; };
    var end = q => { let n = null, bd = Infinity; pl.nodes.forEach(k => { const d = Math.hypot(k.x - q[0], k.y - q[1]); if (d < bd) { bd = d; n = k; } }); return {n:n.id, dx:r4(q[0] - n.x), dy:r4(q[1] - n.y), x:q[0], y:q[1]}; };
    var d = {id:uid(), dg:true, a:end(cr(0.3,0.3)), b:end(cr(3.95,3.7)), H:true, o:0, v:''}; pl.dims = [d]; update(true);
    setMeasure(pl, 'q', d.id, f2(geometry(pl).dims[0].len + 0.08)); ui.mode = 'select'; updTools(); update(true); fit(); ui.sel = {k:'q', id:d.id}; draw(); renderSide();
    const t = document.querySelector('#toast'); if (t) t.style.pointerEvents = 'none';`));
  const tapW = async (x, y) => { const s = await p.evaluate(([x, y]) => { const r = $('#svg').getBoundingClientRect(); const q = (R && R.vrot) || 0, u = [SX(x), SY(y)], v = q === 1 ? [ui.Wr - u[1], u[0]] : q === 2 ? [ui.Wr - u[0], ui.Hr - u[1]] : q === 3 ? [u[1], ui.Hr - u[0]] : u; return [r.left + v[0], r.top + v[1]]; }, [x, y]); await p.mouse.click(s[0], s[1]); await p.waitForTimeout(120); };
  const stato = () => p.evaluate(() => ({diag:+G.dims[0].len.toFixed(3), avvisi:G.warns.map(w => w.t), obliqui:piano().walls.filter(w => w.obl).length, rossi:measItems().filter(m => m.bad).length}));
  const opz = () => p.evaluate(() => [...document.querySelectorAll('#side .iopt')].map(e => e.innerText.replace(/\s+/g, ' ').trim()));
  const out = {};
  // 1) tramezzo: l'estremo in basso non sistema la diagonale, quello in alto sì; Annulla e poi Conferma
  await prep();
  out.prima = await stato(); out.tasto = await p.evaluate(() => !!document.querySelector('#bIncl'));
  await p.click('#bIncl'); await p.waitForTimeout(80);
  out.evidenziati = await p.evaluate(() => inclRoomWalls(ui.incl.did).size);
  await tapW(6, 2); out.fuoriStanza = await p.evaluate(() => [document.querySelector('#toast').textContent, !!ui.incl.wid]);
  await tapW(4.07, 2);
  out.scelte = await opz();
  await p.screenshot({path:OUT + '/inclina_scelta.png'});
  const top = await p.evaluate(() => { const o = ui.incl.opts.find(o => o.ok); const E = nd(piano(), o.eid); return [E.x, E.y]; });
  await tapW(top[0], top[1]);   // tocco sulla freccia
  out.applicato = await stato(); out.pannello = await p.evaluate(() => document.querySelector('#side .incl').innerText.replace(/\s+/g, ' ').trim());
  out.misure = await p.evaluate(() => measItems().filter(m => m.H && m.r && !m.r.ext).map(m => m.st + ' ' + f2(m.val)).sort().join(' | '));
  await p.click('#bInclNo'); await p.waitForTimeout(80);
  out.annullato = await stato(); out.dopoAnnulla = (await opz()).length;
  await p.click('[data-incl-e]'); await p.waitForTimeout(80); await p.click('#bInclOk'); await p.waitForTimeout(80);
  out.confermato = Object.assign(await stato(), {incl:await p.evaluate(() => ui.incl), lunghezza:await p.evaluate(() => piano().walls.filter(w => w.obl).map(w => w.mis).join())});
  await p.click('text=Adatta'); await p.waitForTimeout(100); await p.screenshot({path:OUT + '/inclina_fatto.png'});
  out.script = await p.evaluate(() => /_.LINE|_.PLINE/.test(genScript(piano())));
  // 2) porta sul lato in alto della stanza con le parziali: l'ultima parziale (verso lo spigolo che scorre) diventa ricavata
  await prep(`const r = G.runs.find(r => !r.ext && r.H && r.sg < 0 && G.T.N.get(r.p).x < 1); const w = r.walls[0];
    (w.ap = w.ap || []).push({id:uid(), tipo:'porta', d:'0,85', l:'0,80', h:'2,10', pos:{k:r.key, v:'0,85', prev:''}}); setMeasure(pl, 'l', r.key, '2,00'); update(true);`);
  out.porta = {prima:await stato()};
  await p.click('#bIncl'); await tapW(4.07, 2); out.porta.scelte = await opz();
  await p.click('[data-incl-e]'); await p.waitForTimeout(80); out.porta.dopo = await stato();
  // 3) muro perimetrale di sinistra con la facciata sotto misurata: l'estremo in basso scorre, la facciata diventa ricavata
  await prep(`const fc = G.facs.find(f => f.H && f.A.y < 0.5); setMeasure(pl, 'f', fc.key, f2(fc.sumInt)); update(true);`);
  out.facciata = {prima:await stato()};
  await p.click('#bIncl'); await tapW(0.07, 2); out.facciata.scelte = await opz();
  await p.click('[data-incl-e]'); await p.waitForTimeout(80); out.facciata.dopo = await stato();
  // 4) vista girata di 90°: i nomi degli estremi seguono lo schermo
  await prep(`R.vrot = 1; sizeCanvas(); fit(); draw();`);
  await p.click('#bIncl'); await tapW(4.07, 2); out.girata = (await opz()).map(t => t.split(':')[0]); await p.screenshot({path:OUT + '/inclina_girata.png'});
  console.log(JSON.stringify(out, null, 1)); console.log('errors', errs); await b.close(); })();
