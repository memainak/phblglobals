/**
 * Applies the 2026-27 MRP price list to Firestore:
 *   - creates 23 ointment + 11 tablet products
 *   - reprices the 10 existing cosmetics / special products (packSizes only)
 *   - writes the 10 GNCT DELHI ointment batch records
 *
 * The cosmetics are updated field-by-field rather than replaced, because their
 * live documents carry SEO copy edited through the admin panel that is not in
 * initialData.ts. Everything else in Firestore is left untouched.
 *
 * Usage:
 *   npx tsx scripts/seed-price-list.ts          # dry run, writes nothing
 *   npx tsx scripts/seed-price-list.ts --commit # performs the writes
 */

import fs from 'fs';
import path from 'path';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { initialProducts, initialBatches } from '../src/lib/data/initialData';

const OINTMENT_BATCH_NOS = [
  'AE-01', 'CL-02', 'A-01', 'CA-01', 'RT-01',
  'EH-01', 'GR-01', 'HA-01', 'SL-02', 'TH-01',
];

const REPRICED_COSMETIC_IDS = [
  'prod-09', 'prod-10', 'prod-13', 'prod-14',
  'prod-15', 'prod-16', 'prod-17', 'prod-18',
  'prod-19', 'prod-20',
];

async function run() {
  const commit = process.argv.includes('--commit');

  let projectId = process.env.FIREBASE_PROJECT_ID || 'phblglobals';
  let clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  let privateKey = process.env.FIREBASE_PRIVATE_KEY;

  const localKeyPath =
    process.env.GOOGLE_APPLICATION_CREDENTIALS ||
    path.resolve(process.cwd(), 'service-account.json');

  if ((!clientEmail || !privateKey) && fs.existsSync(localKeyPath)) {
    const fileData = JSON.parse(fs.readFileSync(localKeyPath, 'utf8'));
    projectId = fileData.project_id || projectId;
    clientEmail = fileData.client_email;
    privateKey = fileData.private_key;
    console.log(`Loaded service account credentials from ${localKeyPath}`);
  }

  if (!projectId || !clientEmail || !privateKey) {
    console.error('Error: Missing service account credentials.');
    process.exit(1);
  }

  privateKey = privateKey.replace(/\\n/g, '\n');
  const db = getFirestore(initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) }));

  const newProducts = initialProducts.filter(
    (p) => p.subCategory === 'ointment' || p.subCategory === 'tablets'
  );
  const cosmetics = initialProducts.filter((p) => REPRICED_COSMETIC_IDS.includes(p.id));
  const batches = initialBatches.filter((b) => OINTMENT_BATCH_NOS.includes(b.batchNo));

  console.log(
    `\n${newProducts.length} new products, ${cosmetics.length} cosmetics repriced, ${batches.length} batches\n`
  );

  for (const product of newProducts) {
    const ref = db.collection('products').doc(product.id);
    const action = (await ref.get()).exists ? 'OVERWRITE' : 'CREATE';
    if (commit) {
      await ref.set(product);
      console.log(`${action}d products/${product.id} — ${product.name}`);
    } else {
      console.log(`[dry run] would ${action} products/${product.id} — ${product.name}`);
    }
  }

  for (const product of cosmetics) {
    const ref = db.collection('products').doc(product.id);
    const packs = product.packSizes
      .map((p) => `${p.size}${p.mrp === undefined ? ' (no MRP)' : ` = ₹${p.mrp}`}`)
      .join(', ');
    if (commit) {
      await ref.update({ packSizes: product.packSizes, updatedAt: new Date().toISOString() });
      console.log(`REPRICEd products/${product.id} — ${packs}`);
    } else {
      console.log(`[dry run] would REPRICE products/${product.id} — ${packs}`);
    }
  }

  for (const batch of batches) {
    const ref = db.collection('batches').doc(batch.batchNo);
    const action = (await ref.get()).exists ? 'OVERWRITE' : 'CREATE';
    if (commit) {
      await ref.set(batch);
      console.log(`${action}d batches/${batch.batchNo} — ${batch.brandName}`);
    } else {
      console.log(`[dry run] would ${action} batches/${batch.batchNo} — ${batch.brandName}`);
    }
  }

  console.log(commit ? '\nDone.' : '\nDry run only. Re-run with --commit to write.');
}

run().catch((err) => {
  console.error('Failed:', err);
  process.exit(1);
});
