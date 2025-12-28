import express from 'express';
import authRoutes from './authRoutes';
import travelRoutes from './travelRoutes';
import communityRoutes from './communityRoutes';

const router = express.Router();

// Auth routes
router.use('/auth', authRoutes);

// Use travel-related routes
router.use('/travel', travelRoutes);

// Use community-related routes
router.use('/community', communityRoutes);

export default router;