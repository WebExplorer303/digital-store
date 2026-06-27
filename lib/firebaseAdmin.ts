import * as admin from "firebase-admin";

if (!admin.apps.length) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT!);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.DATABASE_URL
  });
}

export const authAdmin = admin.auth();
export const dbAdmin = admin.firestore();