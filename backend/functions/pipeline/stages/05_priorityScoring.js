// STRICTLY rule-based, NOT Gemini
async function scorePriority(currentCase) {
  let score = 0;
  const breakdown = [];

  const { urgency_assessment } = currentCase.context;
  const { vulnerable_present, est_count } = currentCase.structured_data.people;

  // 1. Base Urgency Score (Max 40)
  if (urgency_assessment === 'High') {
    score += 40;
    breakdown.push('High Urgency Assessment (+40)');
  } else if (urgency_assessment === 'Medium') {
    score += 20;
    breakdown.push('Medium Urgency Assessment (+20)');
  }

  // 2. Vulnerability Impact (Max 30)
  if (vulnerable_present) {
    score += 30;
    breakdown.push('Vulnerable Population Present (+30)');
  }

  // 3. Scale Impact (Max 30)
  if (est_count > 100) {
    score += 30;
    breakdown.push('Mass Casualty/Large Group > 100 (+30)');
  } else if (est_count > 20) {
    score += 15;
    breakdown.push('Medium Group > 20 (+15)');
  } else if (est_count > 0) {
    score += 5;
    breakdown.push('Small Group (+5)');
  }

  // Ensure 0-100 bounds
  const priority_score = Math.min(Math.max(score, 0), 100);

  // Set review flag if extremely low info
  if (priority_score === 0) {
    currentCase.flags.needs_human_review = true;
  }

  return {
    ...currentCase,
    priority_score,
    priority_breakdown: breakdown
  };
}

module.exports = scorePriority;
