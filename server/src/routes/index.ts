import express from 'express';
import travelRoutes from './travelRoutes';
import communityRoutes from './communityRoutes';

const router = express.Router();

// Use travel-related routes
router.use('/travel', travelRoutes);

// Use community-related routes
router.use('/community', communityRoutes);

export default router;