/**
 * Removes prod-1, a duplicate of prod-01 (same slug "arnica-montana-q") created
 * through the admin panel with thinner data and a title-case subCategory.
 *
 *   npx tsx scripts/delete-duplicate-arnica.ts          # dry run
 *   npx tsx scripts/delete-duplicate-arnica.ts --commit # deletes
 */
import fs from 'fs';
import path from 'path';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

async function run() {
  const commit = process.argv.includes('--commit');
  const k = JSON.parse(fs.readFileSync(path.resolve('service-account.json'), 'utf8'));
  const db = getFirestore(
    initializeApp({ credential: cert({ projectId: k.project_id, clientEmail: k.client_email, privateKey: k.private_key }) })
  );

  const dupRef = db.collection('products').doc('prod-1');
  const keepRef = db.collection('products').doc('prod-01');
  const [dup, keep] = await Promise.all([dupRef.get(), keepRef.get()]);

  if (!dup.exists) {
    console.log('prod-1 not present — nothing to do.');
    return;
  }
  if (!keep.exists) {
    console.error('ABORT: prod-01 (the record being kept) does not exist.');
    process.exit(1);
  }

  const d = dup.data() as { name?: string; slug?: string; subCategory?: string };
  const k2 = keep.data() as { slug?: string };

  // Only delete if this really is the duplicate we identified.
  if (d.slug !== k2.slug) {
    console.error(`ABORT: slugs differ (prod-1="${d.slug}", prod-01="${k2.slug}") — not the expected duplicate.`);
    process.exit(1);
  }
  if (d.subCategory !== 'Mother Tincture') {
    console.error(`ABORT: prod-1 subCategory is "${d.subCategory}", expected "Mother Tincture".`);
    process.exit(1);
  }

  console.log(`target: prod-1 | ${d.name} | slug=${d.slug} | subCategory=${JSON.stringify(d.subCategory)}`);
  console.log(`keeping: prod-01 | slug=${k2.slug}`);

  if (commit) {
    await dupRef.delete();
    console.log('\nDELETED prod-1.');
  } else {
    console.log('\nDry run only. Re-run with --commit to delete.');
  }
}

run().catch((e) => { console.error('Failed:', e); process.exit(1); });
