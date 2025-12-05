"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateTravelRequest = void 0;
const express_validator_1 = require("express-validator");
// Middleware to validate incoming requests
exports.validateTravelRequest = [
    (0, express_validator_1.body)('origin').notEmpty().withMessage('Origin is required'),
    (0, express_validator_1.body)('destination').notEmpty().withMessage('Destination is required'),
    (0, express_validator_1.body)('species').notEmpty().withMessage('Species is required'),
    (0, express_validator_1.body)('breed').notEmpty().withMessage('Breed is required'),
    (0, express_validator_1.body)('vaccinationStatus').isBoolean().withMessage('Vaccination status must be a boolean'),
    (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];
// Additional validation middleware can be added here as needed.
