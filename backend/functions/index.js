const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const { onRequest } = require('firebase-functions/v2/https');
const { onDocumentUpdated } = require('firebase-functions/v2/firestore');
const express = require('express');
const cors = require('cors');
const apiRoutes = require('./api/routes');
const { logger } = require('./utils/logger');
const runVerificationEngine = require('./pipeline/stages/08_verificationEngine');

const app = express();
app.use(cors({ origin: true }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// API Routes
app.use('/api/v1', apiRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  logger.error('Unhandled API Error', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    stage: err.stage || 'api_routing'
  });
});

// For local testing without emulators
if (process.env.NODE_ENV !== 'production' && require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Local server running on http://localhost:${PORT}/api/v1`);
  });
}

/* 
// PS2 - Verification & Trust Engine Trigger - DISABLED for manual verification
exports.onCaseReadyForVerification = onDocumentUpdated('cases/{caseId}', async (event) => {
  const beforeData = event.data.before.data();
  const afterData = event.data.after.data();

  const isNowReady = afterData.status === 'ready_for_verification';
  const wasNotReady = beforeData.status !== 'ready_for_verification';
  
  if (isNowReady && (wasNotReady || !afterData.verification)) {
    try {
      logger.info(`Triggering Verification Engine for case ${event.params.caseId}`);
      await runVerificationEngine(afterData);
    } catch (error) {
      logger.error(`Failed to verify case ${event.params.caseId}:`, error);
    }
  }
});
*/

exports.api = onRequest({ cors: true, maxInstances: 10 }, app);
