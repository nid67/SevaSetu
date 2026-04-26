const { db } = require('../config/firebase');
const runVerificationEngine = require('../pipeline/stages/08_verificationEngine');
const { logger } = require('../utils/logger');

async function batchVerify() {
  logger.info('Starting batch verification for all unverified cases...');
  
  try {
    const snapshot = await db.collection('cases')
      .where('status', 'in', ['ready_for_verification', 'pending_validation'])
      .get();

    logger.info(`Found ${snapshot.size} cases to verify.`);

    let count = 0;
    for (const doc of snapshot.docs) {
      const data = doc.data();
      if (!data.verification) {
        logger.info(`Verifying case: ${data.case_id}...`);
        try {
          await runVerificationEngine(data);
          count++;
        } catch (err) {
          logger.error(`Failed to verify case ${data.case_id}:`, err);
        }
      }
    }

    logger.info(`Batch verification complete. Processed ${count} cases.`);
    process.exit(0);
  } catch (error) {
    logger.error('Batch verification failed:', error);
    process.exit(1);
  }
}

batchVerify();
