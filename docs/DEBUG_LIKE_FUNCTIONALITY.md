# Debugging Like Functionality

## Potential Issues & Solutions

### Issue 1: Database Table Missing

**Symptom**: 500 error or "relation does not exist"

**Check**: Does the `post_likes` table exist in Supabase?

**SQL to verify:**
```sql
SELECT * FROM information_schema.tables 
WHERE table_name = 'post_likes';
```

**Solution**: Create the table:
```sql
CREATE TABLE IF NOT EXISTS post_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES community_posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

CREATE INDEX IF NOT EXISTS post_likes_post_id_idx ON post_likes(post_id);
CREATE INDEX IF NOT EXISTS post_likes_user_id_idx ON post_likes(user_id);

ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all likes" ON post_likes FOR SELECT USING (true);
CREATE POLICY "Users can like posts" ON post_likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can unlike posts" ON post_likes FOR DELETE USING (auth.uid() = user_id);
```

### Issue 2: Missing Postgres Function

**Symptom**: Error about `increment_post_likes` function not found

**Check**:
```sql
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_name = 'increment_post_likes';
```

**Solution**: Create the function:
```sql
CREATE OR REPLACE FUNCTION increment_post_likes(post_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE community_posts
  SET likes = likes + 1
  WHERE id = post_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION decrement_post_likes(post_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE community_posts
  SET likes = GREATEST(likes - 1, 0)
  WHERE id = post_id;
END;
$$ LANGUAGE plpgsql;
```

### Issue 3: RLS Policies Not Set

**Symptom**: No error but likes don't persist

**Check**:
```sql
SELECT * FROM pg_policies WHERE tablename = 'post_likes';
```

**Solution**: Enable RLS and create policies (see Issue 1 solution above)

### Issue 4: JWT Token Not Sent

**Symptom**: 401 Unauthorized error

**Check in Browser Console**:
1. Open DevTools (F12)
2. Go to Network tab
3. Click like button
4. Find the POST request to `/api/community/posts/[id]/like`
5. Check Request Headers → Look for `Authorization: Bearer ...`

**If missing**:
- Check if user is logged in: `console.log(await supabase.auth.getSession())`
- Verify token exists in browser storage

**Solution**: Make sure interceptor is working:
```javascript
// In browser console, test:
const { data } = await supabase.auth.getSession();
console.log('Session:', data.session);
console.log('Token:', data.session?.access_token);
```

### Issue 5: Server Not Using Middleware

**Symptom**: Request reaches server but user is undefined

**Check**: Look at server logs when clicking like

**Solution**: Verify routes use `authenticate` middleware:
```typescript
router.post('/posts/:id/like', authenticate, communityController.likePost.bind(communityController));
```

### Issue 6: CORS Issues

**Symptom**: Network error or CORS error in console

**Check**: Browser console shows CORS error

**Solution**: Verify CORS settings in `server/src/app.ts`:
```typescript
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
```

## Step-by-Step Debugging

### 1. Check Browser Console

Open browser DevTools (F12) and check Console tab:
- Any errors when clicking like?
- Network tab: What's the response status?

### 2. Check Network Request

In Network tab:
1. Click like button
2. Find POST request to `/api/community/posts/[id]/like`
3. Check:
   - Status code (200, 401, 500?)
   - Request Headers (Authorization present?)
   - Response body (any error message?)

### 3. Check Supabase

Go to Supabase Dashboard:

**Tables:**
```sql
-- Check if tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('post_likes', 'community_posts');

-- Check post_likes structure
\d post_likes
```

**Functions:**
```sql
-- Check if functions exist
SELECT routine_name FROM information_schema.routines 
WHERE routine_name IN ('increment_post_likes', 'decrement_post_likes');
```

**RLS Policies:**
```sql
-- Check policies on post_likes
SELECT * FROM pg_policies WHERE tablename = 'post_likes';
```

### 4. Test Manually in Supabase

