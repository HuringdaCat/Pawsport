# 🐾 Pawsport – About the Project
For every pet who deserves a smooth journey—and a friend to boop at the end.

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
- Implemented a lightweight web application with a frontend interface and backend API  
- Integrated an LLM to power the travel-rule explanation engine, documentation summarizer, and cultural guidance  
- Built a basic matching module recommending nearby or route-related pet connections  
- Created a simple community feed for Nose Booper using seeded sample profiles  
- Designed a clean, user-focused interface to support clarity during stressful relocation planning

---

## Project Structure
```
Pawsport
├── client
│   ├── public
│   │   └── index.html
│   ├── src
│   │   ├── components
│   │   │   ├── TravelAssistant
│   │   │   │   ├── TravelChecklist.tsx
│   │   │   │   ├── RegulationSummary.tsx
│   │   │   │   └── DocumentExplainer.tsx
│   │   │   ├── NoseBooper
│   │   │   │   ├── CommunityFeed.tsx
│   │   │   │   ├── PetProfile.tsx
│   │   │   │   └── MatchingModule.tsx
│   │   │   └── shared
│   │   │       ├── Header.tsx
│   │   │       └── Footer.tsx
│   │   ├── pages
│   │   │   ├── Home.tsx
│   │   │   ├── TravelPlanner.tsx
│   │   │   └── Community.tsx
│   │   ├── services
│   │   │   └── api.ts
│   │   ├── types
│   │   │   └── index.ts
│   │   ├── App.tsx
│   │   └── index.tsx
│   ├── package.json
│   └── tsconfig.json
├── server
│   ├── src
│   │   ├── controllers
│   │   │   ├── travelController.ts
│   │   │   ├── communityController.ts
│   │   │   └── llmController.ts
│   │   ├── routes
│   │   │   ├── travelRoutes.ts
│   │   │   ├── communityRoutes.ts
│   │   │   └── index.ts
│   │   ├── services
│   │   │   ├── llmService.ts
│   │   │   ├── matchingService.ts
│   │   │   └── regulationService.ts
│   │   ├── middleware
│   │   │   ├── errorHandler.ts
│   │   │   └── validation.ts
│   │   ├── types
│   │   │   └── index.ts
│   │   ├── app.ts
│   │   └── server.ts
│   ├── package.json
│   └── tsconfig.json
└── README.md
```