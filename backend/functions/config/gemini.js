const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Google Generative AI with the API key from .env
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("GEMINI_API_KEY is not set in the environment variables.");
}
const genAI = new GoogleGenerativeAI(apiKey);

const modelId = 'gemini-flash-latest';
// Instantiate Gemini model
const generativeModel = genAI.getGenerativeModel({
  model: modelId,
  generationConfig: {
    temperature: 0.1, // Keep it deterministic for structured extraction
    responseMimeType: 'application/json',
  }
});

module.exports = { generativeModel };
