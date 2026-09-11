import type { App } from 'firebase-admin/app';
import type { Firestore } from 'firebase-admin/firestore';
import type { Auth } from 'firebase-admin/auth';
import type { Storage } from 'firebase-admin/storage';

let adminApp: App | null = null;
let adminDb: Firestore | null = null;
let adminAuth: Auth | null = null;
let adminStorage: Storage | null = null;
let initialized = false;

function initFirebaseAdmin() {
  if (initialized) return;
  initialized = true;

  try {
    const projectId = process.env.FIREBASE_PROJECT_ID || 'phblglobals';
    let clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    let privateKey = process.env.FIREBASE_PRIVATE_KEY;

    // Check for local service-account.json or GOOGLE_APPLICATION_CREDENTIALS if env vars are missing
    if (!clientEmail || !privateKey) {
      try {
        const fs = require('fs');
        const path = require('path');
        const localKeyPath =
          process.env.GOOGLE_APPLICATION_CREDENTIALS ||
          path.resolve(process.cwd(), 'service-account.json');
        if (fs.existsSync(/*turbopackIgnore: true*/ localKeyPath)) {
          const fileData = JSON.parse(fs.readFileSync(/*turbopackIgnore: true*/ localKeyPath, 'utf8'));
          if (fileData.client_email && fileData.private_key) {
            clientEmail = fileData.client_email;
            privateKey = fileData.private_key;
          }
        }
      } catch {
        // service-account file not found or unreadable in this runtime environment
      }
    }

    if (privateKey) {
      privateKey = privateKey.replace(/\\n/g, '\n');
    }

    // Only load native firebase-admin packages if all required credentials exist
    if (projectId && clientEmail && privateKey) {
      const { initializeApp, getApps, cert } = require('firebase-admin/app');
      const { getFirestore } = require('firebase-admin/firestore');
      const { getAuth } = require('firebase-admin/auth');
      const { getStorage } = require('firebase-admin/storage');

      const apps = getApps();
      adminApp =
        apps.length > 0
          ? apps[0]!
          : initializeApp({
              credential: cert({
                projectId,
                clientEmail,
                privateKey,
              }),
              storageBucket:
                process.env.FIREBASE_STORAGE_BUCKET || `${projectId}.firebasestorage.app`,
            });

      adminDb = adminApp ? getFirestore(adminApp) : null;
      adminAuth = adminApp ? getAuth(adminApp) : null;
      adminStorage = adminApp ? getStorage(adminApp) : null;
    }
  } catch (err) {
    console.warn('Firebase Admin safe init note:', err);
  }
}

initFirebaseAdmin();

export { adminApp, adminDb, adminAuth, adminStorage };

