import { Router } from 'express';
import communityController from '../controllers/communityController';
import { authenticate, optionalAuth } from '../middleware/auth';

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