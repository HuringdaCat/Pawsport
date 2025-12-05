import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';

// Middleware to validate incoming requests
export const validateTravelRequest = [
    body('origin').notEmpty().withMessage('Origin is required'),
    body('destination').notEmpty().withMessage('Destination is required'),
    body('species').notEmpty().withMessage('Species is required'),
    body('breed').notEmpty().withMessage('Breed is required'),
    body('vaccinationStatus').isBoolean().withMessage('Vaccination status must be a boolean'),

    (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

// Additional validation middleware can be added here as needed.