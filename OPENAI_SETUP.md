# OpenAI Setup Guide

## Configuration

Your OpenAI API key is already configured in:
- **Root `.env`**: `OPENAI_API_KEY=sk-proj-...`
- **Server `.env`**: `OPENAI_API_KEY=sk-proj-...`

## How It Works

The structured planning system uses OpenAI GPT-4 to generate travel plans with:

1. **Strict JSON Schema** - Enforces timeline and checklist structure
2. **Validation** - Checks all required fields are present
3. **Retry Logic** - Attempts up to 3 times if validation fails
4. **Structured UI** - Renders timeline and checklist components

## Testing

### 1. Restart the Server

After any code changes, you MUST restart:

```bash
cd server
# Press Ctrl+C to stop if running
npm run dev
```

### 2. Test in Browser

Navigate to: `http://localhost:3000/travel-planner`

Click **"Travel Checklist"** button and wait for the plan to generate.

### 3. Test with API

```bash
curl -X POST http://localhost:5000/api/travel/checklist \
  -H "Content-Type: application/json" \
  -d '{
    "origin": "New York",
    "destination": "London",
    "species": "dog",
    "breed": "Labrador",
    "vaccinationStatus": "up-to-date",
    "travelDate": "2024-06-01T00:00:00Z"
  }'
```

## Expected Response

### Success
```json
{
  "success": true,
  "plan": {
    "origin": "New York",
    "destination": "London",
    "timeline": [...],
    "checklist": [...]
  }
}
```

### Validation Failure
```json
{
  "success": false,
  "warnings": [
    "timeline[0].date missing",
    "checklist[2].priority invalid"
  ]
}
```

## Troubleshooting

### "Failed to connect to the AI service"
- ✅ Server must be restarted after code changes
- ✅ Check `OPENAI_API_KEY` is set in `server/.env`
- ✅ Verify you have OpenAI API credits

### "Invalid API key"
- Check your OpenAI API key at https://platform.openai.com/api-keys
- Ensure it starts with `sk-proj-` or `sk-`

### "Rate limit exceeded"
- You've hit OpenAI's rate limit
- Wait a few minutes and try again
- Consider upgrading your OpenAI plan

### "Model not found" or "GPT-4 access"
If you don't have GPT-4 access, edit `server/src/services/llmService.ts`:

```typescript
// Change line ~19:
model: 'gpt-3.5-turbo',  // Instead of 'gpt-4'
```

Then restart the server.

## What Gets Sent to OpenAI

The system sends a detailed prompt with the JSON schema:

```
You are a pet travel planning assistant. Generate a structured travel plan in STRICT JSON format.

REQUIRED JSON SCHEMA:
{
  "origin": "New York",
  "destination": "London",
  "species": "dog",
  "breed": "Labrador",
  "travelDate": "ISO 8601 date string",
  "timeline": [ ... ],
  "checklist": [ ... ],
  "regulationSummary": "...",
  "criticalAlerts": [ ... ]
}
```

OpenAI responds with the structured JSON, which is then validated before being sent to the UI.

