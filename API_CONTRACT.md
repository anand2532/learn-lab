# API Contract: `/api/ai/help`

## Endpoint
`GET /api/ai/help`

## Description
Returns short tips about sign-in benefits for the Study Buddy component. This endpoint provides educational tips that help users understand the value of signing in to the platform.

## Request

### Method
`GET`

### Headers
```
Content-Type: application/json
```

### Query Parameters
None

### Request Body
None

## Response

### Success Response (200 OK)

```json
{
  "tip": "Save your learning progress and track your journey",
  "allTips": [
    "Save your learning progress and track your journey",
    "Access personalized study recommendations",
    "Sync your data across all your devices",
    "Join study groups and collaborate with others",
    "Get AI-powered insights on your learning patterns"
  ],
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `tip` | `string` | A randomly selected tip from the available tips |
| `allTips` | `string[]` | Array of all available tips |
| `timestamp` | `string` | ISO 8601 timestamp of when the response was generated |

### Error Response (500 Internal Server Error)

```json
{
  "error": "Internal server error",
  "message": "Failed to fetch tips"
}
```

## Usage Example

### JavaScript/TypeScript (Client-side)

```typescript
async function fetchStudyBuddyTip() {
  try {
    const response = await fetch("/api/ai/help");
    const data = await response.json();
    console.log("Tip:", data.tip);
    console.log("All tips:", data.allTips);
  } catch (error) {
    console.error("Failed to fetch tip:", error);
  }
}
```

### React Hook Example

```typescript
import { useEffect, useState } from "react";

function StudyBuddy() {
  const [tip, setTip] = useState<string>("");

  useEffect(() => {
    fetch("/api/ai/help")
      .then((res) => res.json())
      .then((data) => setTip(data.tip))
      .catch((err) => console.error(err));
  }, []);

  return <div>{tip}</div>;
}
```

### cURL Example

```bash
curl -X GET http://localhost:3000/api/ai/help
```

## Implementation Notes

1. **Randomization**: The `tip` field is randomly selected from the `allTips` array on each request
2. **Caching**: Consider implementing caching if tips are static to reduce server load
3. **Future Enhancements**: This endpoint can be extended to:
   - Accept user context to provide personalized tips
   - Support filtering by category
   - Include dynamic tips based on user behavior
   - Integrate with AI services for generated tips

## Rate Limiting
Currently, no rate limiting is implemented. Consider adding rate limiting for production use.

## Authentication
Currently, no authentication is required. Consider adding authentication if tips become personalized or sensitive.

