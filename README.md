# 🐾 Pawsport – AI-Powered Pet Travel Assistant
For every pet who deserves a smooth journey—and a friend to boop at the end.

> **🚀 Now with real AI chat powered by OpenAI!** See [AI_SETUP.md](AI_SETUP.md) for configuration.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone)

## ✨ Features

### **1. 🤖 Interactive AI Travel Assistant**
Chat with an AI assistant specialized in pet travel to get:
- **Personalized travel checklists** based on your origin, destination, and pet details
- **Step-by-step regulation guidance** for any country
- **Document explanations** for health certificates, vaccinations, and permits
- **Timeline planning** from 6 months before to travel day
- **Real-time answers** to any pet travel question

### **2. 🐶 Nose Booper – Community Hub**
Connect with fellow pet travelers:
- Share experiences and travel stories
- Find pet owners on similar routes
- Get advice from the community
- Make new "fur friends" around the world

### **3. 📋 Smart Planning Tools**
- Interactive travel checklists
- Country-specific requirements
- Cultural notes about pet ownership
- Document verification guides

---

## 🎯 What's New (December 2024)

### Recent Updates:
- ✅ **Real AI Integration**: Connected to OpenAI GPT-3.5-turbo for intelligent conversations
- ✅ **Modern UI Redesign**: 
  - Beautiful card-based Community Feed with fluid responsive grid
  - Interactive chat interface with typing indicators and smooth animations
  - Purple gradient theme throughout for consistent branding
- ✅ **Serverless Architecture**: Running on Vercel with automatic deployments
- ✅ **Quick Actions**: One-click buttons for common travel questions
- ✅ **Mobile Optimized**: Fully responsive design for all devices

---

## 🏗️ Architecture

### Tech Stack
- **Frontend**: React 17 + TypeScript + Custom CSS
- **Backend**: Vercel Serverless Functions (Node.js)
- **AI**: OpenAI GPT-3.5-turbo via REST API
- **Deployment**: Vercel with GitHub auto-deploy
- **Routing**: React Router v5

### Project Structure
```
Pawsport/
├── api/                           # Serverless API Functions
│   ├── chat.ts                   # 🆕 AI chat endpoint (OpenAI)
│   ├── travel/
│   │   ├── checklist.ts          # POST /api/travel/checklist
│   │   ├── regulations.ts        # GET /api/travel/regulations
│   │   └── documents.ts          # POST /api/travel/documents
│   └── community/
│       └── posts.ts              # GET/POST /api/community/posts
├── lib/                          # Shared Services
│   ├── services/
│   │   ├── llmService.ts         # LLM integration utilities
│   │   ├── regulationService.ts  # Travel regulations
│   │   ├── communityService.ts   # Community features
│   │   └── matchingService.ts    # Pet owner matching
│   └── types/
│       └── index.ts              # Shared TypeScript types
├── client/                       # React Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── TravelAssistant/
│   │   │   │   ├── AITravelChat.tsx          # 🆕 AI chat interface
│   │   │   │   ├── AITravelChat.css          # 🆕 Chat styling
│   │   │   │   ├── TravelChecklist.tsx
│   │   │   │   ├── RegulationSummary.tsx
│   │   │   │   └── DocumentExplainer.tsx
│   │   │   ├── NoseBooper/
│   │   │   │   ├── CommunityFeed.tsx         # 🆕 Redesigned with cards
│   │   │   │   ├── CommunityFeed.css         # 🆕 Modern grid layout
│   │   │   │   ├── PetProfile.tsx
│   │   │   │   └── MatchingModule.tsx
│   │   │   └── shared/
│   │   │       ├── Header.tsx
│   │   │       └── Footer.tsx
│   │   ├── pages/
│   │   │   ├── Home.tsx
│   │   │   ├── TravelPlanner.tsx             # 🆕 AI chat interface
│   │   │   ├── TravelPlanner.css             # 🆕 Page styling
│   │   │   ├── Community.tsx                 # 🆕 Enhanced UI
│   │   │   └── Community.css                 # 🆕 Page styling
│   │   ├── services/
│   │   │   └── api.js                        # API client utilities
│   │   └── types/
│   │       └── index.ts                      # Frontend types
│   └── package.json
├── .env.example                  # 🆕 Environment variable template
├── .env                          # 🆕 Local environment (not in git)
├── AI_SETUP.md                   # 🆕 AI integration guide
├── VERCEL_DEV_SETUP.md          # 🆕 Local dev setup guide
├── VERCEL_PRODUCTION_SETUP.md   # 🆕 Production deployment guide
├── vercel.json                   # Vercel configuration
└── README.md                     # You are here!
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** v14 or higher
- **npm** or **yarn**
- **OpenAI API Key** ([Get one here](https://platform.openai.com/api-keys))

### 1. Clone & Install

```bash
# Clone the repository
git clone https://github.com/yourusername/Pawsport.git
cd Pawsport

