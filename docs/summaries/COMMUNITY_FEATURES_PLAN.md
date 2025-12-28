# Community Features Implementation Plan

## 🎯 Goal
Add like functionality, post creation, comments, and notifications to the Community page with full authentication integration.

## 📊 Current State

### Database Schema (Already exists in Supabase)
```sql
CREATE TABLE public.community_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  author_name TEXT NOT NULL,
  content TEXT NOT NULL,
  route TEXT,
  pet_types TEXT[],
  likes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Missing Tables Needed
```sql
-- Track which users liked which posts (many-to-many)
CREATE TABLE public.post_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES public.community_posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(post_id, user_id)  -- Prevent duplicate likes
);

CREATE INDEX idx_post_likes_post_id ON public.post_likes(post_id);
CREATE INDEX idx_post_likes_user_id ON public.post_likes(user_id);

-- Enable RLS
ALTER TABLE public.post_likes ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Post likes are viewable by everyone"
  ON public.post_likes FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can like posts"
  ON public.post_likes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike posts"
  ON public.post_likes FOR DELETE
  USING (auth.uid() = user_id);

-- Comments table
CREATE TABLE public.post_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES public.community_posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  author_name TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_post_comments_post_id ON public.post_comments(post_id);
CREATE INDEX idx_post_comments_user_id ON public.post_comments(user_id);
CREATE INDEX idx_post_comments_created_at ON public.post_comments(created_at);

-- Enable RLS
ALTER TABLE public.post_comments ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Comments are viewable by everyone"
  ON public.post_comments FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create comments"
  ON public.post_comments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments"
  ON public.post_comments FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments"
  ON public.post_comments FOR DELETE
  USING (auth.uid() = user_id);

-- Notifications table
CREATE TABLE public.notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL, -- 'comment', 'like', 'reply', etc.
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  link TEXT, -- Link to the post/comment
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_read ON public.notifications(read);
CREATE INDEX idx_notifications_created_at ON public.notifications(created_at DESC);

-- Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own notifications"
  ON public.notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
  ON public.notifications FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notifications"
  ON public.notifications FOR DELETE
  USING (auth.uid() = user_id);

-- System can insert notifications (using service role key)
CREATE POLICY "System can insert notifications"
  ON public.notifications FOR INSERT
  WITH CHECK (true);

-- Add comment count to posts
ALTER TABLE public.community_posts ADD COLUMN comment_count INTEGER DEFAULT 0;
```

### Current Dummy Implementation
- **Backend**: `communityService.ts` uses in-memory array of 15 mock posts
- **Frontend**: `CommunityFeed.tsx` displays posts with userId (not real names)
- **Missing**: Like button, post creation form, comments section, notifications system

## 🔨 Implementation Steps

### Phase 1: Database Setup (5 min)
1. ✅ Run the SQL above in Supabase SQL Editor to create `post_likes` table
2. ✅ Verify RLS policies are enabled

### Phase 2: Update Type Definitions (5 min)

#### Client Types (`client/src/types/index.ts`)
```typescript
export interface CommunityPost {
    id: string;
    userId: string;
    authorName: string;          // NEW: Display name from profile
    content: string;
    route?: string;              // NEW: Optional travel route
    petTypes?: string[];         // NEW: Optional pet types
    likes: number;               // NEW: Like count
    commentCount: number;        // NEW: Comment count
    isLikedByUser?: boolean;     // NEW: Track if current user liked
    createdAt: Date;
}

export interface CreatePostData {
    content: string;
    route?: string;
    petTypes?: string[];
}

