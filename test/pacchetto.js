// «Esporta»: pacchetto zip con scheda PDF, script di ogni piano, foto, sfondi e dati; «Importa» lo riapre senza toccare l'originale.
const path = require('path'), fs = require('fs'), zlib = require('zlib');
const APP = require('url').pathToFileURL(path.resolve(__dirname, '..', 'index.html')).href;
const OUT = path.join(__dirname, 'out'); fs.mkdirSync(OUT, {recursive: true});
const { chromium } = require('playwright');
// legge uno zip senza compressione
function voci(buf) { const e = buf.lastIndexOf(Buffer.from([80, 75, 5, 6])), n = buf.readUInt16LE(e + 10); let o = buf.readUInt32LE(e + 16); const V = {};
  for (let i = 0; i < n; i++) { const sz = buf.readUInt32LE(o + 20), nl = buf.readUInt16LE(o + 28), lo = buf.readUInt32LE(o + 42), nome = buf.slice(o + 46, o + 46 + nl).toString(), d = lo + 30 + buf.readUInt16LE(lo + 26) + buf.readUInt16LE(lo + 28); V[nome] = buf.slice(d, d + sz); o += 46 + nl; } return V; }
// lo riscrive compresso e dentro una cartella, come fa il computer quando si «rizippa»
function rizippa(V) { const T = []; for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; T[n] = c >>> 0; }
  const crc = b => { let c = 0xFFFFFFFF; for (const x of b) c = T[(c ^ x) & 255] ^ (c >>> 8); return (c ^ 0xFFFFFFFF) >>> 0; }, parti = [], cen = []; let off = 0;
  for (const [nome0, dati] of Object.entries(V)) { const nome = Buffer.from('cartella/' + nome0), z = zlib.deflateRawSync(dati), h = Buffer.alloc(30), c = Buffer.alloc(46);
    h.writeUInt32LE(0x04034b50, 0); h.writeUInt16LE(20, 4); h.writeUInt16LE(8, 8); h.writeUInt32LE(crc(dati), 14); h.writeUInt32LE(z.length, 18); h.writeUInt32LE(dati.length, 22); h.writeUInt16LE(nome.length, 26);
    c.writeUInt32LE(0x02014b50, 0); c.writeUInt16LE(8, 10); c.writeUInt32LE(crc(dati), 16); c.writeUInt32LE(z.length, 20); c.writeUInt32LE(dati.length, 24); c.writeUInt16LE(nome.length, 28); c.writeUInt32LE(off, 42);
    parti.push(h, nome, z); cen.push(c, nome); off += 30 + nome.length + z.length; }
  const cs = cen.reduce((t, x) => t + x.length, 0), f = Buffer.alloc(22); f.writeUInt32LE(0x06054b50, 0); f.writeUInt16LE(Object.keys(V).length, 8); f.writeUInt16LE(Object.keys(V).length, 10); f.writeUInt32LE(cs, 12); f.writeUInt32LE(off, 16);
  return Buffer.concat([...parti, ...cen, f]); }
