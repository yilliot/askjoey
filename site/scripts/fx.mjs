// Today's MYR → SGD rate for the "≈ S$" figures, written to src/data/fx.json at build time.
// Keeps the last good rate when the source can't be reached.
import { readFile, writeFile } from 'node:fs/promises';

const FILE = new URL('../src/data/fx.json', import.meta.url);
const prev = await readFile(FILE, 'utf8').then(JSON.parse).catch(() => null);
try {
  const r = await fetch('https://open.er-api.com/v6/latest/MYR', { signal: AbortSignal.timeout(10000) });
  const j = await r.json();
  const rate = j?.rates?.SGD;
  if (j.result !== 'success' || !(rate > 0.2 && rate < 0.5)) throw new Error('unexpected rate ' + rate);
  const date = new Date(j.time_last_update_unix * 1000).toISOString().slice(0, 10);
  await writeFile(FILE, JSON.stringify({ sgdPerMyr: rate, date, source: 'open.er-api.com' }, null, 2) + '\n');
  console.log(`fx: RM1 = S$${rate} (${date})`);
} catch (e) {
  if (!prev) throw e;
  console.warn(`fx: kept ${prev.sgdPerMyr} from ${prev.date} (${e.message})`);
}
