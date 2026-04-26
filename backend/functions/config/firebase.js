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
      // Force absolute path in environment so other Google SDKs can find it
      process.env.GOOGLE_APPLICATION_CREDENTIALS = resolvedPath;
      config.credential = admin.credential.cert(resolvedPath);
      console.log('[Firebase Config] Successfully loaded credentials from:', resolvedPath);
    } else {
      console.warn('[Firebase Config] Service account NOT found at:', resolvedPath);
    }
  }

  admin.initializeApp(config);
}

const db = admin.firestore();
const storage = admin.storage();

module.exports = { admin, db, storage };