export interface Comment {
    id: string;
    postId: string;
    userId: string;
    authorName: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateCommentData {
    content: string;
}

export interface Notification {
    id: string;
    userId: string;
    type: 'comment' | 'like' | 'reply';
    title: string;
    message: string;
    link?: string;
    read: boolean;
    createdAt: Date;
}
```

#### Server Types (`server/src/types/index.ts`)
```typescript
export interface CommunityPost {
    id: string;
    userId: string;
    authorName: string;
    content: string;
    route?: string;
    petTypes?: string[];
    likes: number;
    commentCount: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface Comment {
    id: string;
    postId: string;
    userId: string;
    authorName: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Notification {
    id: string;
    userId: string;
    type: 'comment' | 'like' | 'reply';
    title: string;
    message: string;
    link?: string;
    read: boolean;
    createdAt: Date;
}
```

### Phase 3: Backend Service Layer (15 min)

#### Update `server/src/services/communityService.ts`
Replace in-memory mock with Supabase queries:

```typescript
import { supabase } from '../config/supabase';
import { CommunityPost } from '../types';

export class CommunityService {
    // Fetch all posts with like counts and user names
    public async fetchCommunityPosts(currentUserId?: string): Promise<CommunityPost[]> {
        const { data: posts, error } = await supabase
            .from('community_posts')
            .select(`
                id,
                user_id,
                author_name,
                content,
                route,
                pet_types,
                likes,
                created_at,
                updated_at
            `)
            .order('created_at', { ascending: false });

        if (error) throw error;

        // If user is logged in, check which posts they liked
        if (currentUserId) {
            const { data: userLikes } = await supabase
                .from('post_likes')
                .select('post_id')
                .eq('user_id', currentUserId);

            const likedPostIds = new Set(userLikes?.map(l => l.post_id) || []);
            
            return posts.map(post => ({
                ...post,
                isLikedByUser: likedPostIds.has(post.id)
            }));
        }

        return posts;
    }

    // Create new post (requires auth)
    public async addCommunityPost(
        userId: string,
        authorName: string,
        postData: { content: string; route?: string; petTypes?: string[] }
    ): Promise<CommunityPost> {
        const { data, error } = await supabase
            .from('community_posts')
            .insert({
                user_id: userId,
                author_name: authorName,
                content: postData.content,
                route: postData.route,
                pet_types: postData.petTypes,
                likes: 0
            })
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    // Like a post
    public async likePost(postId: string, userId: string): Promise<void> {
        // Insert like record
        const { error: likeError } = await supabase
            .from('post_likes')
            .insert({ post_id: postId, user_id: userId });

        if (likeError) {
            // Check if already liked (unique constraint violation)
            if (likeError.code === '23505') {
                throw new Error('Post already liked');
            }
            throw likeError;
        }

        // Increment like count
        const { error: updateError } = await supabase.rpc('increment_post_likes', {
            post_id: postId
        });

        if (updateError) throw updateError;
    }

    // Unlike a post
    public async unlikePost(postId: string, userId: string): Promise<void> {
        // Delete like record
        const { error: deleteError } = await supabase
            .from('post_likes')
            .delete()
            .match({ post_id: postId, user_id: userId });

        if (deleteError) throw deleteError;

        // Decrement like count
        const { error: updateError } = await supabase.rpc('decrement_post_likes', {
            post_id: postId
        });

        if (updateError) throw updateError;
    }

    // Delete post (owner only)
    public async removeCommunityPost(id: string, userId: string): Promise<void> {
        const { error } = await supabase
            .from('community_posts')
            .delete()
            .match({ id, user_id: userId });

        if (error) throw error;
    }

    // Get comments for a post
    public async fetchPostComments(postId: string): Promise<Comment[]> {
        const { data, error } = await supabase
            .from('post_comments')
            .select('*')
            .eq('post_id', postId)
            .order('created_at', { ascending: true });

        if (error) throw error;
        return data || [];
    }

    // Add comment to a post
    public async addComment(
        postId: string,
        userId: string,
        authorName: string,
        content: string
    ): Promise<Comment> {
        // Insert comment
        const { data: comment, error: commentError } = await supabase
            .from('post_comments')
            .insert({
                post_id: postId,
                user_id: userId,
                author_name: authorName,
                content
            })
            .select()
            .single();

        if (commentError) throw commentError;

        // Increment comment count
        await supabase.rpc('increment_comment_count', { post_id: postId });

        // Get post owner to send notification
        const { data: post } = await supabase
            .from('community_posts')
            .select('user_id, author_name')
            .eq('id', postId)
            .single();

        // Create notification for post owner (if not commenting on own post)
        if (post && post.user_id !== userId) {
            await supabase
                .from('notifications')
                .insert({
                    user_id: post.user_id,
                    type: 'comment',
                    title: 'New Comment',
                    message: `${authorName} commented on your post`,
                    link: `/community?post=${postId}`,
                    read: false
                });
        }

        return comment;
    }

    // Delete comment
    public async removeComment(commentId: string, userId: string): Promise<void> {
        // Get comment to find post_id
        const { data: comment } = await supabase
            .from('post_comments')
            .select('post_id')
            .eq('id', commentId)
            .single();

        // Delete comment
        const { error } = await supabase
            .from('post_comments')
            .delete()
            .match({ id: commentId, user_id: userId });

        if (error) throw error;

        // Decrement comment count
        if (comment) {
            await supabase.rpc('decrement_comment_count', { post_id: comment.post_id });
        }
    }
}
```

**Note**: Need to create Postgres functions for atomic count updates:
```sql
-- In Supabase SQL Editor
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

CREATE OR REPLACE FUNCTION increment_comment_count(post_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE community_posts SET comment_count = comment_count + 1 WHERE id = post_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION decrement_comment_count(post_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE community_posts SET comment_count = GREATEST(comment_count - 1, 0) WHERE id = post_id;
END;
$$ LANGUAGE plpgsql;
```

### Phase 4: Backend Controller & Routes (15 min)

#### Update `server/src/controllers/communityController.ts`
```typescript
import { Request, Response } from 'express';
import { CommunityService } from '../services/communityService';
import { NotificationService } from '../services/notificationService';
import { supabase } from '../config/supabase';

class CommunityController {
    private communityService: CommunityService;
    private notificationService: NotificationService;

    constructor() {
        this.communityService = new CommunityService();
        this.notificationService = new NotificationService();
    }

    // GET /api/community/posts (public, but shows like status if authenticated)
    public async getCommunityPosts(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.user?.id; // Optional auth from middleware
            const posts = await this.communityService.fetchCommunityPosts(userId);
            res.status(200).json(posts);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching community posts', error });
        }
    }

    // POST /api/community/posts (requires auth)
    public async createCommunityPost(req: Request, res: Response): Promise<void> {
        try {
            if (!req.user) {
                res.status(401).json({ message: 'Authentication required' });
                return;
            }

            const { content, route, petTypes } = req.body;
            
            if (!content || content.trim().length === 0) {
                res.status(400).json({ message: 'Content is required' });
                return;
            }

            // Get user's display name from profile
            const { data: profile } = await supabase
                .from('profiles')
                .select('display_name')
                .eq('id', req.user.id)
                .single();

            const authorName = profile?.display_name || req.user.email?.split('@')[0] || 'Anonymous';

            const newPost = await this.communityService.addCommunityPost(
                req.user.id,
                authorName,
                { content, route, petTypes }
            );
            
            res.status(201).json(newPost);
        } catch (error) {
            res.status(500).json({ message: 'Error creating community post', error });
        }
    }

    // POST /api/community/posts/:id/like (requires auth)
    public async likePost(req: Request, res: Response): Promise<void> {
        try {
            if (!req.user) {
                res.status(401).json({ message: 'Authentication required' });
                return;
            }

            await this.communityService.likePost(req.params.id, req.user.id);
            res.status(200).json({ message: 'Post liked successfully' });
        } catch (error: any) {
            if (error.message === 'Post already liked') {
                res.status(400).json({ message: error.message });
            } else {
                res.status(500).json({ message: 'Error liking post', error });
            }
        }
    }

    // DELETE /api/community/posts/:id/like (requires auth)
    public async unlikePost(req: Request, res: Response): Promise<void> {
        try {
            if (!req.user) {
                res.status(401).json({ message: 'Authentication required' });
                return;
            }

            await this.communityService.unlikePost(req.params.id, req.user.id);
            res.status(200).json({ message: 'Post unliked successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Error unliking post', error });
        }
    }

    // GET /api/community/posts/:id/comments (public)
    public async getPostComments(req: Request, res: Response): Promise<void> {
        try {
            const comments = await this.communityService.fetchPostComments(req.params.id);
            res.status(200).json(comments);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching comments', error });
        }
    }

    // POST /api/community/posts/:id/comments (requires auth)
    public async addComment(req: Request, res: Response): Promise<void> {
        try {
            if (!req.user) {
                res.status(401).json({ message: 'Authentication required' });
                return;
            }

            const { content } = req.body;
            
            if (!content || content.trim().length === 0) {
                res.status(400).json({ message: 'Comment content is required' });
                return;
            }

            // Get user's display name
            const { data: profile } = await supabase
                .from('profiles')
                .select('display_name')
                .eq('id', req.user.id)
                .single();

            const authorName = profile?.display_name || req.user.email?.split('@')[0] || 'Anonymous';

            const comment = await this.communityService.addComment(
                req.params.id,
                req.user.id,
                authorName,
                content.trim()
            );
            
            res.status(201).json(comment);
        } catch (error) {
            res.status(500).json({ message: 'Error adding comment', error });
        }
    }

    // DELETE /api/community/comments/:id (requires auth, owner only)
    public async deleteComment(req: Request, res: Response): Promise<void> {
        try {
            if (!req.user) {
                res.status(401).json({ message: 'Authentication required' });
                return;
            }

            await this.communityService.removeComment(req.params.id, req.user.id);
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ message: 'Error deleting comment', error });
        }
    }

    // DELETE /api/community/posts/:id (requires auth, owner only)
    public async deleteCommunityPost(req: Request, res: Response): Promise<void> {
        try {
            if (!req.user) {
                res.status(401).json({ message: 'Authentication required' });
                return;
            }

            await this.communityService.removeCommunityPost(req.params.id, req.user.id);
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ message: 'Error deleting community post', error });
        }
    }
}

export default new CommunityController();
```

#### Create `server/src/services/notificationService.ts`
```typescript
import { supabase } from '../config/supabase';
import { Notification } from '../types';

export class NotificationService {
    // Get user notifications
    public async getUserNotifications(userId: string, unreadOnly: boolean = false): Promise<Notification[]> {
        let query = supabase
            .from('notifications')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (unreadOnly) {
            query = query.eq('read', false);
        }

        const { data, error } = await query;

        if (error) throw error;
        return data || [];
    }