# Install root dependencies (for API functions)
npm install

# Install client dependencies
cd client
npm install
cd ..
```

### 2. Configure Environment Variables

Create a `.env` file in the **root directory**:

```bash
# Copy the example
cp .env.example .env

# Edit .env and add your OpenAI API key
# OPENAI_API_KEY=sk-proj-your-key-here
```

**Get your OpenAI API key:**
1. Visit https://platform.openai.com/api-keys
2. Sign up or log in
3. Create a new secret key
4. Copy and paste into `.env`

> 💡 See [AI_SETUP.md](AI_SETUP.md) for detailed setup instructions

### 3. Run Development Server

**Option A: With Vercel CLI (Recommended)**
```bash
# Install Vercel CLI globally
npm install -g vercel

# Start development server
vercel dev

# Open http://localhost:3000
```

**Option B: Client Only (No AI features)**
```bash
cd client
npm start

# Open http://localhost:3000
```

---

## 🌐 Deployment

### Deploy to Vercel

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready to deploy"
   git push
   ```

2. **Import to Vercel**
   - Go to https://vercel.com/new
   - Import your GitHub repository
   - Vercel auto-detects configuration

3. **Add Environment Variables**
   - Go to Settings → Environment Variables
   - Add `OPENAI_API_KEY` with your key
   - Enable for Production, Preview, and Development

4. **Deploy!**
   - Click Deploy
   - Wait 1-2 minutes
   - Your app is live! 🎉

> 📖 See [VERCEL_PRODUCTION_SETUP.md](VERCEL_PRODUCTION_SETUP.md) for detailed deployment guide

---

## 📖 Documentation

- **[AI_SETUP.md](AI_SETUP.md)** - Complete AI integration guide
  - OpenAI API setup
  - Model configuration
  - Cost optimization
  - Troubleshooting

- **[VERCEL_DEV_SETUP.md](VERCEL_DEV_SETUP.md)** - Local development guide
  - Environment variables
  - Vercel CLI usage
  - Common issues

- **[VERCEL_PRODUCTION_SETUP.md](VERCEL_PRODUCTION_SETUP.md)** - Production deployment
  - Vercel dashboard setup
  - Environment configuration
  - Monitoring and logs

- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Serverless migration details
  - Architecture decisions
  - Migration from Express

---

## 🎨 Key Features Explained

### AI Chat Interface
The Travel Planner page features an intelligent chatbot that:
- Remembers conversation context
- Provides country-specific advice
- Explains complex regulations simply
- Creates personalized checklists
- Answers follow-up questions

**Try asking:**
- "I'm moving to Japan with my dog, what do I need?"
- "Explain the health certificate requirements for EU"
- "Create a 6-month timeline for traveling to Australia"

### Community Feed
The Community page displays:
- Beautiful card-based post layout
- Responsive grid (1-4 columns based on screen size)
- Hover animations and smooth transitions
- User-generated content from pet travelers
- Connection opportunities with fellow pet parents

---

## 💰 Cost & Pricing

### OpenAI API Costs
- **Model**: GPT-3.5-turbo
- **Cost**: ~$0.002 per 1K tokens
- **Average message**: ~200 tokens (~$0.0004)
- **Example**: 1,000 messages = ~$0.40

Very affordable for development and production! 

**Cost Controls:**
- Set `max_tokens: 500` in API calls (already configured)
- Monitor usage at https://platform.openai.com/usage
- Set spending limits in OpenAI account settings

---

## 🛠️ Development

### Available Scripts

**Root:**
```bash
npm run build          # Build client for production
vercel dev            # Run serverless dev environment
```

**Client (`client/`):**
```bash
npm start             # Start React dev server (port 3000)
npm run build         # Create production build
npm test              # Run tests
```

### API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/chat` | POST | AI chat messages |
| `/api/travel/checklist` | POST | Generate travel checklist |
| `/api/travel/regulations` | POST | Get country regulations |
| `/api/travel/documents` | POST | Explain documents |
| `/api/community/posts` | GET/POST | Community posts |

---

## 🤝 Contributing

Contributions welcome! Here's how:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Inspired by my cats, Huringda and friends, who deserve smooth travels
- Built with ❤️ for all pet parents navigating global mobility
- Powered by OpenAI's GPT-3.5-turbo
- Deployed on Vercel's amazing platform

---

## 📧 Contact & Support

- **Issues**: Open an issue on GitHub
- **Questions**: Check the documentation files above
- **Feature Requests**: Submit a GitHub issue with the `enhancement` label

---

**Made with 🐾 by pet parents, for pet parents**
