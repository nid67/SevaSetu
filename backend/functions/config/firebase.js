const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

// Load environment variables from the backend root
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

if (!admin.apps.length) {
  const config = {
    projectId: process.env.FIREBASE_PROJECT_ID || 'sevasetu-4'
  };

  // Resolve service account path relative to backend root if it exists
  const saPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (saPath) {
    const resolvedPath = path.resolve(__dirname, '../../', saPath);
    if (fs.existsSync(resolvedPath)) {
      config.credential = admin.credential.cert(resolvedPath);
    }
  }

  admin.initializeApp(config);
}

const db = admin.firestore();
const storage = admin.storage();

module.exports = { admin, db, storage };
