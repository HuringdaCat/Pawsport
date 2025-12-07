import { VercelRequest, VercelResponse } from '@vercel/node';
import { CommunityService } from '../../lib/services/communityService';

const communityService = new CommunityService();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    try {
      const posts = await communityService.fetchCommunityPosts();
      return res.status(200).json(posts);
    } catch (error: any) {
      console.error('Error fetching community posts:', error);
      return res.status(500).json({ 
        message: 'Error fetching community posts', 
        error: error.message 
      });
    }
  }

  if (req.method === 'POST') {
    try {
      const { userId, content } = req.body;
      
      if (!userId || !content) {
        return res.status(400).json({ 
          message: 'Missing required fields: userId, content' 
        });
      }

      const newPost = await communityService.addCommunityPost({ userId, content });
      return res.status(201).json(newPost);
    } catch (error: any) {
      console.error('Error creating community post:', error);
      return res.status(500).json({ 
        message: 'Error creating community post', 
        error: error.message 
      });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const id = req.query.id as string;
      
      if (!id) {
        return res.status(400).json({ message: 'Missing required parameter: id' });
      }

      await communityService.removeCommunityPost(id);
      return res.status(204).end();
    } catch (error: any) {
      console.error('Error deleting community post:', error);
      return res.status(500).json({ 
        message: 'Error deleting community post', 
        error: error.message 
      });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