    // Mark notification as read
    public async markAsRead(notificationId: string, userId: string): Promise<void> {
        const { error } = await supabase
            .from('notifications')
            .update({ read: true })
            .match({ id: notificationId, user_id: userId });

        if (error) throw error;
    }

    // Mark all notifications as read
    public async markAllAsRead(userId: string): Promise<void> {
        const { error } = await supabase
            .from('notifications')
            .update({ read: true })
            .eq('user_id', userId)
            .eq('read', false);

        if (error) throw error;
    }

    // Delete notification
    public async deleteNotification(notificationId: string, userId: string): Promise<void> {
        const { error } = await supabase
            .from('notifications')
            .delete()
            .match({ id: notificationId, user_id: userId });

        if (error) throw error;
    }

    // Get unread count
    public async getUnreadCount(userId: string): Promise<number> {
        const { count, error } = await supabase
            .from('notifications')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', userId)
            .eq('read', false);

        if (error) throw error;
        return count || 0;
    }
}
```

#### Create `server/src/controllers/notificationController.ts`
```typescript
import { Request, Response } from 'express';
import { NotificationService } from '../services/notificationService';

class NotificationController {
    private notificationService: NotificationService;

    constructor() {
        this.notificationService = new NotificationService();
    }

    // GET /api/notifications (requires auth)
    public async getNotifications(req: Request, res: Response): Promise<void> {
        try {
            if (!req.user) {
                res.status(401).json({ message: 'Authentication required' });
                return;
            }

            const unreadOnly = req.query.unreadOnly === 'true';
            const notifications = await this.notificationService.getUserNotifications(req.user.id, unreadOnly);
            res.status(200).json(notifications);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching notifications', error });
        }
    }

    // GET /api/notifications/unread-count (requires auth)
    public async getUnreadCount(req: Request, res: Response): Promise<void> {
        try {
            if (!req.user) {
                res.status(401).json({ message: 'Authentication required' });
                return;
            }

            const count = await this.notificationService.getUnreadCount(req.user.id);
            res.status(200).json({ count });
        } catch (error) {
            res.status(500).json({ message: 'Error fetching unread count', error });
        }
    }

    // PUT /api/notifications/:id/read (requires auth)
    public async markAsRead(req: Request, res: Response): Promise<void> {
        try {
            if (!req.user) {
                res.status(401).json({ message: 'Authentication required' });
                return;
            }

            await this.notificationService.markAsRead(req.params.id, req.user.id);
            res.status(200).json({ message: 'Notification marked as read' });
        } catch (error) {
            res.status(500).json({ message: 'Error marking notification as read', error });
        }
    }

    // PUT /api/notifications/read-all (requires auth)
    public async markAllAsRead(req: Request, res: Response): Promise<void> {
        try {
            if (!req.user) {
                res.status(401).json({ message: 'Authentication required' });
                return;
            }

            await this.notificationService.markAllAsRead(req.user.id);
            res.status(200).json({ message: 'All notifications marked as read' });
        } catch (error) {
            res.status(500).json({ message: 'Error marking all as read', error });
        }
    }

    // DELETE /api/notifications/:id (requires auth)
    public async deleteNotification(req: Request, res: Response): Promise<void> {
        try {
            if (!req.user) {
                res.status(401).json({ message: 'Authentication required' });
                return;
            }

            await this.notificationService.deleteNotification(req.params.id, req.user.id);
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ message: 'Error deleting notification', error });
        }
    }
}

export default new NotificationController();
```

#### Update `server/src/controllers/communityController.ts`
```typescript
import { Request, Response } from 'express';
import { CommunityService } from '../services/communityService';

class CommunityController {
    private communityService: CommunityService;

    constructor() {
        this.communityService = new CommunityService();
    }

