"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const travelRoutes_1 = __importDefault(require("./travelRoutes"));
const communityRoutes_1 = __importDefault(require("./communityRoutes"));
const router = express_1.default.Router();
// Use travel-related routes
router.use('/travel', travelRoutes_1.default);
// Use community-related routes
router.use('/community', communityRoutes_1.default);
exports.default = router;
