/**
 * Seeds the `reference` collection from the bundled catalogue files so the
 * admin Reference Indexes screen opens populated. Touches only that collection.
 *
 *   npx tsx scripts/seed-reference.ts          # dry run
 *   npx tsx scripts/seed-reference.ts --commit # writes
 */
import fs from 'fs';
import path from 'path';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { MOTHER_TINCTURE_REMEDIES, MOTHER_TINCTURE_PRICING, MOTHER_TINCTURE_COMBO_NOTE } from '../src/lib/data/motherTinctures';
import { DILUTION_REMEDIES, DILUTION_PRICING, DILUTION_COMBO_NOTE } from '../src/lib/data/dilutions';
import { BIOCHEMIC_UPCOMING } from '../src/lib/data/biochemic';
import { ReferenceItem, ReferenceSchedule } from '../src/types';

function rows(): ReferenceItem[] {
  const out: ReferenceItem[] = [];
  MOTHER_TINCTURE_REMEDIES.forEach((r) =>
    out.push({ id: `mt-${r.sl}`, list: 'mother-tincture', sl: r.sl, name: r.name, cat: r.cat })
  );
  DILUTION_REMEDIES.forEach((name, i) =>
    out.push({ id: `dil-${i + 1}`, list: 'dilution', sl: i + 1, name })
  );
  BIOCHEMIC_UPCOMING.forEach((b, i) =>
    out.push({
      id: `bio-${i + 1}`,
      list: 'biochemic',
      sl: i + 1,
      name: b.name,
      ...(b.potencies ? { potencies: b.potencies } : {}),
    })
  );
  return out;
}

async function run() {
  const commit = process.argv.includes('--commit');
  const k = JSON.parse(fs.readFileSync(path.resolve('service-account.json'), 'utf8'));
  const db = getFirestore(
    initializeApp({ credential: cert({ projectId: k.project_id, clientEmail: k.client_email, privateKey: k.private_key }) })
  );

  const items = rows();
  const byList = items.reduce<Record<string, number>>((acc, i) => {
    acc[i.list] = (acc[i.list] ?? 0) + 1;
    return acc;
  }, {});
  console.log('\nrows to write:', byList, `(total ${items.length})\n`);

  if (!commit) {
    console.log('Dry run only. Re-run with --commit to write.');
    return;
  }

  let batch = db.batch();
  let n = 0;
  for (const item of items) {
    batch.set(db.collection('reference').doc(item.id), item);
    if (++n % 400 === 0) {
      await batch.commit();
      batch = db.batch();
    }
  }
  await batch.commit();

  const schedules: ReferenceSchedule[] = [
    {
      id: 'mother-tincture',
      packSizes: ['30 ml', '100 ml', '450 ml'],
      rows: MOTHER_TINCTURE_PRICING.map((g) => ({
        key: g.grade,
        packs: g.packs.map((p) => ({ size: p.size, mrp: p.mrp })),
      })),
      note: MOTHER_TINCTURE_COMBO_NOTE,
    },
    {
      id: 'dilution',
      packSizes: ['10 ml', '30 ml', '100 ml', '450 ml'],
      rows: DILUTION_PRICING.map((r) => ({
        key: r.potency,
        packs: r.packs.map((p) => ({ size: p.size, mrp: p.mrp })),
      })),
      note: DILUTION_COMBO_NOTE,
    },
  ];
  for (const sch of schedules) {
    await db.collection('referenceSchedules').doc(sch.id).set(sch);
    console.log(`schedule ${sch.id}: ${sch.rows.length} rows`);
  }

  console.log(`Done. ${items.length} reference rows + ${schedules.length} schedules written.`);
}

run().catch((e) => { console.error('Failed:', e); process.exit(1); });