    // GET /api/community/posts (public, but shows like status if authenticated)
    public async getCommunityPosts(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.user?.id; // Optional auth from middleware
            const posts = await this.communityService.fetchCommunityPosts(userId);
            res.status(200).json(posts);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching community posts', error });
        }
    }

    // POST /api/community/posts (requires auth)
    public async createCommunityPost(req: Request, res: Response): Promise<void> {
        try {
            if (!req.user) {
                res.status(401).json({ message: 'Authentication required' });
                return;
            }

            const { content, route, petTypes } = req.body;
            
            if (!content || content.trim().length === 0) {
                res.status(400).json({ message: 'Content is required' });
                return;
            }

            // Get user's display name from profile
            const { data: profile } = await supabase
                .from('profiles')
                .select('display_name')
                .eq('id', req.user.id)
                .single();

            const authorName = profile?.display_name || req.user.email?.split('@')[0] || 'Anonymous';

            const newPost = await this.communityService.addCommunityPost(
                req.user.id,
                authorName,
                { content, route, petTypes }
            );
            
            res.status(201).json(newPost);
        } catch (error) {
            res.status(500).json({ message: 'Error creating community post', error });
        }
    }

    // POST /api/community/posts/:id/like (requires auth)
    public async likePost(req: Request, res: Response): Promise<void> {
        try {
            if (!req.user) {
                res.status(401).json({ message: 'Authentication required' });
                return;
            }

            await this.communityService.likePost(req.params.id, req.user.id);
            res.status(200).json({ message: 'Post liked successfully' });
        } catch (error: any) {
            if (error.message === 'Post already liked') {
                res.status(400).json({ message: error.message });
            } else {
                res.status(500).json({ message: 'Error liking post', error });
            }
        }
    }

    // DELETE /api/community/posts/:id/like (requires auth)
    public async unlikePost(req: Request, res: Response): Promise<void> {
        try {
            if (!req.user) {
                res.status(401).json({ message: 'Authentication required' });
                return;
            }

            await this.communityService.unlikePost(req.params.id, req.user.id);
            res.status(200).json({ message: 'Post unliked successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Error unliking post', error });
        }
    }

    // DELETE /api/community/posts/:id (requires auth, owner only)
    public async deleteCommunityPost(req: Request, res: Response): Promise<void> {
        try {
            if (!req.user) {
                res.status(401).json({ message: 'Authentication required' });
                return;
            }

            await this.communityService.removeCommunityPost(req.params.id, req.user.id);
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ message: 'Error deleting community post', error });
        }
    }
}

export default new CommunityController();
```

#### Update `server/src/routes/communityRoutes.ts`
```typescript
import { Router } from 'express';
import communityController from '../controllers/communityController';
import { authenticate } from '../middleware/auth';
import { optionalAuth } from '../middleware/auth'; // Need to create this

const router = Router();

// Public routes (with optional auth to show like status)
router.get('/posts', optionalAuth, communityController.getCommunityPosts.bind(communityController));
router.get('/posts/:id/comments', communityController.getPostComments.bind(communityController));

// Protected routes (require authentication)
router.post('/posts', authenticate, communityController.createCommunityPost.bind(communityController));
router.post('/posts/:id/like', authenticate, communityController.likePost.bind(communityController));
router.delete('/posts/:id/like', authenticate, communityController.unlikePost.bind(communityController));
router.post('/posts/:id/comments', authenticate, communityController.addComment.bind(communityController));
router.delete('/comments/:id', authenticate, communityController.deleteComment.bind(communityController));
router.delete('/posts/:id', authenticate, communityController.deleteCommunityPost.bind(communityController));

export default router;
```

#### Create `server/src/routes/notificationRoutes.ts`
```typescript
import { Router } from 'express';
import notificationController from '../controllers/notificationController';
import { authenticate } from '../middleware/auth';

const router = Router();

// All notification routes require authentication
router.get('/', authenticate, notificationController.getNotifications.bind(notificationController));
router.get('/unread-count', authenticate, notificationController.getUnreadCount.bind(notificationController));
router.put('/:id/read', authenticate, notificationController.markAsRead.bind(notificationController));
router.put('/read-all', authenticate, notificationController.markAllAsRead.bind(notificationController));
router.delete('/:id', authenticate, notificationController.deleteNotification.bind(notificationController));

export default router;
```

#### Update `server/src/routes/index.ts`
```typescript
import express from 'express';
import authRoutes from './authRoutes';
import travelRoutes from './travelRoutes';
import communityRoutes from './communityRoutes';
import notificationRoutes from './notificationRoutes';

const router = express.Router();

// Auth routes
router.use('/auth', authRoutes);

// Use travel-related routes
router.use('/travel', travelRoutes);

// Use community routes
router.use('/community', communityRoutes);

// Use notification routes
router.use('/notifications', notificationRoutes);

export default router;
```

#### Create `optionalAuth` middleware in `server/src/middleware/auth.ts`
```typescript
// Add this to existing auth.ts file
export const optionalAuth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        
        if (token) {
            const { data: { user }, error } = await supabase.auth.getUser(token);
            if (!error && user) {
                req.user = user;
            }
        }
        
        next(); // Continue even if no auth
    } catch (error) {
        next(); // Continue even if auth fails
    }
};
```

### Phase 5: Frontend API Service (10 min)

#### Update `client/src/services/api.ts`
```typescript
// Add these functions

export const createCommunityPost = async (postData: CreatePostData): Promise<CommunityPost> => {
    const response = await api.post('/community/posts', postData);
    return response.data;
};

export const likePost = async (postId: string): Promise<void> => {
    await api.post(`/community/posts/${postId}/like`);
};

export const unlikePost = async (postId: string): Promise<void> => {
    await api.delete(`/community/posts/${postId}/like`);
};

export const deleteCommunityPost = async (postId: string): Promise<void> => {
    await api.delete(`/community/posts/${postId}`);
};

// Comment functions
export const getPostComments = async (postId: string): Promise<Comment[]> => {
    const response = await api.get(`/community/posts/${postId}/comments`);
    return response.data;
};

export const addComment = async (postId: string, commentData: CreateCommentData): Promise<Comment> => {
    const response = await api.post(`/community/posts/${postId}/comments`, commentData);
    return response.data;
};

export const deleteComment = async (commentId: string): Promise<void> => {
    await api.delete(`/community/comments/${commentId}`);
};

// Notification functions
export const getNotifications = async (unreadOnly: boolean = false): Promise<Notification[]> => {
    const response = await api.get('/notifications', { params: { unreadOnly } });
    return response.data;
};

export const getUnreadNotificationCount = async (): Promise<number> => {
    const response = await api.get('/notifications/unread-count');
    return response.data.count;
};

