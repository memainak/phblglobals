/**
 * Removes the six dilution price-tier products (prod-dil-01 … prod-dil-06).
 * Their pricing now lives in the dilution reference table instead.
 *
 *   npx tsx scripts/delete-dilution-tiers.ts          # dry run
 *   npx tsx scripts/delete-dilution-tiers.ts --commit # deletes
 */
import fs from 'fs';
import path from 'path';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const IDS = ['prod-dil-01','prod-dil-02','prod-dil-03','prod-dil-04','prod-dil-05','prod-dil-06'];

async function run() {
  const commit = process.argv.includes('--commit');
  const k = JSON.parse(fs.readFileSync(path.resolve('service-account.json'), 'utf8'));
  const db = getFirestore(
    initializeApp({ credential: cert({ projectId: k.project_id, clientEmail: k.client_email, privateKey: k.private_key }) })
  );

  for (const id of IDS) {
    const ref = db.collection('products').doc(id);
    const snap = await ref.get();
    if (!snap.exists) {
      console.log(`SKIP  ${id} — not present`);
      continue;
    }
    const d = snap.data() as { name?: string; subCategory?: string };
    if (d.subCategory !== 'dilution') {
      console.error(`ABORT ${id} — expected subCategory 'dilution', found '${d.subCategory}'`);
      process.exit(1);
    }
    if (commit) {
      await ref.delete();
      console.log(`DELETED ${id} — ${d.name}`);
    } else {
      console.log(`[dry run] would DELETE ${id} — ${d.name}`);
    }
  }
  console.log(commit ? '\nDone.' : '\nDry run only. Re-run with --commit.');
}

run().catch((e) => { console.error('Failed:', e); process.exit(1); });
