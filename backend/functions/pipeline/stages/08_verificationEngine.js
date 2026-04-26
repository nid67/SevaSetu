const { db } = require('../../config/firebase');
const { generativeModel } = require('../../config/gemini');
const { verificationPrompt } = require('../../prompts/verificationPrompt');
const { logger } = require('../../utils/logger');

async function runVerificationEngine(caseData) {
  try {
    logger.info(`Starting verification for case: ${caseData.case_id}`);

    // 1. Fetch nearby cases for duplicate detection
    // Simple heuristic: Same city or neighborhood
    const city = caseData.structured_data.location.city || caseData.structured_data.location.raw;
    
    let nearbyCases = [];
    if (city && city !== "Unknown") {
      const snapshot = await db.collection('cases')
        .where('structured_data.location.city', '==', city)
        .where('status', 'in', ['ready_for_verification', 'verified', 'assigned'])
        .limit(10)
        .get();

      snapshot.forEach(doc => {
        if (doc.id !== caseData.case_id) {
          nearbyCases.push({
            id: doc.id,
            need: doc.structured_data.need,
            context: doc.context,
            summary: doc.ai_summary
          });
        }
      });
    }

    // 2. Prepare Gemini Prompt
    const prompt = `
      ${verificationPrompt}
      
      CURRENT CASE:
      ${JSON.stringify({
        structured_data: caseData.structured_data,
        context: caseData.context,
        raw_input: caseData.raw_input,
        metadata: caseData.metadata
      }, null, 2)}

      NEARBY CASES:
      ${JSON.stringify(nearbyCases, null, 2)}
    `;

    // 3. Call Gemini Flash
    const result = await generativeModel.generateContent(prompt);
    const responseText = result.response.text();
    
    // Parse JSON safely
    const cleanedText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    const verificationResults = JSON.parse(cleanedText);

    // 4. Prepare the update
    const update = {
      verification: {
        trust_score: verificationResults.trust_score,
        is_duplicate: verificationResults.is_duplicate,
        duplicate_case_ids: verificationResults.duplicate_case_ids || [],
        suspicion_flag: verificationResults.suspicion_flag,
        explanation: verificationResults.explanation,
        verified_at: new Date().toISOString()
      },
      status: 'verified'
    };

    // 5. Update Firestore
    await db.collection('cases').doc(caseData.case_id).update(update);
    
    logger.info(`Verification complete for case: ${caseData.case_id}. Status: verified`);

    return { ...caseData, ...update };
  } catch (error) {
    logger.error(`Verification failed for case: ${caseData.case_id}`, error);
    
    // Fallback if AI fails
    const fallbackUpdate = {
      verification: {
        trust_score: 0.5,
        is_duplicate: false,
        duplicate_case_ids: [],
        suspicion_flag: true,
        explanation: "Verification engine failed to process automatically. Requires manual review.",
        error: error.message
      },
      status: 'ready_for_verification' // Don't mark as verified if it failed
    };
    
    await db.collection('cases').doc(caseData.case_id).update(fallbackUpdate);
    throw error;
  }
}

module.exports = runVerificationEngine;
