import express from 'express';
import authRoutes from './authRoutes';
import travelRoutes from './travelRoutes';
import communityRoutes from './communityRoutes';
import notificationRoutes from './notificationRoutes';

const router = express.Router();

// Auth routes
router.use('/auth', authRoutes);

// Use travel-related routes
router.use('/travel', travelRoutes);

// Use community-related routes
router.use('/community', communityRoutes);

// Use notification routes
router.use('/notifications', notificationRoutes);

export default router;