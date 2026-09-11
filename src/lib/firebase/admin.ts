import fs from 'fs';
import path from 'path';
import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { getAuth, Auth } from 'firebase-admin/auth';
import { getStorage, Storage } from 'firebase-admin/storage';

function getAdminApp(): App | null {
  if (getApps().length > 0) {
    return getApps()[0]!;
  }

  const projectId = process.env.FIREBASE_PROJECT_ID || 'phblglobals';
  let clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  let privateKey = process.env.FIREBASE_PRIVATE_KEY;

  // Check for local service-account.json or GOOGLE_APPLICATION_CREDENTIALS
  const localKeyPath = process.env.GOOGLE_APPLICATION_CREDENTIALS || path.resolve(process.cwd(), 'service-account.json');
  if ((!clientEmail || !privateKey) && fs.existsSync(/*turbopackIgnore: true*/ localKeyPath)) {
    try {
      const fileData = JSON.parse(fs.readFileSync(/*turbopackIgnore: true*/ localKeyPath, 'utf8'));
      if (fileData.client_email && fileData.private_key) {
        clientEmail = fileData.client_email;
        privateKey = fileData.private_key;
      }
    } catch (e) {
      console.warn('Found service account file but failed to parse JSON:', e);
    }
  }

  if (privateKey) {
    privateKey = privateKey.replace(/\\n/g, '\n');
  }

  if (projectId && clientEmail && privateKey) {
    try {
      return initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey,
        }),
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET || `${projectId}.firebasestorage.app`,
      });
    } catch (err) {
      console.warn('Failed to initialize Firebase Admin with credentials:', err);
      return null;
    }
  }

  return null;
}

export const adminApp: App | null = getAdminApp();
export const adminDb: Firestore | null = adminApp ? getFirestore(adminApp) : null;
export const adminAuth: Auth | null = adminApp ? getAuth(adminApp) : null;
export const adminStorage: Storage | null = adminApp ? getStorage(adminApp) : null;
