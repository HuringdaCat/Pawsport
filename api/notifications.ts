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
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Extract userId from query params (you may want to use auth middleware later)
  const userId = req.query.userId as string;

  if (!userId) {
    return res.status(401).json({ message: 'User ID required' });
  }

  if (req.method === 'GET') {
    try {
      const unreadOnly = req.query.unreadOnly === 'true';

      let query = supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (unreadOnly) {
        query = query.eq('read', false);
      }

      const { data: notifications, error } = await query;

      if (error) throw error;

      // Transform to match expected format
      const transformedNotifications = notifications.map(notif => ({
        id: notif.id,
        userId: notif.user_id,
        type: notif.type,
        title: notif.title,
        message: notif.message,
        link: notif.link,
        read: notif.read,
        createdAt: notif.created_at
      }));

      return res.status(200).json(transformedNotifications);
    } catch (error: any) {
      console.error('Error fetching notifications:', error);
      return res.status(500).json({ 
        message: 'Error fetching notifications', 
        error: error.message 
      });
    }
  }

  if (req.method === 'PUT') {
    // Mark notification as read
    try {
      const notificationId = req.query.id as string;

      if (!notificationId) {
        return res.status(400).json({ message: 'Notification ID required' });
      }

      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId)
        .eq('user_id', userId);

      if (error) throw error;

      return res.status(200).json({ message: 'Notification marked as read' });
    } catch (error: any) {
      console.error('Error updating notification:', error);
      return res.status(500).json({ 
        message: 'Error updating notification', 
        error: error.message 
      });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const notificationId = req.query.id as string;

      if (!notificationId) {
        return res.status(400).json({ message: 'Notification ID required' });
      }

      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId)
        .eq('user_id', userId);

      if (error) throw error;

      return res.status(204).end();
    } catch (error: any) {
      console.error('Error deleting notification:', error);
      return res.status(500).json({ 
        message: 'Error deleting notification', 
        error: error.message 
      });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
