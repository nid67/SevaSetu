# SevaSetu - Problem Statement 1 (Data Ingestion & Intelligence Layer)

This is the backend module for SevaSetu's Data Ingestion Layer. It acts as the entry point for all volunteer field reports, converting chaotic multi-modal data into structured, actionable intelligence.

## Features
- **Multi-modal Input**: Accepts text, voice, and image inputs.
- **AI Extraction**: Uses Vertex AI (Gemini 1.5 Pro) to extract structured data and identify the context of emergencies.
- **Rule-based Prioritization**: Guarantees consistent and reliable priority scoring without overloading the AI.
- **Pipeline Orchestrator**: Modular, 7-stage processing pipeline that transforms raw input into a complete Firestore document.
- **Real-time Ready**: Built around Firebase Firestore for instant UI updates.

## Structure
- `backend/functions/`: Contains the Firebase Cloud Functions source code.
- `backend/functions/pipeline/`: Contains the Orchestrator and individual Pipeline Stages.
- `backend/functions/api/`: Express API routes.
- `FIRESTORE_SCHEMA.md`: Documentation of the database structure.
- `ARCHITECTURE.md`: Overview of the pipeline architecture.
- `SETUP.md`: Setup and deployment instructions.
