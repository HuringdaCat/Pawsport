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
        
        return (data || []).map(notif => ({
            id: notif.id,
            userId: notif.user_id,
            type: notif.type,
            title: notif.title,
            message: notif.message,
            link: notif.link,
            read: notif.read,
            createdAt: new Date(notif.created_at)
        }));
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
