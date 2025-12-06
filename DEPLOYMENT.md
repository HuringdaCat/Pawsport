# Pawsport - Serverless Deployment Guide

## 🚀 Vercel Deployment

This app has been converted to run serverlessly on Vercel with:
- **Frontend**: React SPA served as static files
- **Backend**: Serverless API functions in `/api` directory
- **Shared Code**: Service layer in `/lib` directory

### Architecture Changes

#### Before (Monolithic Express)
```
server/ → Express app on port 5000
client/ → React dev server on port 3000
```

#### After (Serverless)
```
api/
  ├── travel/
  │   ├── checklist.ts      → /api/travel/checklist
  │   ├── regulations.ts    → /api/travel/regulations
  │   └── documents.ts      → /api/travel/documents
  └── community/
      └── posts.ts          → /api/community/posts (GET/POST/DELETE)

lib/
  ├── services/             → Shared business logic
  └── types/                → TypeScript types

client/build/               → Static React build
```

---

## 📦 Deployment Steps

### 1. Prerequisites
```bash
npm install -g vercel
```

### 2. Install Dependencies
```bash
# Root dependencies (for API functions)
npm install

# Client dependencies
cd client
npm install
cd ..
```

### 3. Local Development
```bash
# Run Vercel dev server (simulates serverless environment)
vercel dev

# This will:
# - Start serverless functions at http://localhost:3000/api
# - Serve React app at http://localhost:3000
# - Hot reload both frontend and API changes
```

### 4. Deploy to Vercel

#### Option A: Via Vercel CLI
```bash
# First time: Link to Vercel project
vercel

# Production deployment
vercel --prod
```

#### Option B: Via GitHub Integration (Recommended)
1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project" → Import from GitHub
4. Select `Pawsport` repository
5. Vercel auto-detects configuration from `vercel.json`
6. Click "Deploy"

### 5. Environment Variables
Set in Vercel Dashboard → Project Settings → Environment Variables:

```
LLM_API_URL=https://your-llm-api.com/endpoint
```

---

## 🧪 Testing Serverless Functions Locally

### Test Individual Endpoints
```bash
# Travel checklist
curl -X POST http://localhost:3000/api/travel/checklist \
  -H "Content-Type: application/json" \
  -d '{
    "origin": "USA",
    "destination": "France",
    "species": "Dog",
    "breed": "Golden Retriever",
    "vaccinationStatus": "Up to date"
  }'

# Get regulations
curl "http://localhost:3000/api/travel/regulations?country=France"

# Community posts
curl http://localhost:3000/api/community/posts
```

---

## 📁 File Structure

### API Functions (Serverless)
Each file in `api/` becomes a serverless function endpoint:

**Pattern**: `api/[folder]/[file].ts` → `/api/[folder]/[file]`

**Example**:
- `api/travel/checklist.ts` → `POST /api/travel/checklist`
- `api/community/posts.ts` → `GET/POST/DELETE /api/community/posts`

### Shared Services (`lib/`)
Business logic reused across functions:
- `lib/services/llmService.ts` - LLM API integration
- `lib/services/regulationService.ts` - Regulation data
- `lib/services/communityService.ts` - Community posts (mock data)
- `lib/types/index.ts` - TypeScript interfaces

---

## 🔧 Migration Changes

### 1. API Endpoints Updated
Client API calls now use relative paths:
```javascript
// Before
const API_BASE_URL = 'http://localhost:5000/api';

// After
const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';
```

### 2. Express → Vercel Handlers
Controllers converted to serverless functions:
```typescript
// Before (Express)
router.post('/checklist', controller.getTravelChecklist);

// After (Vercel)
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({...});
  // ... handle request
}
```

### 3. Service Classes Preserved
No changes to business logic - services work identically:
```typescript
const llmService = new LLMService();
const data = await llmService.getTravelChecklist(params);
```

---

## ⚠️ Important Notes

### Cold Starts
- First request to a function may take 1-3 seconds
- Subsequent requests are fast (~50-200ms)
- Vercel keeps functions warm with traffic

### Stateless Functions
- Each request creates a new function instance
- No shared state between requests
- Mock data (community posts) resets per request
- **TODO**: Add database for persistence (MongoDB Atlas, DynamoDB, etc.)

### CORS Handling
- Vercel automatically handles CORS
- No need for Express cors middleware

---

## 🎯 Next Steps (Optional Enhancements)

### 1. Add Database
Replace mock data with real database:
```bash
# Option A: MongoDB Atlas
npm install mongodb

# Option B: Vercel Postgres
npm install @vercel/postgres
```

### 2. Add Authentication
```bash
npm install @vercel/auth0  # or any auth provider
```

### 3. Add Rate Limiting
Use Vercel Edge Config or Upstash Redis

### 4. Add Monitoring
- Vercel Analytics (built-in)
- Sentry for error tracking
- LogTail for logs

---

## 📊 Comparison: Before vs After

| Feature | Before (Express) | After (Vercel) |
|---------|------------------|----------------|
| **Server** | Always running on port 5000 | Serverless (pay-per-request) |
| **Scaling** | Manual (PM2/Docker) | Automatic (infinite) |
| **Cold Start** | None | 1-3s first request |
| **Cost** | ~$5-50/month (hosting) | Free tier → $0-20/month |
| **Deployment** | Manual SSH/Docker | Git push → auto-deploy |
| **HTTPS** | Manual cert setup | Automatic |
| **CDN** | Separate setup | Built-in global CDN |

---

## 🐛 Troubleshooting

### "Module not found" errors
```bash
# Ensure dependencies are installed at root
npm install
```

### API returns 404
- Check `vercel.json` rewrites
- Verify file names match routes
- Restart `vercel dev`

### Client can't reach API
- Ensure `REACT_APP_API_URL` is not set to localhost in production
- Check browser network tab for CORS errors

### LLM API errors
- Verify `LLM_API_URL` environment variable
- Check Vercel Dashboard → Environment Variables

---

## 📚 Resources
- [Vercel Serverless Functions Docs](https://vercel.com/docs/functions)
- [Vercel Node.js Runtime](https://vercel.com/docs/runtimes#official-runtimes/node-js)
- [Environment Variables](https://vercel.com/docs/environment-variables)

---

**Migration Completed**: December 2025
**Original Server Code**: Preserved in `/server` directory (for reference)
