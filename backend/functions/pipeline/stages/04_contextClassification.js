async function classifyContext(currentCase) {
  // Hybrid fallback rules to ensure robust classification.
  // We trust Gemini's extraction, but add guardrails.
  
  let { category, urgency_assessment } = currentCase.context;
  const { vulnerable_present, est_count } = currentCase.structured_data.people;
  const { primary_need } = currentCase.structured_data.need;

  const text = currentCase.formatted_input.toLowerCase();

  // Basic keyword fallbacks if Gemini failed
  if (category === "Unknown") {
    if (text.includes("flood") || text.includes("water")) category = "Water Emergency";
    else if (text.includes("fire")) category = "Fire Emergency";
    else if (text.includes("collapse") || text.includes("earthquake")) category = "Infrastructure Damage";
    else if (text.includes("doctor") || text.includes("medical") || text.includes("blood")) category = "Medical Emergency";
    else category = "General Request";
  }

  // Adjust urgency based on known high-risk triggers
  if (vulnerable_present || est_count > 50 || text.includes("critical") || text.includes("dying")) {
    urgency_assessment = "High";
  } else if (urgency_assessment === "Unknown" && (text.includes("urgent") || text.includes("fast"))) {
    urgency_assessment = "Medium";
  }

  return {
    ...currentCase,
    context: {
      category,
      urgency_assessment
    }
  };
}

module.exports = classifyContext;
