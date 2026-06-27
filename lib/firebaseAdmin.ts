import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(require('../serviceAccountKey.json')) 
  });
}

export const authAdmin = admin.auth();
export const dbAdmin = admin.firestore();

