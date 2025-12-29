import { Request, Response } from 'express';
import { NotificationService } from '../services/notificationService';
// Import middleware to get type extensions
import '../middleware/auth';

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
