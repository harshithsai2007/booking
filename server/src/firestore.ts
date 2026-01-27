import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import path from 'path';

// Load service account key
const serviceAccount = JSON.parse(
    readFileSync(path.join(__dirname, '..', 'firebase-service-account.json'), 'utf8')
);

// Initialize Firebase Admin
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount)
});

// Get Firestore instance
const db = admin.firestore();

// Export both admin and db
export { admin, db };
export default db;
