# Setup Instructions

## Prerequisites
- Node.js 20+
- Firebase CLI (`npm install -g firebase-tools`)
- A Google Cloud Project with the following APIs enabled:
  - Vertex AI API
  - Cloud Speech-to-Text API (Optional, for voice inputs)
  - Cloud Vision API (Optional, for image inputs)

## Local Development

1. **Install Dependencies**
   ```bash
   cd backend/functions
   npm install
   ```

2. **Environment Variables**
   Copy the example environment file and fill in your details:
   ```bash
   cp .env.example .env
   ```
   Ensure you have a service account key JSON file from your Google Cloud project and point `GOOGLE_APPLICATION_CREDENTIALS` to it.

3. **Firebase Authentication**
   Authenticate with Firebase CLI:
   ```bash
   firebase login
   firebase use --add  # Select your project
   ```

4. **Run the Emulators (Recommended for testing)**
   Start the local Firebase emulators (Firestore, Functions):
   ```bash
   npm run serve
   ```
   This will spin up a local instance of the backend. The API will be available at `http://127.0.0.1:5001/<your-project-id>/<region>/api`.

## Deployment

Deploy the functions to Firebase:
```bash
npm run deploy
```

## Testing the API

You can test the ingestion endpoint locally using `curl`:

```bash
curl -X POST http://127.0.0.1:5001/<your-project-id>/us-central1/api/api/v1/ingest \
-H "Content-Type: application/json" \
-d '{
  "input_type": "text",
  "content": "We need immediate medical assistance here at Sector 4, there are about forty to fifty people, several injured...",
  "volunteer_id": "vol_492"
}'
```
