# 🛠️ Development Guide for Pawsport

This guide covers how to set up Pawsport locally for development and testing.

## Prerequisites
- **Node.js** v14 or higher
- **npm** or **yarn**
- **OpenAI API Key** ([Get one here](https://platform.openai.com/api-keys))

## 1. Clone & Install

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

## 2. Configure Environment Variables

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

## 3. Run Development Server

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

## 🧪 Testing

### Running Tests
```bash
cd client
npm test
```

### API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/chat` | POST | AI chat messages |
| `/api/travel/checklist` | POST | Generate travel checklist |
| `/api/travel/regulations` | POST | Get country regulations |
| `/api/travel/documents` | POST | Explain documents |
| `/api/community/posts` | GET/POST | Community posts |

For more details on serverless architecture and deployment, see [DEPLOYMENT.md](DEPLOYMENT.md).