export const markNotificationAsRead = async (notificationId: string): Promise<void> => {
    await api.put(`/notifications/${notificationId}/read`);
};

export const markAllNotificationsAsRead = async (): Promise<void> => {
    await api.put('/notifications/read-all');
};

export const deleteNotification = async (notificationId: string): Promise<void> => {
    await api.delete(`/notifications/${notificationId}`);
};
```

### Phase 6: Frontend UI Components (45 min)

#### Create `client/src/components/NoseBooper/CreatePostForm.tsx`
```tsx
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { createCommunityPost } from '../../services/api';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import './CreatePostForm.css';

interface CreatePostFormProps {
    onPostCreated: () => void;
}

const CreatePostForm: React.FC<CreatePostFormProps> = ({ onPostCreated }) => {
    const { user } = useAuth();
    const [content, setContent] = useState('');
    const [route, setRoute] = useState('');
    const [petTypes, setPetTypes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!user) {
            setError('You must be logged in to post');
            return;
        }

        if (!content.trim()) {
            setError('Post content cannot be empty');
            return;
        }

        setIsSubmitting(true);

        try {
            await createCommunityPost({
                content: content.trim(),
                route: route.trim() || undefined,
                petTypes: petTypes ? petTypes.split(',').map(t => t.trim()) : undefined
            });

            // Clear form
            setContent('');
            setRoute('');
            setPetTypes('');
            
            // Notify parent to refresh posts
            onPostCreated();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to create post');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!user) {
        return (
            <div className="create-post-form login-prompt">
                <p>Please log in to share your pet travel stories!</p>
            </div>
        );
    }

    return (
        <form className="create-post-form" onSubmit={handleSubmit}>
            <h3>Share Your Story</h3>
            
            <textarea
                className="post-textarea"
                placeholder="What's your pet travel story? Share tips, ask questions, or connect with fellow travelers..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={4}
                maxLength={500}
                required
            />
            
            <div className="optional-fields">
                <Input
                    type="text"
                    placeholder="Travel route (e.g., NYC to Paris)"
                    value={route}
                    onChange={(e) => setRoute(e.target.value)}
                />
                
                <Input
                    type="text"
                    placeholder="Pet types (e.g., dog, cat)"
                    value={petTypes}
                    onChange={(e) => setPetTypes(e.target.value)}
                />
            </div>

            {error && <p className="error-message">{error}</p>}

            <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Posting...' : 'Post to Community'}
            </Button>
        </form>
    );
};

export default CreatePostForm;
```

#### Update `client/src/components/NoseBooper/CommunityFeed.tsx`
```tsx
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { CommunityPost } from '../../types';
import { getCommunityPosts, likePost, unlikePost, deleteCommunityPost } from '../../services/api';
import { Heart, Trash2, MessageCircle } from 'lucide-react';
import CreatePostForm from './CreatePostForm';
import CommentSection from './CommentSection';
import './CommunityFeed.css';