In Supabase SQL Editor, try to insert a like manually:

```sql
-- Get a post ID
SELECT id FROM community_posts LIMIT 1;

-- Get your user ID
SELECT id FROM auth.users WHERE email = 'your@email.com';

-- Try to insert a like
INSERT INTO post_likes (post_id, user_id)
VALUES ('post-id-here', 'user-id-here');

-- Check if it worked
SELECT * FROM post_likes;
```

### 5. Check Server Logs

If running Vercel dev, check the terminal output when you click like.

Look for:
- Authentication errors
- Database errors
- Function errors

### 6. Add Debug Logging

**Client-side** (in `CommunityFeed.tsx`):
```typescript
const handleLike = async (postId: string, isLiked: boolean) => {
    console.log('Like clicked:', { postId, isLiked, user });
    
    if (!user) {
        alert('Please log in to like posts');
        return;
    }

    try {
        console.log('Calling API...');
        if (isLiked) {
            await unlikePost(postId);
            console.log('Unlike successful');
        } else {
            await likePost(postId);
            console.log('Like successful');
        }
        await fetchPosts();
    } catch (error: any) {
        console.error('Like error:', error);
        alert(error.message || 'Failed to update like');
    }
};
```

**Server-side** (in `communityController.ts`):
```typescript
public async likePost(req: Request, res: Response): Promise<void> {
    console.log('Like endpoint called:', {
        postId: req.params.id,
        userId: req.user?.id,
        hasUser: !!req.user
    });
    
    try {
        if (!req.user) {
            console.log('No user found');
            res.status(401).json({ message: 'Authentication required' });
            return;
        }

        await this.communityService.likePost(req.params.id, req.user.id);
        console.log('Like successful');
        res.status(200).json({ message: 'Post liked successfully' });
    } catch (error: any) {
        console.error('Like error:', error);
        // ... rest of error handling
    }
}
```

## Quick Test Script

Run this in browser console to test the full flow:

```javascript
// 1. Check if logged in
const { data: { session } } = await supabase.auth.getSession();
console.log('Logged in:', !!session);
console.log('User ID:', session?.user?.id);

// 2. Get posts
const posts = await fetch('/api/community/posts').then(r => r.json());
console.log('Posts:', posts);

// 3. Try to like first post
if (posts.length > 0 && session) {
    const postId = posts[0].id;
    const response = await fetch(`/api/community/posts/${postId}/like`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json'
        }
    });
    console.log('Like response:', await response.json());
}
```

## Most Likely Issues (in order)

1. ❓ **post_likes table doesn't exist** - Run CREATE TABLE SQL
2. ❓ **increment_post_likes function missing** - Run CREATE FUNCTION SQL
3. ❓ **RLS policies not set** - Run CREATE POLICY SQL
4. ❓ **Not logged in properly** - Check session in console
5. ❓ **Server not receiving auth token** - Check Network tab

## Quick Fix - Run All Database Setup

Run this complete SQL in Supabase:

```sql
-- Create post_likes table
CREATE TABLE IF NOT EXISTS post_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES community_posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

CREATE INDEX IF NOT EXISTS post_likes_post_id_idx ON post_likes(post_id);
CREATE INDEX IF NOT EXISTS post_likes_user_id_idx ON post_likes(user_id);

-- Enable RLS
ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view all likes" ON post_likes FOR SELECT USING (true);
CREATE POLICY "Users can like posts" ON post_likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can unlike posts" ON post_likes FOR DELETE USING (auth.uid() = user_id);

-- Create functions
CREATE OR REPLACE FUNCTION increment_post_likes(post_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE community_posts SET likes = likes + 1 WHERE id = post_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION decrement_post_likes(post_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE community_posts SET likes = GREATEST(likes - 1, 0) WHERE id = post_id;
END;
$$ LANGUAGE plpgsql;
```

After running this, refresh the page and try liking again!
