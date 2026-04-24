const { generativeModel } = require('../../config/gemini');
const { extractionPrompt } = require('../../prompts/extractionPrompt');

async function extractWithGemini(currentCase) {
  const prompt = `${extractionPrompt}\n\nTask: Extract information from the provided input. If it's an image, look for text, context, and situational details. If it's voice, analyze the transcription. If it's text, analyze the content. Respond ONLY with the JSON object.`;
  
  try {
    let parts = [{ text: prompt }];

    // If we have media content, send it to Gemini
    if (currentCase.media_base64 && currentCase.mime_type) {
      parts.push({
        inlineData: {
          data: currentCase.media_base64,
          mimeType: currentCase.mime_type
        }
      });
      // Also include the raw input context (e.g. "[Uploaded File: ...]")
      parts.push({ text: `Context: ${currentCase.raw_input}` });
    } else {
      parts.push({ text: `Raw Input: ${currentCase.formatted_input}` });
    }

    const result = await generativeModel.generateContent(parts);
    const responseText = result.response.text();
    
    // Parse JSON safely
    const cleanedText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    const extractedData = JSON.parse(cleanedText);

    return {
      ...currentCase,
      ai_summary: extractedData.summary || "Summary not generated.",
      structured_data: {
        location: extractedData.location || { raw: "Unknown", inferred_zone: null },
        need: extractedData.need || { primary_need: "Unknown", specifics: "" },
        people: extractedData.people || { est_count: 0, vulnerable_present: false }
      },
      context: extractedData.context || { category: "Unknown", urgency_assessment: "Low" }
    };
  } catch (error) {
    const { logger } = require('../../utils/logger');
    logger.error('Gemini extraction failed:', error);
    // Graceful degradation
    return {
      ...currentCase,
      ai_summary: "AI failed to generate a summary for this report.",
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
