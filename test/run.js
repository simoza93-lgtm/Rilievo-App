// Prove di regressione dell'app: ogni prova apre index.html in Chromium (Playwright) e stampa dei risultati.
// Il risultato di ogni prova si confronta con quello atteso salvato in test/attesi/<nome>.txt.
//   node test/run.js               tutte le prove
//   node test/run.js p1 rot        solo alcune
//   node test/run.js --aggiorna    riscrive gli attesi (solo quando un cambiamento è voluto e controllato)
const { spawnSync } = require('child_process'), fs = require('fs'), path = require('path');
const DIR = __dirname, ATT = path.join(DIR, 'attesi'), args = process.argv.slice(2), upd = args.includes('--aggiorna');
const only = args.filter(a => !a.startsWith('--'));
const all = fs.readdirSync(DIR).filter(f => f.endsWith('.js') && f !== 'run.js').map(f => f.slice(0, -3)).sort();
const list = only.length ? all.filter(n => only.includes(n)) : all;
// gli id casuali (7 caratteri) e i fine riga cambiano a ogni giro: si normalizzano
const norm = t => t.replace(/\r\n/g, '\n').replace(/[a-z0-9]{7}/g, 'X').trimEnd() + '\n';
fs.mkdirSync(ATT, {recursive: true});
let ko = 0;
for (const n of list) {
  const t0 = Date.now(), r = spawnSync(process.execPath, [path.join(DIR, n + '.js')], {encoding: 'utf8', timeout: 120000});
  const out = norm((r.stdout || '') + (r.stderr || '')), f = path.join(ATT, n + '.txt'), s = ((Date.now() - t0) / 1000).toFixed(1) + ' s';
  if (upd || !fs.existsSync(f)) { fs.writeFileSync(f, out); console.log(`${n.padEnd(10)} salvato (${s})`); continue; }
  const exp = fs.readFileSync(f, 'utf8');
  if (exp === out && r.status === 0) { console.log(`${n.padEnd(10)} ok (${s})`); continue; }
  ko++; console.log(`${n.padEnd(10)} DIVERSO (${s}${r.status !== 0 ? ', uscita ' + r.status : ''})`);
  const a = exp.split('\n'), b = out.split('\n'); let shown = 0;
  for (let i = 0; i < Math.max(a.length, b.length) && shown < 6; i++) if (a[i] !== b[i]) { console.log('   atteso: ' + (a[i] || '').slice(0, 300)); console.log('   ora:    ' + (b[i] || '').slice(0, 300)); shown++; }
}
console.log(ko ? `\n${ko} prove diverse da quanto atteso.` : '\nTutte le prove come atteso.');
process.exit(ko ? 1 : 0);