const pulisci = n => n.replace(/\d{4}-\d\d-\d\d/, 'DATA').replace(/_[a-z0-9]{5,7}\.jpg$/, '_CODICE.jpg');
(async () => {
  const b = await chromium.launch(), errs = [];
  const apri = async () => { const ctx = await b.newContext({viewport:{width:1280, height:854}, acceptDownloads:true}), p = await ctx.newPage(); p.on('pageerror', e => errs.push(e.message));
    p.on('dialog', d => { if (d.type() !== 'beforeunload') console.log('  finestrella:', d.message().replace(/\n+/g, ' | ').slice(0, 170)); d.accept(); });
    await p.goto(process.argv[2] || APP); await p.evaluate(() => localStorage.clear()); await p.reload(); await p.waitForTimeout(300); return {ctx, p}; };
  const {ctx, p} = await apri();
  await p.evaluate(async () => {
    R = demo(); R.demo = false; R.id = 'pacco'; R.nome = 'Casa di prova'; R.data = '2026-11-28';
    const p2 = JSON.parse(JSON.stringify(R.piani[0])); p2.id = 'p2'; p2.nome = 'Piano primo'; R.piani.push(p2); R.piani.push({id:'p3', nome:'Sottotetto', ver:0, nodes:[], walls:[], rooms:[]});
    // sessanta note lunghe: la tabella non sta in un foglio
    R.piani[0].notes = Array.from({length:60}, (_, i) => ({id:'n' + i, x:1 + i % 8, y:1 + i % 5, t:'Nota numero ' + (i + 1) + '\nseconda riga'}));
    window.jpg = (n, w = 1600, h = 1200) => new Promise(r => { const c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d'); g.fillStyle = '#369'; g.fillRect(0, 0, w, h); g.fillStyle = '#fff'; g.font = '300px Arial'; g.fillText(String(n), w / 3, h / 2); c.toBlob(r, 'image/jpeg', 0.85); });
    for (let i = 1; i <= 3; i++) { const blob = await jpg(i); await fPut({id:'f' + i, ril:R.id, piano:i < 3 ? R.piani[0].id : 'p2', data:'2026-11-28T10:0' + i, nome:i === 1 ? 'crepa' : '', blob, type:'image/jpeg', size:blob.size, fname:'IMG_' + i + '.jpg', thumb:'data:image/jpeg;base64,AAAA', w:1600, h:1200, x:2 + i, y:2}); }
    await bgPut({id:'sfondo1', ril:R.id, blob:await jpg('S')}); R.piani[0].bg = {id:'sfondo1', pw:1600, ph:1200, ox:-1, oy:9, m:0.008, rot:0, op:0.35, hide:false, lock:false};
    R.unexp = true; arcPut(R); ui.fotos = null; tab = 'prj'; render(); await loadFotos(true);
  });
  console.log('righe della scheda:', JSON.stringify(await p.evaluate(async () => {
    const h = await schedaHTML(), t = document.createElement('template'); t.innerHTML = h; const tutte = [...t.content.children].map(x => document.importNode(x, true)), conta = L => L.reduce((s, x) => s + x.querySelectorAll('.stab tbody tr, :scope tbody tr').length, 0), prima = conta(tutte), nPrima = tutte.length;
    const css = cssScheda(), dopo = spezzaPagine(tutte, css), st = document.createElement('style'); st.textContent = css; const box = document.createElement('div'); box.id = 'scheda'; box.style.cssText = 'display:block;position:fixed;left:-9999px;top:0;width:186mm;font:11pt Arial,sans-serif'; document.head.appendChild(st); document.body.appendChild(box);
    const lim = 273 * 96 / 25.4, alte = dopo.filter(x => x.className === 'stab').map(x => { const c = x.cloneNode(true); box.appendChild(c); const v = c.offsetHeight; c.remove(); return v; }); box.remove(); st.remove();
    return {righe:prima, dopo:conta(dopo), pagineInPiu:dopo.length > nPrima, tutteNelFoglio:alte.every(v => v <= lim)}; })));
  // doppio tocco: un solo file
  let n = 0; p.on('download', () => n++);
  const attesa = p.waitForEvent('download', {timeout:90000}); await p.click('#bExp'); await p.evaluate(() => creaPacchetto()).catch(() => {}); const d = await attesa, zip = path.join(OUT, 'pacchetto.zip'); await d.saveAs(zip); await p.waitForTimeout(600);
  const V = voci(fs.readFileSync(zip));
  console.log('file:', pulisci(d.suggestedFilename()), '| scaricati:', n); console.log('dentro:', Object.keys(V).map(pulisci).join(' ; '));
  const pdf = V['scheda.pdf'].toString('latin1'); console.log('pdf:', pdf.slice(0, 8), 'pagine >= 6:', (pdf.match(/\/Type\/Page\//g) || []).length >= 6);
  let da = 0; for (let i = 1; i <= 12; i++) { const k = V['scheda.pdf'].indexOf('DCTDecode', da); if (k < 0) break; const a = V['scheda.pdf'].indexOf('stream\n', k) + 7, z = V['scheda.pdf'].indexOf('\nendstream', a); fs.writeFileSync(path.join(OUT, 'pacchetto-pag' + i + '.jpg'), V['scheda.pdf'].slice(a, z)); da = z; }
  console.log('script con muri:', Object.keys(V).filter(k => k.endsWith('.scr')).every(k => /_.PLINE|_.LINE/.test(V[k].toString())));
  console.log('csv:', V['foto/didascalie.csv'].toString().split('\r\n').length - 2, 'foto');
  const stato = () => p.evaluate(async () => 'rilievi ' + arcIndex().length + ' | da esportare ' + arcIndex().find(x => x.id === 'pacco').unexp + ' | foto originali ' + (await fList('pacco')).length + ' | sfondo originale ' + !!(await bgGet('sfondo1')));
  console.log('dopo esporta:', await stato(), '| resto sulla pagina:', await p.evaluate(() => tab + ' ' + !!$('#lavoro')));
  // una foto aggiunta o tolta lo rimette «da esportare»
  await p.evaluate(async () => { await addFotos([new File([await jpg(9, 200, 150)], 'x.jpg', {type:'image/jpeg'})]); }); await p.waitForTimeout(700); console.log('foto aggiunta:', await stato());
  await p.evaluate(async () => { R.unexp = false; arcPut(R); const f = ui.fotos[ui.fotos.length - 1]; openFoto(f.id); }); await p.click('[data-fv="del"], #fvDel').catch(async () => { await p.getByText('Elimina', {exact:false}).last().click(); }); await p.waitForTimeout(700); console.log('foto tolta:', await stato());
  // importa nello stesso tablet: copia, con foto e sfondo suoi
  await p.evaluate(() => vai('home')); await p.setInputFiles('#fImp', zip); await p.waitForTimeout(1500);
  const copia = () => p.evaluate(async () => { const f = await fList(R.id), bg = R.piani[0].bg; return tab + ' | è una copia ' + (R.id !== 'pacco') + ' | piani ' + R.piani.length + ' | muri ' + R.piani[0].walls.length + ' | foto ' + f.length + ' | sulla pianta ' + f.filter(x => x.x != null).length + ' | sfondo ' + !!(bg && await bgGet(bg.id)) + ' con codice suo ' + (!!bg && bg.id !== 'sfondo1') + ' | da esportare ' + R.unexp; });
  console.log('copia:', await copia()); await p.evaluate(() => { eliminaRilievo(); }); await p.waitForTimeout(900); console.log('copia eliminata:', await stato());
  // tablet nuovo, con lo zip rifatto dal computer (compresso, dentro una cartella)
  const rz = path.join(OUT, 'rizippato.zip'); fs.writeFileSync(rz, rizippa(V));
  const n2 = await apri(); await n2.p.setInputFiles('#fImp', rz); await n2.p.waitForTimeout(1500);
  console.log('tablet nuovo:', await n2.p.evaluate(async () => tab + ' ' + R.nome + ' | foto ' + (await fList(R.id)).length + ' | sfondo ' + !!(await bgGet(R.piani[0].bg.id))));
  // zip rovinato: non importa niente
  const rotto = path.join(OUT, 'rotto.zip'), cr = Buffer.from(fs.readFileSync(zip)); cr[cr.indexOf('foto/piano') + 400] ^= 255; fs.writeFileSync(rotto, cr);
  const n3 = await apri(); await n3.p.setInputFiles('#fImp', rotto); await n3.p.waitForTimeout(1500); console.log('zip rovinato: rilievi', await n3.p.evaluate(() => arcIndex().length));
  // senza foto: niente cartella foto. Scheda che non si crea: lo zip esce lo stesso e resta «da esportare»
  await n3.p.evaluate(() => { R = demo(); R.demo = false; R.id = 'senza'; R.nome = 'Senza foto'; R.unexp = true; arcPut(R); ui.fotos = null; tab = 'prj'; render(); });
  const esporta = async nome => { const w = n3.p.waitForEvent('download', {timeout:60000}); await n3.p.click('#bExp'); const x = await w, f = path.join(OUT, nome); await x.saveAs(f); await n3.p.waitForTimeout(500); return Object.keys(voci(fs.readFileSync(f))).map(pulisci).join(' ; '); };
  await n3.p.evaluate(() => { tab = 'pianta'; render(); piano().fm[G.runs.filter(r => !r.ext)[0].key] = '9,99'; update(true); tab = 'prj'; render(); });   // una misura che non torna: avvisa e poi crea lo stesso
  console.log('senza foto:', await esporta('senza.zip'));
  await n3.p.evaluate(() => { window.pdfDaJpg = () => { throw new Error('prova'); }; R.unexp = true; arcPut(R); });
  console.log('senza scheda:', await esporta('senzapdf.zip'), '| da esportare', await n3.p.evaluate(() => R.unexp));
  console.log('errors', errs); await b.close();
})();
