const { VertexAI } = require('@google-cloud/vertexai');

// Initialize Vertex AI
const project = process.env.GOOGLE_CLOUD_PROJECT || process.env.GCLOUD_PROJECT || 'sevasetu-demo';
const location = 'us-central1';

const vertexAI = new VertexAI({ 
  project: project, 
  location: 'us-central1' 
});

const modelId = 'gemini-1.5-flash';
// Instantiate Gemini Pro model
const generativeModel = vertexAI.getGenerativeModel({
  model: modelId,
  generationConfig: {
    temperature: 0.1, // Keep it deterministic for structured extraction
    responseMimeType: 'application/json',
  }
});

module.exports = { generativeModel };
