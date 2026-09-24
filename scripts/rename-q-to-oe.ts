/**
 * Renames mother tincture products from "(Q)" to "(Ø)", the correct
 * homoeopathic symbol. Updates the display name and SEO title only — slugs are
 * deliberately left alone so existing URLs keep working.
 *
 *   npx tsx scripts/rename-q-to-oe.ts          # dry run
 *   npx tsx scripts/rename-q-to-oe.ts --commit # applies
 */
import fs from 'fs';
import path from 'path';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const IDS = ['prod-01', 'prod-02'];
const swap = (s: string) => s.replace(/\(Q\)/g, '(Ø)');

async function run() {
  const commit = process.argv.includes('--commit');
  const k = JSON.parse(fs.readFileSync(path.resolve('service-account.json'), 'utf8'));
  const db = getFirestore(
    initializeApp({ credential: cert({ projectId: k.project_id, clientEmail: k.client_email, privateKey: k.private_key }) })
  );

  for (const id of IDS) {
    const ref = db.collection('products').doc(id);
    const snap = await ref.get();
    if (!snap.exists) { console.log(`SKIP ${id} — not present`); continue; }

    const p = snap.data() as { name: string; slug: string; seo?: { title?: string; description?: string } };

    const name = swap(p.name ?? '');
    const seoTitle = swap(p.seo?.title ?? '');

    if (name === p.name && seoTitle === (p.seo?.title ?? '')) {
      console.log(`SKIP ${id} — already uses Ø`);
      continue;
    }

    console.log(`${id}`);
    console.log(`  name: ${p.name}  ->  ${name}`);
    console.log(`  seo : ${p.seo?.title}  ->  ${seoTitle}`);
    console.log(`  slug: ${p.slug}  (unchanged)`);

    if (commit) {
      await ref.update({
        name,
        ...(p.seo ? { seo: { ...p.seo, title: seoTitle } } : {}),
        updatedAt: new Date().toISOString(),
      });
      console.log('  RENAMED');
    }
  }
  console.log(commit ? '\nDone.' : '\nDry run only. Re-run with --commit to apply.');
}

run().catch((e) => { console.error('Failed:', e); process.exit(1); });
