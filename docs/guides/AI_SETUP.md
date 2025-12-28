# Vercel AI Integration Setup Guide

This guide explains how to connect the Pawsport AI Travel Assistant to a real AI model using OpenAI API.

## 🚀 Quick Start

### 1. Get an OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign up or log in
3. Create a new API key
4. Copy the key (starts with `sk-...`)

### 2. Configure Environment Variables

Create a `.env.local` file in the **root directory**:

```bash
# Copy the example file
cp .env.example .env.local
```

Edit `.env.local` and add your OpenAI API key:
```env
OPENAI_API_KEY=sk-your-actual-api-key-here
```

**Important**: Never commit `.env.local` to git! It's already in `.gitignore`.

### 3. Test Locally

Start the development server:
```bash
# Terminal 1 - Start the client
cd client
npm start

# The chat will connect to /api/chat endpoint
```

The AI chat will now connect to OpenAI's GPT-3.5-turbo model!

## 🌐 Deploy to Vercel

### 1. Push to GitHub

Make sure your code is pushed to a GitHub repository.

### 2. Import to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Vercel will auto-detect the configuration

### 3. Add Environment Variables in Vercel

In your Vercel project settings:
1. Go to "Settings" → "Environment Variables"
2. Add `OPENAI_API_KEY` with your API key
3. Set it for Production, Preview, and Development environments

### 4. Deploy

Click "Deploy" and your app will be live with AI chat!

## 🔧 How It Works

### Architecture

```
User Message → AITravelChat.tsx
              ↓ (useChat hook)
          /api/chat.ts (Vercel Serverless Function)
              ↓ (OpenAI API call)
          OpenAI GPT-3.5-turbo
              ↓ (AI Response)
          User sees response
```

### Key Files

1. **`client/src/components/TravelAssistant/AITravelChat.tsx`**
   - React component using `useChat` hook from Vercel AI SDK
   - Handles UI and message display
   - Sends messages to `/api/chat`

2. **`api/chat.ts`**
   - Vercel serverless function
   - Receives chat messages
   - Calls OpenAI API with system prompt
   - Returns AI responses

3. **System Prompt**
   - Defines AI behavior as a pet travel assistant
   - Guides AI to help with checklists, regulations, documents
   - Configured in `api/chat.ts`

## 🎨 Customization

### Change AI Model

In `api/chat.ts`, modify the model:
```typescript
model: 'gpt-4', // or 'gpt-3.5-turbo', 'gpt-4-turbo', etc.
```

### Adjust AI Behavior

Edit the system prompt in `api/chat.ts`:
```typescript
const systemPrompt = `Your custom instructions here...`;
```

### Use Different AI Provider

Install alternative SDK:
```bash
npm install @ai-sdk/anthropic  # for Claude
npm install @ai-sdk/google     # for Gemini
```

Update `api/chat.ts` to use the new provider.

## 🧪 Testing

### Test with Mock Responses

The chatbot will work without an API key using fallback responses.

### Test Real AI

1. Set `OPENAI_API_KEY` in `.env.local`
2. Restart the dev server
3. Ask questions in the chat

### Monitor API Usage

Check your usage at [OpenAI Usage Dashboard](https://platform.openai.com/usage)

## 💰 Cost Considerations

**GPT-3.5-turbo Pricing** (as of 2024):
- ~$0.002 per 1K tokens
- Average message: ~200 tokens
- ~$0.0004 per message
- Very affordable for development and production!

**Cost Control**:
- Set `max_tokens: 500` to limit response length
- Monitor usage in OpenAI dashboard
- Set usage limits in OpenAI account settings

## 🔒 Security

✅ **Best Practices**:
- ✓ API key stored in environment variables
- ✓ Never exposed to client-side code
- ✓ Serverless function acts as secure proxy
- ✓ `.env.local` in `.gitignore`

❌ **Never**:
- ✗ Commit API keys to git
- ✗ Use API keys in client-side code
- ✗ Share API keys publicly

## 🐛 Troubleshooting

### "API key not configured" Error

**Solution**: Make sure `OPENAI_API_KEY` is set in `.env.local` and restart the server.

### Messages not sending

**Solution**: Check browser console for errors. Verify the `/api/chat` endpoint is accessible.

### Rate limit errors

**Solution**: You've hit OpenAI's rate limit. Wait a moment or upgrade your OpenAI plan.

### Vercel deployment issues

**Solution**: Ensure environment variables are set in Vercel dashboard under Settings → Environment Variables.

## 📚 Resources

- [Vercel AI SDK Docs](https://sdk.vercel.ai/docs)
- [OpenAI API Docs](https://platform.openai.com/docs)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
- [React useChat Hook](https://sdk.vercel.ai/docs/reference/ai-sdk-ui/use-chat)

## 🎉 Next Steps

1. **Enhance System Prompt**: Add more specific pet travel knowledge
2. **Add Memory**: Store conversation history for context
3. **Stream Responses**: Enable real-time streaming for faster UX
4. **Add Citations**: Reference official sources for regulations
5. **Multi-language**: Support multiple languages for international users

---

Need help? Check the [main README](../README.md) or open an issue!
