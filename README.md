# 🐾 Pawsport – About the Project
For every pet who deserves a smooth journey—and a friend to boop at the end.

> **🚀 Now running serverless on Vercel!** See [DEPLOYMENT.md](DEPLOYMENT.md) for migration details.

## Inspiration
Moving or traveling across borders is stressful enough — doing it with pets can feel overwhelming. Regulations vary widely, airlines have different rules, documentation is confusing, and reliable guidance is scattered across the internet.

As someone who may need to relocate internationally with two cats, I struggled to find a clear, supportive community for pet parents navigating global mobility. That experience inspired **Pawsport**: an AI-powered platform that helps people travel or relocate with their pets confidently — and connects them to others making similar journeys.

Pawsport combines practical travel support with a warm social layer called **Nose Booper**, inspired by my cat Huringda, who always greets new friends with a gentle nose touch.

---

## What it does

### **1. AI Pet Travel & Relocation Assistant**
Pawsport generates:
- Personalized travel checklists based on origin, destination, species, breed, and vaccination status  
- Summaries of complex regulations into simple, actionable steps and timelines  
- Country-specific cultural notes around pet ownership  
- AI-powered explanations of veterinary documents and travel paperwork  

### **2. Nose Booper – The Community Layer**
A supportive space for:
- Connecting with pet owners traveling similar routes  
- Finding local pet communities after relocation  
- Sharing experiences, asking questions, and making new “fur friends”  

Together, these features make global pet mobility easier, safer, and more connected.

---

## How we built it
- **Frontend**: React 17 + TypeScript SPA with React Router v5
- **Backend**: Converted from Express monolith to Vercel serverless functions
- **Architecture**: Serverless API functions in `/api`, shared services in `/lib`
- **LLM Integration**: Powers travel-rule explanation engine, documentation summarizer, and cultural guidance  
- **Matching Module**: Basic recommendation engine for nearby or route-related pet connections  
- **Community Feed**: Nose Booper using seeded sample profiles  
- **Deployment**: Vercel with automatic CI/CD from GitHub

---

## Project Structure
```
Pawsport
├── api/                      # Serverless API functions
│   ├── travel/
│   │   ├── checklist.ts      # POST /api/travel/checklist
│   │   ├── regulations.ts    # GET /api/travel/regulations
│   │   └── documents.ts      # POST /api/travel/documents
│   └── community/
│       └── posts.ts          # GET/POST/DELETE /api/community/posts
├── lib/                      # Shared business logic
│   ├── services/
│   │   ├── llmService.ts
│   │   ├── regulationService.ts
│   │   ├── communityService.ts
│   │   └── matchingService.ts
│   └── types/
│       └── index.ts
├── client/                   # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── TravelAssistant/
│   │   │   │   ├── TravelChecklist.tsx
│   │   │   │   ├── RegulationSummary.tsx
│   │   │   │   └── DocumentExplainer.tsx
│   │   │   ├── NoseBooper/
│   │   │   │   ├── CommunityFeed.tsx
│   │   │   │   ├── PetProfile.tsx
│   │   │   │   └── MatchingModule.tsx
│   │   │   └── shared/
│   │   │       ├── Header.tsx
│   │   │       └── Footer.tsx
│   │   ├── pages/
│   │   │   ├── Home.tsx
│   │   │   ├── TravelPlanner.tsx
│   │   │   └── Community.tsx
│   │   ├── services/
│   │   │   └── api.js
│   │   └── types/
│   │       └── index.ts
│   └── package.json
├── server/                   # Legacy Express server (preserved for reference)
├── vercel.json               # Vercel deployment configuration
├── package.json              # Root dependencies for API functions
└── DEPLOYMENT.md             # Serverless migration guide
```

---

## Quick Start

### Local Development
```bash
# Install dependencies
npm install
cd client && npm install && cd ..

# Run with Vercel CLI (recommended)
npm install -g vercel
vercel dev

# Access app at http://localhost:3000
```

### Deploy to Vercel
```bash
# Via CLI
vercel --prod

# Or connect GitHub repo to Vercel dashboard for auto-deployment
```

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions.

---

## Environment Variables
Create `.env` file at root:
```
LLM_API_URL=https://your-llm-api.com/endpoint
```

---