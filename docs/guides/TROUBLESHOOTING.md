# 🐛 Vercel Deployment Troubleshooting

## ✅ FIXED: Node.js Compatibility Issue

**Error:** `ERR_OSSL_EVP_UNSUPPORTED - digital envelope routines::unsupported`

**Root Cause:** Node.js 17+ is incompatible with react-scripts 4.0.3 (old webpack version)

**Solution Applied:**
- Updated `client/package.json`:
  - `react-scripts`: `4.0.3` → `5.0.1`
  - `typescript`: `4.1.2` → `4.9.5`
- Reinstalled dependencies
- Build now works successfully ✅

---

## Quick Fixes for Common Errors

### 1. Build Failed - "Module not found"
**Error:** `Cannot find module 'lib/services/...'`

**Fix:**
```bash
# Ensure all dependencies are in package.json
npm install
git add package.json package-lock.json
git commit -m "fix: add missing dependencies"
git push
```

### 2. Build Failed - TypeScript Errors
**Error:** `Type error: Cannot find module...`

**Fix:**
Check TypeScript compilation locally:
```bash
npx tsc --noEmit
```

If errors appear, they need to be fixed before deployment.

### 3. Build Failed - React Build Error
**Error:** `npm ERR! in client/`

**Fix:**
```bash
cd client
npm install
npm run build
```

If successful locally, check that `client/package.json` has all dependencies listed.

### 4. Runtime Error - Environment Variables
**Error:** Functions work but API calls fail

**Fix:**
Set environment variables in Vercel Dashboard:
1. Go to Project Settings → Environment Variables
2. Add: `LLM_API_URL` = `your-actual-llm-endpoint`

### 5. 404 on API Routes
**Error:** `404 NOT_FOUND` when calling `/api/*`

**Fix:**
Ensure `vercel.json` has correct rewrites (already configured).

### 6. Client Static Files Not Found
**Error:** White screen or "Cannot GET /"

**Fix:**
Check `vercel.json`:
- `outputDirectory: "client/build"` ✓
- Rewrite for `/(.*) → /index.html` ✓

---

## Step-by-Step Debug Process

### Step 1: Check Vercel Build Logs
```bash
# If using CLI
vercel --prod

# Look for specific error in output
```

Or in Vercel Dashboard:
1. Go to your project
2. Click on failed deployment
3. Check "Build Logs" tab
4. Look for the first error message

### Step 2: Test Local Build
```bash
# Test client build
cd client
npm run build

# Should create client/build/ directory
ls build/

# Test TypeScript compilation
cd ..
npx tsc --noEmit
```

### Step 3: Test Locally with Vercel CLI
```bash
vercel dev

# Should start on http://localhost:3000
# Test API endpoints
curl http://localhost:3000/api/community/posts
```

---

## Common Error Messages & Solutions

### Error: "No Output Directory named 'client/build' found"
**Cause:** React build failed

**Solution:**
```bash
# Check client dependencies
cd client
npm install
npm run build

# If it fails, check error and install missing packages
```

### Error: "Cannot find module '@vercel/node'"
**Cause:** Missing dependency in root package.json

**Solution:**
```bash
npm install @vercel/node --save
git add package.json package-lock.json
git commit -m "fix: add @vercel/node"
git push
```

### Error: "Command 'cd client && npm install && npm run build' failed"
**Cause:** Build command syntax issue

**Solution:**
Update `vercel.json`:
```json
{
  "buildCommand": "npm --prefix client install && npm --prefix client run build",
  "outputDirectory": "client/build",
  "installCommand": "npm install"
}
```

### Error: "TypeScript: Cannot find module 'lib/services'"
**Cause:** Module resolution issue

**Solution:**
Ensure `tsconfig.json` has:
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "lib/*": ["lib/*"]
    }
  }
}
```

---

## Vercel-Specific Configuration Issues

### Issue: Functions timeout
**Default:** 10 seconds
**Solution:** Add to `vercel.json`:
```json
{
  "functions": {
    "api/**/*.ts": {
      "maxDuration": 30
    }
  }
}
```

### Issue: Functions too large
**Limit:** 50MB per function
**Solution:** Check node_modules size, exclude unnecessary files with `.vercelignore`

---

## Manual Deployment Checklist

Before deploying again:

- [ ] `npm install` at root (no errors)
- [ ] `cd client && npm install` (no errors)
- [ ] `cd client && npm run build` (completes successfully)
- [ ] `npx tsc --noEmit` (no errors)
- [ ] `vercel dev` works locally
- [ ] API endpoints respond at `http://localhost:3000/api/*`
- [ ] Frontend loads at `http://localhost:3000`
- [ ] All files committed to git
- [ ] `.vercelignore` excludes `server/` directory

---

## Get Detailed Error Logs

### Via Vercel Dashboard:
1. Go to: https://vercel.com/[your-username]/[project-name]
2. Click on the failed deployment
3. Navigate to "Build Logs"
4. Copy the full error message

### Via Vercel CLI:
```bash
vercel logs [deployment-url] --follow
```

---

## Still Stuck?

### Share the following for help:
1. **Full error message** from Vercel logs
2. **Deployment method**: CLI or GitHub integration
3. **Last successful step** from build logs
4. **Local test results**:
   ```bash
   cd client && npm run build
   npx tsc --noEmit
   ```

### Quick Reset:
```bash
# Clean everything and try again
rm -rf node_modules client/node_modules
npm install
cd client && npm install && cd ..
vercel --prod
```

---

## Alternative: Simpler vercel.json

If still failing, try this minimal configuration:

```json
{
  "buildCommand": "npm --prefix client install && npm --prefix client run build",
  "outputDirectory": "client/build",
  "installCommand": "npm install"
}
```

Commit and redeploy:
```bash
git add vercel.json
git commit -m "fix: simplify vercel config"
git push
```

---

**Next Step:** Please share the specific error message from your Vercel deployment logs so I can provide a targeted fix.
