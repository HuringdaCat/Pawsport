"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const communityController_1 = require("../controllers/communityController");
const router = (0, express_1.Router)();
// Route to get all community posts
router.get('/posts', communityController_1.getCommunityPosts);
// Route to create a new community post
router.post('/posts', communityController_1.createCommunityPost);
// Route to get posts by a specific user
router.get('/posts/user/:userId', communityController_1.getUserPosts);
// Route to delete a community post
router.delete('/posts/:postId', communityController_1.deleteCommunityPost);
exports.default = router;
