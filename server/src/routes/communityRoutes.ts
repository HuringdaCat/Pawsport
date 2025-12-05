import { Router } from 'express';
import { 
    getCommunityPosts, 
    createCommunityPost, 
    getUserPosts, 
    deleteCommunityPost 
} from '../controllers/communityController';

const router = Router();

// Route to get all community posts
router.get('/posts', getCommunityPosts);

// Route to create a new community post
router.post('/posts', createCommunityPost);

// Route to get posts by a specific user
router.get('/posts/user/:userId', getUserPosts);

// Route to delete a community post
router.delete('/posts/:postId', deleteCommunityPost);

export default router;