const CommunityFeed: React.FC = () => {
    const { user } = useAuth();
    const [posts, setPosts] = React.useState<CommunityPost[]>([]);
    const [loading, setLoading] = React.useState<boolean>(true);
    const [expandedPostId, setExpandedPostId] = useState<string | null>(null);

    const fetchPosts = async () => {
        try {
            const data = await getCommunityPosts();
            setPosts(data);
        } catch (error) {
            console.error('Error fetching community posts:', error);
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        fetchPosts();
    }, []);

    const handleLike = async (postId: string, isLiked: boolean) => {
        if (!user) {
            alert('Please log in to like posts');
            return;
        }

        try {
            if (isLiked) {
                await unlikePost(postId);
            } else {
                await likePost(postId);
            }
            // Refresh posts to show updated like count
            await fetchPosts();
        } catch (error: any) {
            console.error('Error toggling like:', error);
            alert(error.response?.data?.message || 'Failed to update like');
        }
    };

    const handleDelete = async (postId: string) => {
        if (!window.confirm('Are you sure you want to delete this post?')) {
            return;
        }

        try {
            await deleteCommunityPost(postId);
            await fetchPosts();
        } catch (error) {
            console.error('Error deleting post:', error);
            alert('Failed to delete post');
        }
    };

    const toggleComments = (postId: string) => {
        setExpandedPostId(expandedPostId === postId ? null : postId);
    };

    if (loading) {
        return (
            <div className="community-feed">
                <h2>Community Feed</h2>
                <p className="no-posts-message">Loading posts...</p>
            </div>
        );
    }

    return (
        <div className="community-feed">
            <h2>Community Feed</h2>
            
            <CreatePostForm onPostCreated={fetchPosts} />

            {posts.length === 0 ? (
                <div className="no-posts-message">
                    <p>No posts available. Be the first to share!</p>
                </div>
            ) : (
                <div className="posts-gallery">
                    {posts.map((post) => (
                        <div key={post.id} className="post-card">
                            <div className="post-header">
                                <span className="post-author">{post.authorName}</span>
                                {user?.id === post.userId && (
                                    <button
                                        className="delete-button"
                                        onClick={() => handleDelete(post.id)}
                                        title="Delete post"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                )}
                            </div>
                            
                            <div className="post-content">{post.content}</div>
                            
                            {post.route && (
                                <div className="post-route">📍 {post.route}</div>
                            )}
                            
                            {post.petTypes && post.petTypes.length > 0 && (
                                <div className="post-pet-types">
                                    {post.petTypes.map(type => (
                                        <span key={type} className="pet-tag">{type}</span>
                                    ))}
                                </div>
                            )}
                            
                            <div className="post-footer">
                                <div className="post-actions">
                                    <button
                                        className={`action-button like-button ${post.isLikedByUser ? 'liked' : ''}`}
                                        onClick={() => handleLike(post.id, post.isLikedByUser || false)}
                                        disabled={!user}
                                    >
                                        <Heart 
                                            size={18} 
                                            fill={post.isLikedByUser ? 'currentColor' : 'none'}
                                        />
                                        <span>{post.likes}</span>
                                    </button>
                                    
                                    <button
                                        className="action-button comment-button"
                                        onClick={() => toggleComments(post.id)}
                                    >
                                        <MessageCircle size={18} />
                                        <span>{post.commentCount || 0}</span>
                                    </button>
                                </div>
                                
                                <span className="post-date">
                                    {new Date(post.createdAt).toLocaleDateString()}
                                </span>
                            </div>

                            {expandedPostId === post.id && (
                                <CommentSection 
                                    postId={post.id} 
                                    onCommentAdded={() => fetchPosts()}
                                />
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CommunityFeed;
```

#### Create `client/src/components/NoseBooper/CommentSection.tsx`
```tsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Comment } from '../../types';
import { getPostComments, addComment, deleteComment } from '../../services/api';
import { Trash2 } from 'lucide-react';
import { Button } from '../ui/Button';
import './CommentSection.css';

interface CommentSectionProps {
    postId: string;
    onCommentAdded: () => void;
}

const CommentSection: React.FC<CommentSectionProps> = ({ postId, onCommentAdded }) => {
    const { user } = useAuth();
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);
    const [newComment, setNewComment] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const fetchComments = async () => {
        try {
            const data = await getPostComments(postId);
            setComments(data);
        } catch (error) {
            console.error('Error fetching comments:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComments();
    }, [postId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!user) {
            alert('Please log in to comment');
            return;
        }

        if (!newComment.trim()) {
            return;
        }

        setSubmitting(true);

        try {
            await addComment(postId, { content: newComment.trim() });
            setNewComment('');
            await fetchComments();
            onCommentAdded(); // Refresh post to update comment count
        } catch (error) {
            console.error('Error adding comment:', error);
            alert('Failed to add comment');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (commentId: string) => {
        if (!window.confirm('Delete this comment?')) {
            return;
        }

        try {
            await deleteComment(commentId);
            await fetchComments();
            onCommentAdded(); // Refresh post to update comment count
        } catch (error) {
            console.error('Error deleting comment:', error);
            alert('Failed to delete comment');
        }
    };

    if (loading) {
        return <div className="comment-section">Loading comments...</div>;
    }

    return (
        <div className="comment-section">
            <div className="comments-list">
                {comments.length === 0 ? (
                    <p className="no-comments">No comments yet. Be the first to comment!</p>
                ) : (
                    comments.map((comment) => (
                        <div key={comment.id} className="comment">
                            <div className="comment-header">
                                <span className="comment-author">{comment.authorName}</span>
                                <span className="comment-date">
                                    {new Date(comment.createdAt).toLocaleDateString()}
                                </span>
                                {user?.id === comment.userId && (
                                    <button
                                        className="comment-delete-button"
                                        onClick={() => handleDelete(comment.id)}
                                        title="Delete comment"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                )}
                            </div>
                            <div className="comment-content">{comment.content}</div>
                        </div>
                    ))
                )}
            </div>

            {user ? (
                <form className="comment-form" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        className="comment-input"
                        placeholder="Write a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        maxLength={300}
                    />
                    <Button type="submit" size="sm" disabled={submitting || !newComment.trim()}>
                        {submitting ? 'Posting...' : 'Post'}
                    </Button>
                </form>
            ) : (
                <p className="login-prompt">Log in to leave a comment</p>
            )}
        </div>
    );
};

export default CommentSection;
```

#### Create `client/src/components/shared/NotificationBell.tsx`
```tsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Notification } from '../../types';
import { 
    getNotifications, 
    getUnreadNotificationCount, 
    markNotificationAsRead, 
    markAllNotificationsAsRead,
    deleteNotification 
} from '../../services/api';
import { Bell, X } from 'lucide-react';
import { useHistory } from 'react-router-dom';
import './NotificationBell.css';

const NotificationBell: React.FC = () => {
    const { user } = useAuth();
    const history = useHistory();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const fetchNotifications = async () => {
        if (!user) return;
        
        try {
            setLoading(true);
            const [notifs, count] = await Promise.all([
                getNotifications(),
                getUnreadNotificationCount()
            ]);
            setNotifications(notifs);
            setUnreadCount(count);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchNotifications();
            // Poll for new notifications every 30 seconds
            const interval = setInterval(fetchNotifications, 30000);
            return () => clearInterval(interval);
        }
    }, [user]);

    const handleNotificationClick = async (notification: Notification) => {
        try {
            if (!notification.read) {
                await markNotificationAsRead(notification.id);
                setUnreadCount(prev => Math.max(0, prev - 1));
            }
            
            if (notification.link) {
                history.push(notification.link);
            }
            
            setIsOpen(false);
            await fetchNotifications();
        } catch (error) {
            console.error('Error handling notification:', error);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await markAllNotificationsAsRead();
            setUnreadCount(0);
            await fetchNotifications();
        } catch (error) {
            console.error('Error marking all as read:', error);
        }
    };

    const handleDelete = async (notificationId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        
        try {
            await deleteNotification(notificationId);
            await fetchNotifications();
        } catch (error) {
            console.error('Error deleting notification:', error);
        }
    };

    if (!user) return null;

    return (
        <div className="notification-bell-container">
            <button 
                className="notification-bell-button"
                onClick={() => setIsOpen(!isOpen)}
            >
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span className="notification-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
                )}
            </button>

            {isOpen && (
                <div className="notification-dropdown">
                    <div className="notification-header">
                        <h3>Notifications</h3>
                        {unreadCount > 0 && (
                            <button 
                                className="mark-all-read"
                                onClick={handleMarkAllAsRead}
                            >
                                Mark all as read
                            </button>
                        )}
                    </div>

                    <div className="notification-list">
                        {loading ? (
                            <p className="notification-empty">Loading...</p>
                        ) : notifications.length === 0 ? (
                            <p className="notification-empty">No notifications</p>
                        ) : (
                            notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={`notification-item ${!notification.read ? 'unread' : ''}`}
                                    onClick={() => handleNotificationClick(notification)}
                                >
                                    <div className="notification-content">
                                        <strong>{notification.title}</strong>
                                        <p>{notification.message}</p>
                                        <span className="notification-time">
                                            {new Date(notification.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <button
                                        className="notification-delete"
                                        onClick={(e) => handleDelete(notification.id, e)}
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationBell;
```

#### Update `client/src/components/shared/Header.tsx`
Add NotificationBell component next to the user profile:

```tsx
import NotificationBell from './NotificationBell';

// In the header where user is logged in, add:
{user ? (
    <div className="flex items-center gap-4">
        <NotificationBell />  {/* Add this */}
        <Link to="/profile" className="hidden md:flex items-center gap-2 text-sm text-gray-600 hover:text-brand-orange-600 transition-colors">
            <User className="w-4 h-4" />
            <span>Profile</span>
        </Link>
        {/* ... rest of logged in UI */}
    </div>
) : (
    {/* ... logged out UI */}
)}
```
```tsx
import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { CommunityPost } from '../../types';
import { getCommunityPosts, likePost, unlikePost, deleteCommunityPost } from '../../services/api';
import { Heart, Trash2 } from 'lucide-react';
import CreatePostForm from './CreatePostForm';
import './CommunityFeed.css';

const CommunityFeed: React.FC = () => {
    const { user } = useAuth();
    const [posts, setPosts] = React.useState<CommunityPost[]>([]);
    const [loading, setLoading] = React.useState<boolean>(true);

    const fetchPosts = async () => {
        try {
            const data = await getCommunityPosts();
            setPosts(data);
        } catch (error) {
            console.error('Error fetching community posts:', error);
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        fetchPosts();
    }, []);

    const handleLike = async (postId: string, isLiked: boolean) => {
        if (!user) {
            alert('Please log in to like posts');
            return;
        }

        try {
            if (isLiked) {
                await unlikePost(postId);
            } else {
                await likePost(postId);
            }
            // Refresh posts to show updated like count
            await fetchPosts();
        } catch (error: any) {
            console.error('Error toggling like:', error);
            alert(error.response?.data?.message || 'Failed to update like');
        }
    };

    const handleDelete = async (postId: string) => {
        if (!window.confirm('Are you sure you want to delete this post?')) {
            return;
        }

        try {
            await deleteCommunityPost(postId);
            await fetchPosts();
        } catch (error) {
            console.error('Error deleting post:', error);
            alert('Failed to delete post');
        }
    };

    if (loading) {
        return (
            <div className="community-feed">
                <h2>Community Feed</h2>
                <p className="no-posts-message">Loading posts...</p>
            </div>
        );
    }

    return (
        <div className="community-feed">
            <h2>Community Feed</h2>
            
            <CreatePostForm onPostCreated={fetchPosts} />

            {posts.length === 0 ? (
                <div className="no-posts-message">
                    <p>No posts available. Be the first to share!</p>
                </div>
            ) : (
                <div className="posts-gallery">
                    {posts.map((post) => (
                        <div key={post.id} className="post-card">
                            <div className="post-header">
                                <span className="post-author">{post.authorName}</span>
                                {user?.id === post.userId && (
                                    <button
                                        className="delete-button"
                                        onClick={() => handleDelete(post.id)}
                                        title="Delete post"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                )}
                            </div>
                            
                            <div className="post-content">{post.content}</div>
                            
                            {post.route && (
                                <div className="post-route">📍 {post.route}</div>
                            )}
                            
                            {post.petTypes && post.petTypes.length > 0 && (
                                <div className="post-pet-types">
                                    {post.petTypes.map(type => (
                                        <span key={type} className="pet-tag">{type}</span>
                                    ))}
                                </div>
                            )}
                            
                            <div className="post-footer">
                                <button
                                    className={`like-button ${post.isLikedByUser ? 'liked' : ''}`}
                                    onClick={() => handleLike(post.id, post.isLikedByUser || false)}
                                    disabled={!user}
                                >
                                    <Heart 
                                        size={18} 
                                        fill={post.isLikedByUser ? 'currentColor' : 'none'}
                                    />
                                    <span>{post.likes}</span>
                                </button>
                                
                                <span className="post-date">
                                    {new Date(post.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CommunityFeed;
```

### Phase 7: Styling (15 min)

#### Update `client/src/components/NoseBooper/CommunityFeed.css`
```css
/* Add to existing styles */

.create-post-form {
    background: white;
    border-radius: 12px;
    padding: 1.5rem;
    margin-bottom: 2rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.create-post-form h3 {
    margin-top: 0;
    margin-bottom: 1rem;
    color: #333;
}

.post-textarea {
    width: 100%;
    padding: 0.75rem;
    border: 2px solid #e5e7eb;
    border-radius: 8px;
    font-family: inherit;
    font-size: 1rem;
    resize: vertical;
    margin-bottom: 1rem;
}

.post-textarea:focus {
    outline: none;
    border-color: #ff6b35;
}

.optional-fields {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1rem;
}

.optional-fields input {
    flex: 1;
}

.login-prompt {
    text-align: center;
    color: #666;
    font-size: 0.875rem;
    padding: 0.5rem;
}

.post-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
}

.delete-button {
    background: none;
    border: none;
    color: #dc2626;
    cursor: pointer;
    padding: 0.25rem;
    opacity: 0.7;
    transition: opacity 0.2s;
}

.delete-button:hover {
    opacity: 1;
}

.post-route {
    color: #666;
    font-size: 0.875rem;
    margin: 0.5rem 0;
}

.post-pet-types {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
    margin: 0.5rem 0;
}

.pet-tag {
    background: #fef3c7;
    color: #92400e;
    padding: 0.25rem 0.75rem;
    border-radius: 12px;
    font-size: 0.75rem;
    font-weight: 500;
}

.post-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid #e5e7eb;
}

.post-actions {
    display: flex;
    gap: 1rem;
}

.action-button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: none;
    border: none;
    color: #666;
    cursor: pointer;
    font-size: 0.875rem;
    padding: 0.25rem 0.5rem;
    border-radius: 6px;
    transition: all 0.2s;
}

.action-button:hover:not(:disabled) {
    background: #f3f4f6;
}

.like-button:hover:not(:disabled) {
    background: #fef2f2;
    color: #dc2626;
}

.like-button.liked {
    color: #dc2626;
}

.comment-button:hover {
    background: #eff6ff;
    color: #2563eb;
}

.action-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.error-message {
    color: #dc2626;
    font-size: 0.875rem;
    margin: 0.5rem 0;
}
```

#### Create `client/src/components/NoseBooper/CommentSection.css`
```css
.comment-section {
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 2px solid #e5e7eb;
}

.comments-list {
    margin-bottom: 1rem;
}

.no-comments {
    text-align: center;
    color: #9ca3af;
    font-size: 0.875rem;
    padding: 1rem;
}

.comment {
    padding: 0.75rem;
    background: #f9fafb;
    border-radius: 8px;
    margin-bottom: 0.5rem;
}

.comment-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
    font-size: 0.875rem;
}

.comment-author {
    font-weight: 600;
    color: #374151;
}

.comment-date {
    color: #9ca3af;
    font-size: 0.75rem;
}

.comment-delete-button {
    background: none;
    border: none;
    color: #dc2626;
    cursor: pointer;
    padding: 0.25rem;
    opacity: 0.7;
    margin-left: auto;
    transition: opacity 0.2s;
}

.comment-delete-button:hover {
    opacity: 1;
}

.comment-content {
    color: #4b5563;
    font-size: 0.875rem;
}

.comment-form {
    display: flex;
    gap: 0.5rem;
    align-items: center;
}

.comment-input {
    flex: 1;
    padding: 0.5rem 0.75rem;
    border: 2px solid #e5e7eb;
    border-radius: 8px;
    font-size: 0.875rem;
}

.comment-input:focus {
    outline: none;
    border-color: #ff6b35;
}
```

#### Create `client/src/components/shared/NotificationBell.css`
```css
.notification-bell-container {
    position: relative;
}

.notification-bell-button {
    position: relative;
    background: none;
    border: none;
    color: #6b7280;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 50%;
    transition: all 0.2s;
}

.notification-bell-button:hover {
    background: #f3f4f6;
    color: #ff6b35;
}

.notification-badge {
    position: absolute;
    top: 0;
    right: 0;
    background: #dc2626;
    color: white;
    font-size: 0.625rem;
    font-weight: 600;
    padding: 0.125rem 0.375rem;
    border-radius: 10px;
    min-width: 18px;
    text-align: center;
}

.notification-dropdown {
    position: absolute;
    top: calc(100% + 0.5rem);
    right: 0;
    width: 350px;
    max-height: 500px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
    z-index: 1000;
    overflow: hidden;
}

.notification-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    border-bottom: 1px solid #e5e7eb;
}

.notification-header h3 {
    margin: 0;
    font-size: 1rem;
    color: #111827;
}

.mark-all-read {
    background: none;
    border: none;
    color: #ff6b35;
    font-size: 0.75rem;
    cursor: pointer;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    transition: background 0.2s;
}

.mark-all-read:hover {
    background: #fff7ed;
}

.notification-list {
    max-height: 400px;
    overflow-y: auto;
}

.notification-empty {
    text-align: center;
    color: #9ca3af;
    padding: 2rem 1rem;
    font-size: 0.875rem;
}

.notification-item {
    display: flex;
    align-items: start;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    border-bottom: 1px solid #f3f4f6;
    cursor: pointer;
    transition: background 0.2s;
}

.notification-item:hover {
    background: #f9fafb;
}

.notification-item.unread {
    background: #eff6ff;
}

.notification-item.unread:hover {
    background: #dbeafe;
}

.notification-content {
    flex: 1;
}

.notification-content strong {
    display: block;
    color: #111827;
    font-size: 0.875rem;
    margin-bottom: 0.25rem;
}

.notification-content p {
    color: #6b7280;
    font-size: 0.8125rem;
    margin: 0 0 0.25rem 0;
}

.notification-time {
    color: #9ca3af;
    font-size: 0.75rem;
}

.notification-delete {
    background: none;
    border: none;
    color: #9ca3af;
    cursor: pointer;
    padding: 0.25rem;
    border-radius: 4px;
    transition: all 0.2s;
}

.notification-delete:hover {
    background: #fee2e2;
    color: #dc2626;
}
```

## ✅ Testing Checklist

### Database Tests
- [ ] Run SQL migrations in Supabase
- [ ] Verify `post_likes` table exists
- [ ] Verify `post_comments` table exists
- [ ] Verify `notifications` table exists
- [ ] Test RLS policies (can users only unlike their own likes?)
- [ ] Test Postgres functions (increment/decrement counts)

### Backend Tests
- [ ] GET /api/community/posts - returns posts with like/comment counts
- [ ] POST /api/community/posts - creates post (requires auth)
- [ ] POST /api/community/posts/:id/like - likes post (requires auth)
- [ ] DELETE /api/community/posts/:id/like - unlikes post (requires auth)
- [ ] GET /api/community/posts/:id/comments - returns comments
- [ ] POST /api/community/posts/:id/comments - creates comment (requires auth)
- [ ] DELETE /api/community/comments/:id - deletes comment (owner only)
- [ ] DELETE /api/community/posts/:id - deletes post (owner only)
- [ ] GET /api/notifications - returns user notifications
- [ ] GET /api/notifications/unread-count - returns count
- [ ] PUT /api/notifications/:id/read - marks as read
- [ ] PUT /api/notifications/read-all - marks all as read
- [ ] Verify notification created when comment is posted

### Frontend Tests
- [ ] Logged out: Can view posts and comments, cannot like/post/comment
- [ ] Logged in: Can create posts with route and pet types
- [ ] Logged in: Can like/unlike posts
- [ ] Like count updates immediately
- [ ] Heart icon fills when liked
- [ ] Comment button shows comment count
- [ ] Click comment button expands comment section
- [ ] Can add comments to posts
- [ ] Comment count updates after adding/deleting comment
- [ ] Only comment owner sees delete button on comments
- [ ] Only post owner sees delete button on posts
- [ ] Can delete own posts and comments
- [ ] Notification bell shows unread count
- [ ] Notifications dropdown shows all notifications
- [ ] Click notification marks as read and navigates
- [ ] Can mark all notifications as read
- [ ] Can delete individual notifications
- [ ] Notification badge updates in real-time

## 🚀 Deployment Notes
- No client .env changes needed
- No server .env changes needed
- Just run SQL migrations in Supabase production DB
- Deploy as normal to Vercel

## 📈 Future Enhancements
- Nested replies to comments
- Photo/video uploads in posts
- User profile pages with post history
- Post filtering by route/pet type
- Real-time notifications (using Supabase Realtime)
- Email notifications for comments
- Share posts externally
- Mention users with @username
- Hashtag support
- Post reactions (beyond just likes)
- Edit posts and comments
- Report inappropriate content
