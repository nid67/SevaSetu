const { db } = require('../../config/firebase');

async function buildAndStoreCase(currentCase) {
  // Final schema alignment
  const finalCase = {
    case_id: currentCase.case_id,
    
    // Raw inputs
    raw_input: currentCase.raw_input,
    formatted_input: currentCase.formatted_input,
    input_type: currentCase.input_type,
    
    // [CONTRACT] PS2 reads this
    // [CONTRACT] PS3 reads this
    // [CONTRACT] PS4 reads this
    structured_data: currentCase.structured_data,
    
    // [CONTRACT] PS2 reads this
    // [CONTRACT] PS4 reads this
    context: currentCase.context,
    
    // [CONTRACT] PS4 reads this
    priority_score: currentCase.priority_score,
    priority_breakdown: currentCase.priority_breakdown,
    
    // [CONTRACT] PS2 reads this
    flags: currentCase.flags,
    
    pipeline_metadata: currentCase.pipeline_metadata,
    
    // Lifecycle status
    // "pending_validation" -> "ready_for_verification" -> "verified" -> "assigned" -> "closed"
    status: currentCase.flags.needs_human_review ? 'pending_validation' : 'ready_for_verification',
    
    metadata: currentCase.metadata
  };

  // Store in Firestore
  await db.collection('cases').doc(finalCase.case_id).set(finalCase);

  return finalCase;
}

module.exports = buildAndStoreCase;
