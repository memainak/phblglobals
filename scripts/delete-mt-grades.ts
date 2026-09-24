/**
 * Removes the nine mother-tincture grade products (prod-mtc-01 … prod-mtc-09).
 * Their pricing now lives in the mother tincture reference table instead.
 *
 *   npx tsx scripts/delete-mt-grades.ts          # dry run
 *   npx tsx scripts/delete-mt-grades.ts --commit # deletes
 */
import fs from 'fs';
import path from 'path';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const IDS = Array.from({ length: 9 }, (_, i) => `prod-mtc-0${i + 1}`);

async function run() {
  const commit = process.argv.includes('--commit');
  const k = JSON.parse(fs.readFileSync(path.resolve('service-account.json'), 'utf8'));
  const db = getFirestore(
    initializeApp({ credential: cert({ projectId: k.project_id, clientEmail: k.client_email, privateKey: k.private_key }) })
  );

  for (const id of IDS) {
    const ref = db.collection('products').doc(id);
    const snap = await ref.get();
    if (!snap.exists) { console.log(`SKIP  ${id} — not present`); continue; }
    const d = snap.data() as { name?: string; subCategory?: string };
    if (d.subCategory !== 'mother-tincture' || !/^Mother Tincture/.test(d.name ?? '')) {
      console.error(`ABORT ${id} — unexpected document: ${d.name} / ${d.subCategory}`);
      process.exit(1);
    }
    if (commit) { await ref.delete(); console.log(`DELETED ${id} — ${d.name}`); }
    else console.log(`[dry run] would DELETE ${id} — ${d.name}`);
  }
  console.log(commit ? '\nDone.' : '\nDry run only. Re-run with --commit.');
}
run().catch((e) => { console.error('Failed:', e); process.exit(1); });
