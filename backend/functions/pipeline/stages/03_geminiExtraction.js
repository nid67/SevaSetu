const { generativeModel } = require('../../config/gemini');
const { extractionPrompt } = require('../../prompts/extractionPrompt');

async function extractWithGemini(currentCase) {
  const prompt = `${extractionPrompt}\n\nRaw Input: ${currentCase.formatted_input}`;
  
  try {
    const result = await generativeModel.generateContent(prompt);
    const responseText = result.response.text();
    
    // Parse JSON safely
    const cleanedText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    const extractedData = JSON.parse(cleanedText);

    return {
      ...currentCase,
      structured_data: {
        location: extractedData.location || { raw: "Unknown", inferred_zone: null },
        need: extractedData.need || { primary_need: "Unknown", specifics: "" },
        people: extractedData.people || { est_count: 0, vulnerable_present: false }
      },
      context: extractedData.context || { category: "Unknown", urgency_assessment: "Low" }
    };
  } catch (error) {
    // Graceful degradation
    return {
      ...currentCase,
      flags: {
        ...currentCase.flags,
        needs_human_review: true,
        ai_extraction_failed: true
      },
      structured_data: {
        location: { raw: "Unknown", inferred_zone: null },
        need: { primary_need: "Uncategorized", specifics: "Failed to parse" },
        people: { est_count: 0, vulnerable_present: false }
      },
      context: {
        category: "Unknown",
        urgency_assessment: "Low"
      }
    };
  }
}
module.exports = extractWithGemini;
