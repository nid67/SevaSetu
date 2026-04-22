# SevaSetu PS1 - System Architecture

The Data Ingestion & Intelligence Layer is built as a sequential pipeline orchestrated by a central controller. This ensures modularity, testability, and stage-level error tracking.

## Pipeline Flow

1. **Input Handling (`01_inputHandling.js`)**: Normalizes incoming requests and initializes the case object with default flags.
2. **Media Processing (`02_mediaProcessor.js`)**: Converts voice and image inputs into text using Google Cloud Speech-to-Text and Vision APIs.
3. **Gemini Extraction (`03_geminiExtraction.js`)**: Passes the formatted text to Vertex AI (Gemini 1.5 Pro) with a strict prompt to extract location, needs, people count, and context (category, urgency). **Gemini is ONLY used for extraction and context.**
4. **Context Classification (`04_contextClassification.js`)**: Applies hybrid fallback rules if Gemini's extraction fails or misses obvious keywords.
5. **Priority Scoring (`05_priorityScoring.js`)**: **STRICTLY rule-based.** Calculates a priority score (0-100) based on the extracted context and population data. Generates a priority breakdown list.
6. **Data Cleaning (`06_dataCleaning.js`)**: Normalizes strings and calculates a lightweight duplicate hash based on location and primary need to flag potential duplicates.
7. **Case Building (`07_caseBuilding.js`)**: Aligns the data with the final Firestore schema, sets the initial lifecycle status, and writes the document to Firestore.

## Design Decisions
* **Why an Orchestrator?** It allows us to track `pipeline_metadata` (processing time, executed stages) and catch errors at the specific stage they occur.
* **Why restrict Gemini?** LLMs can be unpredictable. By strictly using Gemini for extraction and using code for logic/scoring, we guarantee that priority scores are reliable and auditable.
* **Why Firestore?** It allows downstream modules (PS2, PS3, PS4) and the frontend to listen to real-time updates via `onSnapshot`.
