# Quick Start Guide - Authentication

## 🚀 5-Minute Setup

### Step 1: Get Supabase Keys (2 min)
1. Visit: https://app.supabase.com/project/_/settings/api
2. Copy these 3 values:
   - **Project URL**
   - **Publishable key** (under "Publishable keys" section)
   - **Secret service_role key** (under "Secret keys" section - ⚠️ Keep secret!)
   
   > 💡 **Note**: Supabase renamed "anon" to "publishable" - they're the same thing. The publishable key is safe to use in browsers.

### Step 2: Create Environment Files (1 min)

**Create `server/.env`:**
```bash
SUPABASE_URL=paste-your-project-url
SUPABASE_ANON_KEY=paste-your-publishable-key
SUPABASE_SERVICE_ROLE_KEY=paste-your-secret-service_role-key
PORT=5000
NODE_ENV=development
```

**Create `client/.env`:**
```bash
REACT_APP_SUPABASE_URL=paste-your-project-url
REACT_APP_SUPABASE_ANON_KEY=paste-your-publishable-key
```

> 💡 **Note**: The variable names still say `ANON_KEY` for backwards compatibility, but paste your **publishable key** value here.

### Step 3: Run Database Setup (2 min)
1. Go to Supabase → **SQL Editor**
2. Copy the entire SQL from [SUPABASE_SETUP.md](SUPABASE_SETUP.md) (lines 73-268)
3. Click **Run**
4. Verify in **Table Editor** - should see 4 new tables

### Step 4: Test It! (30 sec)
```bash
# Terminal 1
cd server && npm run dev

# Terminal 2  
cd client && npm start
```

Visit http://localhost:3000 → Click "Sign Up" → Create account → You're in! 🎉

---

## 📊 System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐     ┌──────────────┐     ┌────────────┐ │
│  │ Login Page   │────▶│ AuthContext  │────▶│  Header    │ │
│  └──────────────┘     └──────────────┘     └────────────┘ │
│         │                    │                             │
│         │              ┌─────▼──────┐                      │
│         └─────────────▶│  Supabase  │                      │
│                        │   Client   │                      │
│                        └─────┬──────┘                      │
└──────────────────────────────┼──────────────────────────────┘
                               │
                        JWT Token (auto-managed)
                               │
┌──────────────────────────────▼──────────────────────────────┐
│                    BACKEND (Express)                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌────────────────┐     ┌──────────────┐     ┌──────────┐ │
│  │ Auth Routes    │────▶│ Auth Service │────▶│ Supabase │ │
│  │ /api/auth/*    │     └──────────────┘     │  Admin   │ │
│  └────────────────┘                          └──────────┘ │
│         │                                                  │
│  ┌──────▼──────────┐                                       │
│  │ Auth Middleware │                                       │
│  │  (JWT verify)   │                                       │
│  └──────┬──────────┘                                       │
│         │                                                  │
│  ┌──────▼──────────┐                                       │
│  │ Protected       │                                       │
│  │ Controllers     │                                       │
│  └─────────────────┘                                       │
└─────────────────────────────────────────────────────────────┘
                               │
                               │
┌──────────────────────────────▼──────────────────────────────┐
│                  SUPABASE (Database + Auth)                 │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  auth.users          (Supabase managed)                     │
│  public.profiles     (Your app data)                        │
│  public.pets         (User's pets)                          │
│  public.travel_plans (Travel planning)                      │
│  public.community_posts (Community posts)                   │
│                                                             │
│  🔒 Row Level Security (RLS) enabled on all tables         │
└─────────────────────────────────────────────────────────────┘
```

## 🔄 Auth Flow Diagram

### Registration Flow
```
User → Register Page → AuthContext.signUp() 
  → Supabase.auth.signUp()
  → Creates user in auth.users
  → Trigger auto-creates profile in profiles table
  → Returns JWT token
  → Token stored in localStorage
  → User redirected to home (logged in)
```

### Login Flow
```
User → Login Page → AuthContext.signIn()
  → Supabase.auth.signInWithPassword()
  → Verifies credentials
  → Returns JWT token + session
  → Token stored in localStorage
  → AuthContext updates user state
  → Header shows "Logout" button
```

### Protected Route Access
```
User visits /profile → ProtectedRoute component
  → Checks AuthContext.user
  → If null: Redirect to /login
  → If exists: Render Profile page
  → Profile fetches data from Supabase
  → Only shows data user owns (RLS policies)
```

### API Request with Auth
```
Frontend makes API call → axios adds token to header
  → Backend receives request
  → Auth middleware extracts token
  → Verifies with Supabase
  → Attaches user to req.user
  → Controller uses req.user.id
  → Returns user-specific data
```

## 🎯 Key Features Implemented

✅ **Email/Password Registration**
- Secure password hashing (handled by Supabase)
- Auto-profile creation via database trigger
- Display name support

✅ **Login/Logout**
- JWT token management (automatic)
- Session persistence across page reloads
- Secure logout (clears tokens)

✅ **Protected Routes**  
- Frontend: `ProtectedRoute` component
- Backend: `authenticate` middleware
- Redirects to login if not authenticated

✅ **User Profile Management**
- View current profile
- Update display name, bio, location
- Profile linked to auth.users via foreign key

✅ **Auth State Management**
- Global AuthContext for React
- Auto-sync on auth state changes
- Loading states handled

✅ **Security**
- Row Level Security (RLS) on all tables
- Users can only see/edit their own data
- Service role key only used server-side
- Anon key safe for client-side

## 🔑 Important Files Reference

| Purpose | File Location |
|---------|---------------|
| Server Supabase Config | `server/src/config/supabase.ts` |
| Client Supabase Config | `client/src/config/supabase.ts` |
| Auth Context (React) | `client/src/contexts/AuthContext.tsx` |
| Auth Service (Backend) | `server/src/services/authService.ts` |
| Auth Middleware | `server/src/middleware/auth.ts` |
| Auth Routes | `server/src/routes/authRoutes.ts` |
| Login Page | `client/src/pages/Login.tsx` |
| Register Page | `client/src/pages/Register.tsx` |
| Profile Page | `client/src/pages/Profile.tsx` |
| Protected Route | `client/src/components/shared/ProtectedRoute.tsx` |
| Header (with auth) | `client/src/components/shared/Header.tsx` |

## 📖 Common Use Cases

### Make Any Existing Route Protected
```typescript
// Before
<Route path="/my-page" component={MyPage} />

// After  
<ProtectedRoute path="/my-page" component={MyPage} />
```

### Access Current User in Component
```tsx
import { useAuth } from '../contexts/AuthContext';

function MyComponent() {
  const { user } = useAuth();
  return <div>Hello {user?.email}</div>;
}
```

### Protect Backend Endpoint
```typescript
import { authenticate } from '../middleware/auth';

router.get('/my-endpoint', authenticate, myController.myMethod);

// In controller
async myMethod(req: Request, res: Response) {
  const userId = req.user!.id;  // Available after middleware
}
```

### Save Data for Current User
```typescript
// Frontend
const { user } = useAuth();
await supabase
  .from('travel_plans')
  .insert({ user_id: user.id, ...data });

// Backend
const { data } = await supabase
  .from('travel_plans')
  .insert({ user_id: req.user!.id, ...data });
```

---

**Need help?** Check [AUTH_SETUP_COMPLETE.md](AUTH_SETUP_COMPLETE.md) for detailed documentation!
