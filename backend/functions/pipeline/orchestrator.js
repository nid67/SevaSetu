const { v4: uuidv4 } = require('uuid');
const { logger } = require('../utils/logger');
const { PipelineError } = require('../utils/errors');

const handleInput = require('./stages/01_inputHandling');
const processMedia = require('./stages/02_mediaProcessor');
const extractWithGemini = require('./stages/03_geminiExtraction');
const classifyContext = require('./stages/04_contextClassification');
const scorePriority = require('./stages/05_priorityScoring');
const cleanData = require('./stages/06_dataCleaning');
const buildAndStoreCase = require('./stages/07_caseBuilding');
const runVerificationEngine = require('./stages/08_verificationEngine');

async function processNewInput(rawData) {
  const caseId = `CAS-${Date.now().toString().slice(-4)}${Math.floor(Math.random() * 1000)}`;
  const startTime = Date.now();
  
  let currentCase = {
    case_id: caseId,
    pipeline_metadata: {
      version: '1.0.0',
      processed_stages: [],
      processing_time_ms: 0
    },
    metadata: {
      created_at: new Date().toISOString(),
      volunteer_id: rawData.volunteer_id || 'anonymous'
    },
    ai_summary: ""
  };

  try {
    logger.info(`Starting pipeline for ${caseId}`, { rawData });

    // Stage 1: Input Handling
    currentCase = await executeStage('1_input_handling', handleInput, currentCase, rawData);

    // Stage 2: Media Processor (STT / OCR)
    currentCase = await executeStage('2_media_processing', processMedia, currentCase);

    // Stage 3: Gemini Extraction
    currentCase = await executeStage('3_gemini_extraction', extractWithGemini, currentCase);

    // Stage 4: Context Classification (hybrid fallback)
    currentCase = await executeStage('4_context_classification', classifyContext, currentCase);

    // Stage 5: Priority Scoring (Rule-based)
    currentCase = await executeStage('5_priority_scoring', scorePriority, currentCase);

    // Stage 6: Data Cleaning & Normalization
    currentCase = await executeStage('6_data_cleaning', cleanData, currentCase);

    // Stage 7: Case Building & Storage
    currentCase = await executeStage('7_case_building', buildAndStoreCase, currentCase);

    currentCase.pipeline_metadata.processing_time_ms = Date.now() - startTime;
    logger.info(`Pipeline completed for ${caseId}`);
    
    return currentCase;

  } catch (error) {
    logger.error(`Pipeline failed for ${caseId} at stage ${error.stage || 'unknown'}`, error);
    throw new PipelineError(error.stage || 'unknown', error.message, error);
  }
}

async function executeStage(stageName, stageFunction, currentCase, ...args) {
  logger.info(`Executing stage: ${stageName}`);
  try {
    const updatedCase = await stageFunction(currentCase, ...args);
    updatedCase.pipeline_metadata.processed_stages.push({
      stage: stageName,
      timestamp: new Date().toISOString()
    });
    return updatedCase;
  } catch (error) {
    throw new PipelineError(stageName, `Failed at ${stageName}: ${error.message}`, error);
  }
}

module.exports = { processNewInput };
