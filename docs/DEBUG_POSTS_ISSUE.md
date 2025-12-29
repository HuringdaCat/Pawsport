# Quick Debug Script

## Check What's Happening

Open browser console (F12) on http://localhost:3001/community and run:

```javascript
// 1. Check what the frontend receives
fetch('/api/community/posts')
  .then(r => r.json())
  .then(data => {
    console.log('=== API RESPONSE ===');
    console.log('Number of posts:', data.length);
    console.log('Posts:', data);
    return data;
  })
  .catch(err => console.error('API Error:', err));

// 2. Check React state
// In React DevTools, find CommunityFeed component and check its "posts" state

// 3. Check Supabase directly
const { data, error } = await supabase
  .from('community_posts')
  .select('*');
console.log('=== DIRECT SUPABASE QUERY ===');
console.log('Posts in DB:', data);
console.log('Error:', error);
```

## Possible Scenarios

### Scenario 1: API returns empty array
**What you see:** `[]`
**Problem:** Database is empty
**Solution:** Add posts (create via UI or run seed SQL)

### Scenario 2: API returns posts
**What you see:** Array with post objects
**Problem:** Something else - React not rendering or cached
**Solution:** 
1. Hard refresh (Ctrl+Shift+R)
2. Clear browser cache
3. Check React DevTools

### Scenario 3: API error
**What you see:** Network error or 500
**Problem:** Backend issue
**Solution:** Check server logs in terminal

### Scenario 4: Posts exist but different structure
**What you see:** Data but wrong format
**Problem:** Type mismatch
**Solution:** Check post structure matches CommunityPost type

## Quick Fixes

### Fix 1: Clear Everything
```bash
# Stop server
# Clear browser cache
# Restart: vercel dev
```

### Fix 2: Add Test Post Manually in Supabase

Go to Supabase Dashboard → Table Editor → community_posts → Insert Row:

```json
{
  "user_id": "YOUR_USER_ID",  // Get from auth.users table
  "author_name": "Test User",
  "content": "Test post from database",
  "route": "Test Route",
  "pet_types": ["Dog"],
  "likes": 0,
  "comment_count": 0
}
```

### Fix 3: Check if community_posts table exists

In Supabase SQL Editor:
```sql
SELECT * FROM community_posts LIMIT 5;
```

If error "relation does not exist", create the table:
```sql
CREATE TABLE community_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  author_name TEXT NOT NULL,
  content TEXT NOT NULL,
  route TEXT,
  pet_types TEXT[],
  likes INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view posts" ON community_posts FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create posts" ON community_posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own posts" ON community_posts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own posts" ON community_posts FOR DELETE USING (auth.uid() = user_id);
```

## What to Tell Me

After running the console commands, tell me:
1. What does `fetch('/api/community/posts')` return?
2. What does direct Supabase query return?
3. Does `community_posts` table exist?
4. What posts do you see on the UI?

Then I can pinpoint the exact issue! 🔍
