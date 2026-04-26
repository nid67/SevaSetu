const express = require('express');
const { processNewInput } = require('../pipeline/orchestrator');
const { db } = require('../config/firebase');

const router = express.Router();

// POST /api/v1/ingest - Ingest raw data
router.post('/ingest', async (req, res, next) => {
  try {
    const rawData = req.body; // e.g. { input_type: 'text', content: '...', volunteer_id: '123' }
    
    // Quick validation
    if (!rawData.input_type || !rawData.content) {
      return res.status(400).json({ error: 'Missing input_type or content' });
    }

    // Process pipeline
    const result = await processNewInput(rawData);

    res.status(202).json({
      message: 'Ingestion completed successfully',
      case_id: result.case_id,
      status: result.status
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/case/:caseId
router.get('/case/:caseId', async (req, res, next) => {
  try {
    const { caseId } = req.params;
    const doc = await db.collection('cases').doc(caseId).get();
    
    if (!doc.exists) {
      return res.status(404).json({ error: 'Case not found' });
    }

    res.status(200).json(doc.data());
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/cases/pending
router.get('/cases/pending', async (req, res, next) => {
  try {
    const snapshot = await db.collection('cases')
      .where('status', '==', 'pending_validation')
      .orderBy('metadata.created_at', 'desc')
      .limit(50)
      .get();
      
    const cases = [];
    snapshot.forEach(doc => cases.push(doc.data()));
    
    res.status(200).json({ cases });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/v1/validate/:caseId
router.patch('/validate/:caseId', async (req, res, next) => {
  try {
    const { caseId } = req.params;
    const updates = req.body;

    const docRef = db.collection('cases').doc(caseId);
    
    await docRef.update({
      ...updates,
      status: 'ready_for_verification', // Moving to PS2
      'metadata.updated_at': new Date().toISOString()
    });

    res.status(200).json({ message: 'Case validated successfully' });
  } catch (error) {
    next(error);
  }
});

const runVerificationEngine = require('../pipeline/stages/08_verificationEngine');

// POST /api/v1/handoff/:caseId
router.post('/handoff/:caseId', async (req, res, next) => {
  try {
    const { caseId } = req.params;
    
    const docRef = db.collection('cases').doc(caseId);
    await docRef.update({
      status: 'verified', // Simulation of handoff
      'metadata.handed_off_at': new Date().toISOString()
    });

    res.status(200).json({ message: 'Handoff successful' });
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/verify/:caseId - Manually trigger PS2 Verification
router.post('/verify/:caseId', async (req, res, next) => {
  try {
    const { caseId } = req.params;
    const doc = await db.collection('cases').doc(caseId).get();
    
    if (!doc.exists) {
      return res.status(404).json({ error: 'Case not found' });
    }

    const result = await runVerificationEngine(doc.data());
    res.status(200).json({ 
      message: 'Verification successful', 
      verification: result.verification,
      status: result.status 
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
