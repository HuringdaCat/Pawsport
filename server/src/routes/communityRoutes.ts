import { Router } from 'express';
import communityController from '../controllers/communityController';

const router = Router();

// Route to get all community posts
router.get('/posts', communityController.getCommunityPosts.bind(communityController));

// Route to create a new community post
router.post('/posts', communityController.createCommunityPost.bind(communityController));

// Route to delete a community post
router.delete('/posts/:id', communityController.deleteCommunityPost.bind(communityController));

export default router;