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
