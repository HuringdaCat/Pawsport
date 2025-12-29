"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const communityController_1 = __importDefault(require("../controllers/communityController"));
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Public routes (with optional auth to show like status)
router.get('/posts', auth_1.optionalAuth, communityController_1.default.getCommunityPosts.bind(communityController_1.default));
router.get('/posts/:id/comments', communityController_1.default.getPostComments.bind(communityController_1.default));
// Protected routes (require authentication)
router.post('/posts', auth_1.authenticate, communityController_1.default.createCommunityPost.bind(communityController_1.default));
router.post('/posts/:id/like', auth_1.authenticate, communityController_1.default.likePost.bind(communityController_1.default));
router.delete('/posts/:id/like', auth_1.authenticate, communityController_1.default.unlikePost.bind(communityController_1.default));
router.post('/posts/:id/comments', auth_1.authenticate, communityController_1.default.addComment.bind(communityController_1.default));
router.delete('/comments/:id', auth_1.authenticate, communityController_1.default.deleteComment.bind(communityController_1.default));
router.delete('/posts/:id', auth_1.authenticate, communityController_1.default.deleteCommunityPost.bind(communityController_1.default));
exports.default = router;
