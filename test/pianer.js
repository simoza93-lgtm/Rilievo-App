const APP = require('url').pathToFileURL(require('path').resolve(__dirname, '..', 'index.html')).href;
const OUT = require('path').join(__dirname, 'out'); require('fs').mkdirSync(OUT, {recursive: true});
const { chromium } = require('playwright');
// scale con rampe di larghezza diversa, pianerottoli intermedi su misura, pianerottoli di partenza e di arrivo
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({viewport:{width:1400,height:950}});
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto(process.argv[2] || APP); await p.evaluate(() => localStorage.clear()); await p.reload();
  const out = await p.evaluate(() => { R = blank(); R.id = 'pn'; tab = 'pianta'; render(); var pl = piano(); ui.view = {x:-1, y:-1, s:50}; G = geometry(pl);
    const S = (tipo, x, y, extra) => { const st = Object.assign(newStair(tipo, 0, 0), extra); st.x = x; st.y = y; (pl.stairs = pl.stairs || []).push(st); return st; };
    const r2 = v => Math.round(v * 100) / 100, seg = s => [s.a, s.b].map(q => q.map(r2));
    const L = S('L', 1, 1, {b:'1,00', b2:'0,80', pian:'1,30', pianL:'1,20'});
    const U = S('U', 5, 1, {b:'1,10', b2:'0,90', pian:'1,40'});
    const U2 = S('U', 9, 1, {b:'1,00', b2:'1,00', pianL:'2,50'});
    const A = S('asc', 13, 1, {nr:'4', b:'1,20', b2:'1,00', b3:'0,90', b4:'1,10', n:'20'});
    const D = S('dritta', 1, 8, {n:'10', pPon:true, pAon:true, pP:'1,00', pPL:'1,50', pA:'1,20'});
    const Lp = S('L', 5, 8, {pPon:true, pAon:true, pPL:'1,40', pAL:'1,30'});
    update(true); fit(); draw();
    const info = st => { const P = stairPrims(st), Q = stP(st); return {bbox:P.bbox.map(r2), segs:P.segs.length, area:r2(P.area), bMin:Q.bMin, ok:stCheck(st).okB}; };
    const o = {L:info(L), U:info(U), U2:Object.assign(info(U2), {gU:r2(stP(U2).gU)}), asc:info(A), dritta:info(D), Lp:info(Lp)};
    // L: pianerottolo 1,20 × 1,30, 2ª rampa larga 0,80 sul lato esterno
    o.Lpian = stairPrims(L).segs.filter(s => !s.dash).slice(0, 0).length;
    o.Lris2 = stairPrims(L).ris.filter(r => r.k === stP(L).n1).map(r => seg(r));
    // dritta: partenza 1,00 × 1,50 (allargata dalle due parti), arrivo 1,20 × 0,90
    const Pd = stairPrims(D), Rd = Pd.ris;
    o.dritta.prima = seg(Rd[0]); o.dritta.ultima = seg(Rd[Rd.length - 1]);
    o.dritta.linee = Pd.segs.map(seg).filter(s => s[0][1] < 8 - 0.001 || s[1][1] < 8 - 0.001 || s[0][1] > Rd[Rd.length - 1].a[1] + 0.001 || s[1][1] > Rd[Rd.length - 1].a[1] + 0.001);
    // vecchia scala senza i campi nuovi: identica
    const old = S('U', 1, 14, {}); delete old.b2; o.vecchia = info(old);
    // script
    const scr = genScript(pl); o.script = (scr.match(/_.LINE/g) || []).length;
    // pannello
    ui.sel = {k:'s', id:A.id}; renderSide(); o.panAsc = [...document.querySelectorAll('#side [data-st]')].map(i => i.dataset.st + (i.placeholder ? '=' + i.placeholder : ''));
    ui.sel = {k:'s', id:U2.id}; renderSide(); o.panU = [...document.querySelectorAll('#side [data-st]')].map(i => i.dataset.st + (i.placeholder ? '=' + i.placeholder : '') + (i.disabled ? ' (ricavata ' + i.value + ')' : ''));
    ui.sel = {k:'s', id:D.id}; renderSide(); o.panD = [...document.querySelectorAll('#side [data-st]')].map(i => i.dataset.st + (i.placeholder ? '=' + i.placeholder : ''));
    ui.sel = null; renderSide(); draw();
    return o; });
  await p.click('text=Adatta'); await p.waitForTimeout(150); await p.screenshot({path:OUT + '/pianerottoli.png'});
  // casella nel pannello: spunta il pianerottolo di arrivo, scrivi la larghezza della 2ª rampa
  out.click = await p.evaluate(() => { const st = piano().stairs.find(s => s.tipo === 'L' && !s.pPon); ui.sel = {k:'s', id:st.id}; renderSide(); return st.id; });
  await p.check('#side [data-st="pAon"]'); await p.waitForTimeout(80);
  await p.fill('#side [data-st="b2"]', '0,75'); await p.waitForTimeout(80);
  out.dopoClick = await p.evaluate(id => { const st = piano().stairs.find(s => s.id === id); return {pAon:st.pAon, b2:st.b2, campi:[...document.querySelectorAll('#side [data-st="pA"], #side [data-st="pAL"]')].map(i => i.placeholder), segs:stairPrims(st).segs.length}; }, out.click);
  console.log(JSON.stringify(out, null, 1)); console.log('errors', errs); await b.close(); })();
