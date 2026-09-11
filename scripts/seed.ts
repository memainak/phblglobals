/**
 * PHBL Firestore Seed Script
 * -----------------------------------------------------------------------------
 * Populates live Firestore with initial products, regulatory batches,
 * quality pillars, certifications, downloads, and site settings.
 *
 * Usage:
 *   npx ts-node scripts/seed.ts
 */

import fs from 'fs';
import path from 'path';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import {
  initialSiteSettings,
  initialProducts,
  initialBatches,
  initialQualityPillars,
  initialCertifications,
  initialDownloads,
  initialGallery,
  initialTestimonials,
} from '../src/lib/data/initialData';

async function seed() {
  let projectId = process.env.FIREBASE_PROJECT_ID || 'phblglobals';
  let clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  let privateKey = process.env.FIREBASE_PRIVATE_KEY;

  const localKeyPath = process.env.GOOGLE_APPLICATION_CREDENTIALS || path.resolve(process.cwd(), 'service-account.json');
  if ((!clientEmail || !privateKey) && fs.existsSync(localKeyPath)) {
    try {
      const fileData = JSON.parse(fs.readFileSync(localKeyPath, 'utf8'));
      if (fileData.client_email && fileData.private_key) {
        projectId = fileData.project_id || projectId;
        clientEmail = fileData.client_email;
        privateKey = fileData.private_key;
        console.log(`Loaded service account credentials from ${localKeyPath}`);
      }
    } catch (e) {
      console.warn('Found service account file but failed to parse JSON:', e);
    }
  }

  if (!projectId || !clientEmail || !privateKey) {
    console.error('Error: Missing service account credentials.');
    console.error('Please either:');
    console.error('  1. Place your downloaded Firebase service account JSON key as "service-account.json" in the project root, or');
    console.error('  2. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY in .env.local');
    process.exit(1);
  }

  privateKey = privateKey.replace(/\\n/g, '\n');

  const app = initializeApp({
    credential: cert({ projectId, clientEmail, privateKey }),
  });
  const db = getFirestore(app);

  console.log('Seeding PHBL Site Settings...');
  await db.collection('settings').doc('site').set(initialSiteSettings);

  console.log(`Seeding ${initialProducts.length} Products...`);
  for (const product of initialProducts) {
    await db.collection('products').doc(product.id).set(product);
  }

  console.log(`Seeding ${initialBatches.length} Regulatory Batches...`);
  for (const batch of initialBatches) {
    await db.collection('batches').doc(batch.batchNo).set(batch);
  }

  console.log(`Seeding ${initialQualityPillars.length} Quality Pillars...`);
  for (const pillar of initialQualityPillars) {
    await db.collection('qualityPillars').doc(pillar.slug).set(pillar);
  }

  console.log(`Seeding ${initialCertifications.length} Certifications...`);
  for (const certDoc of initialCertifications) {
    await db.collection('certifications').doc(certDoc.id).set(certDoc);
  }

  console.log(`Seeding ${initialDownloads.length} Downloadable Publications...`);
  for (const dl of initialDownloads) {
    await db.collection('downloads').doc(dl.id).set(dl);
  }

  console.log(`Seeding ${initialGallery.length} Gallery Archives...`);
  for (const gal of initialGallery) {
    await db.collection('gallery').doc(gal.id).set(gal);
  }

  console.log(`Seeding ${initialTestimonials.length} Testimonials...`);
  for (const test of initialTestimonials) {
    await db.collection('testimonials').doc(test.id).set(test);
  }

  console.log('PHBL Firestore Database successfully seeded!');
}

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
