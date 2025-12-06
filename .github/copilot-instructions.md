# Pawsport AI Coding Agent Instructions

## Project Overview
Pawsport is an AI-powered pet travel assistant with two core features:
1. **Travel Assistant**: Generates personalized checklists, regulation summaries, and document explanations for pet relocation
2. **Nose Booper**: Community layer connecting pet owners on similar travel routes

## Architecture

### Client-Server Structure
- **Client** (`client/`): React 17 + TypeScript SPA using React Router v5
- **Server** (`server/`): Express + TypeScript REST API with middleware-based error handling
- **Communication**: Axios-based API calls to `http://localhost:5000/api`

### Key Data Flows
1. **Travel Planning Flow**: User input → `TravelPlanner` page → `api.ts` → `/api/travel/*` routes → Controller → Service (LLM/Regulation) → Response
2. **Community Flow**: `Community` page → `/api/community/*` routes → Controller → Seeded mock data → Response
3. **LLM Integration**: Controllers call `llmService.ts` which proxies to external LLM API (configured via `LLM_API_URL`)

## Development Workflows

### Running the Application
```bash
# Terminal 1 - Start server (port 5000)
cd server
npm install
npm run dev

# Terminal 2 - Start client (port 3000)
cd client
npm install
npm start
```

### Building for Production
```bash
cd client && npm run build  # Creates optimized React build
cd server && npm run build  # Compiles TypeScript to JavaScript
```

## Code Conventions

### Component Organization
- **Page components** (`pages/`): Route-level containers (e.g., `TravelPlanner.tsx`, `Community.tsx`)
- **Feature components**: Organized by domain (`TravelAssistant/`, `NoseBooper/`)
- **Shared components** (`shared/`): Layout elements (`Header`, `Footer`)

### API Service Pattern
All API calls go through `client/src/services/api.ts` - never make direct axios calls from components. Example:
```typescript
// ✅ Correct
import { getTravelChecklist } from '../services/api';
const data = await getTravelChecklist(params);

// ❌ Avoid
axios.post('http://localhost:5000/api/travel/checklist', params);
```

### Server Controller Pattern
Controllers are instantiated as singletons and exported as default:
```typescript
class TravelController {
    // Methods here
}
export default new TravelController();
```

### Type Definitions
- Client types: `client/src/types/index.ts`
- Server types: `server/src/types/index.ts`
- Share similar structures but may differ (e.g., `Pet` vs `PetProfile`)

### Error Handling
- Server uses centralized `errorHandler` middleware in `app.ts`
- Controllers catch errors and pass to `res.status(500).json()`
- Client API functions throw errors with descriptive messages

## Critical Integration Points

### LLM Service Configuration
`server/src/services/llmService.ts` requires `LLM_API_URL` environment variable. Currently points to placeholder `https://api.example.com/llm` - update for production use.

### Matching Service
`matchingService.ts` uses in-memory mock data (`userProfiles` array). Replace with database queries for production.

### Route Structure
All API routes mount under `/api` prefix:
- `/api/travel/*` → Travel features (checklist, regulations, documents)
- `/api/community/*` → Community features (posts, profiles, matching)

## Dependencies & Environment
- **React Scripts 4.0.3**: Uses Create React App (no custom webpack config)
- **TypeScript 4.1.2**: Shared across client and server
- **Express Validator**: Used in `validation.ts` middleware
- **No Database**: Currently using in-memory mock data (Mongoose listed but not implemented)

## Common Patterns
- **React Router v5**: Use `<Route>` with `component` prop, not `element` (v6 syntax)
- **Async Controllers**: All controller methods are `async` and return `Promise<void>`
- **Middleware Chain**: `cors` → `bodyParser` → `routes` → `errorHandler`
