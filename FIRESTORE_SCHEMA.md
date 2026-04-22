# Firestore Schema

**Collection:** `cases`

Each document in the `cases` collection represents a single intelligence report.

| Field | Type | Description | Contracts |
|-------|------|-------------|-----------|
| `case_id` | String | Unique ID (e.g., CAS-1234) | |
| `raw_input` | String | Original unstructured data | |
| `formatted_input` | String | Transcribed or OCR text | |
| `input_type` | String | `text`, `voice`, or `image` | |
| `structured_data` | Map | Contains `location`, `need`, `people` | **PS2, PS3, PS4** |
| `context` | Map | Contains `category`, `urgency_assessment` | **PS2, PS4** |
| `priority_score` | Number | Calculated priority (0-100) | **PS4** |
| `priority_breakdown` | Array | Text explanations of the score | **PS4** |
| `flags` | Map | `needs_human_review`, `possible_duplicate` | **PS2** |
| `pipeline_metadata` | Map | Array of processed stages, processing time | |
| `status` | String | Lifecycle: `pending_validation` -> `ready_for_verification` -> `verified` -> `assigned` -> `closed` | |
| `metadata` | Map | Creation time, volunteer ID, duplicate hash | |

## Example Document
```json
{
  "case_id": "CAS-9812",
  "raw_input": "We need immediate medical assistance here at the water tank, there are about forty to fifty people, several injured...",
  "formatted_input": "[Transcribed Voice] We need immediate medical assistance here at the water tank, there are about forty to fifty people, several injured...",
  "input_type": "voice",
  "structured_data": {
    "location": {
      "raw": "NEAR WATER TANK",
      "inferred_zone": null
    },
    "need": {
      "primary_need": "Medical Supplies",
      "specifics": "Immediate medical assistance, several injured"
    },
    "people": {
      "est_count": 50,
      "vulnerable_present": true
    }
  },
  "context": {
    "category": "Medical Emergency",
    "urgency_assessment": "High"
  },
  "priority_score": 85,
  "priority_breakdown": [
    "High Urgency Assessment (+40)",
    "Vulnerable Population Present (+30)",
    "Medium Group > 20 (+15)"
  ],
  "flags": {
    "needs_human_review": false,
    "possible_duplicate": false
  },
  "pipeline_metadata": {
    "version": "1.0.0",
    "processed_stages": [
      { "stage": "1_input_handling", "timestamp": "2023-10-27T10:00:00Z" },
      { "stage": "2_media_processing", "timestamp": "2023-10-27T10:00:01Z" },
      // ...
    ],
    "processing_time_ms": 2350
  },
  "status": "ready_for_verification",
  "metadata": {
    "created_at": "2023-10-27T10:00:00Z",
    "volunteer_id": "vol_492",
    "duplicate_hash": "a1b2c3d4..."
  }
}
```
