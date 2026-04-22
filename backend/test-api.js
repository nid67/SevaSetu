require('dotenv').config({ path: './.env' });
const admin = require('firebase-admin');
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function runDiagnostics() {
  console.log("\n🚀 Starting SevaSetu Diagnostics (Google AI SDK Fallback)...\n");
  const projectId = process.env.GCLOUD_PROJECT;
  console.log(`Project ID: ${projectId}\n`);

  // 1. Test Firestore
  try {
    const serviceAccount = require('./service-account.json');
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: projectId
      });
    }
    const db = admin.firestore();
    console.log("⏳ Attempting Firestore Write...");
    await db.collection('_system_health').doc('backend_test').set({ 
      last_check: new Date().toISOString(),
      status: "AI_SDK_FALLBACK_TEST"
    });
    console.log("✅ FIRESTORE: Write Successful!");
  } catch (err) {
    console.error("❌ FIRESTORE ERROR:", err.message);
  }

  // 2. Test Google AI SDK (Bypassing Vertex AI 404s)
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    console.log("⏳ Attempting Gemini Call via AI SDK...");
    const result = await model.generateContent("Reply with only 'AI_SDK_OK'");
    const response = await result.response;
    const text = response.text().trim();
    console.log(`✅ GEMINI AI: ${text}`);
  } catch (err) {
    console.error("❌ GEMINI AI ERROR:", err.message);
    console.log("👉 Tip: Make sure your API Key has 'Generative Language API' enabled.");
  }

  console.log("\n--- Diagnostics Complete ---\n");
  process.exit();
}

runDiagnostics();
