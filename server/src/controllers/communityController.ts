import { Request, Response } from 'express';
import { CommunityService } from '../services/communityService';
import { supabase } from '../config/supabase';
// Import middleware to get type extensions
import '../middleware/auth';

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