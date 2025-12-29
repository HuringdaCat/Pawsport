import { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
}

const supabase = createClient(supabaseUrl || '', supabaseKey || '');

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    try {
      const { data: posts, error } = await supabase
        .from('community_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform to match expected format
      const transformedPosts = posts.map(post => ({
        id: post.id,
        userId: post.user_id,
        authorName: post.author_name,
        content: post.content,
        route: post.route,
        petTypes: post.pet_types,
        likes: post.likes || 0,
        commentCount: post.comment_count || 0,
        createdAt: post.created_at,
        updatedAt: post.updated_at
      }));

      return res.status(200).json(transformedPosts);
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
      const { userId, authorName, content, route, petTypes } = req.body;
      
      if (!userId || !authorName || !content) {
        return res.status(400).json({ 
          message: 'Missing required fields: userId, authorName, content' 
        });
      }

      const { data, error } = await supabase
        .from('community_posts')
        .insert({
          user_id: userId,
          author_name: authorName,
          content,
          route,
          pet_types: petTypes,
          likes: 0,
          comment_count: 0
        })
        .select()
        .single();

      if (error) throw error;

      return res.status(201).json({
        id: data.id,
        userId: data.user_id,
        authorName: data.author_name,
        content: data.content,
        route: data.route,
        petTypes: data.pet_types,
        likes: data.likes,
        commentCount: data.comment_count,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      });
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
      const userId = req.query.userId as string;
      
      if (!id || !userId) {
        return res.status(400).json({ message: 'Missing required parameters: id, userId' });
      }

      const { error } = await supabase
        .from('community_posts')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

      if (error) throw error;

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
