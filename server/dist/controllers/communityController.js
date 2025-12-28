"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const communityService_1 = require("../services/communityService");
const supabase_1 = require("../config/supabase");
class CommunityController {
    constructor() {
        this.communityService = new communityService_1.CommunityService();
    }
    // GET /api/community/posts (public, but shows like status if authenticated)
    getCommunityPosts(req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id; // Optional auth from middleware
                const posts = yield this.communityService.fetchCommunityPosts(userId);
                res.status(200).json(posts);
            }
            catch (error) {
                res.status(500).json({ message: 'Error fetching community posts', error });
            }
        });
    }
    // POST /api/community/posts (requires auth)
    createCommunityPost(req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.user) {
                    res.status(401).json({ message: 'Authentication required' });
                    return;
                }
                const { content, route, petTypes } = req.body;
                if (!content || content.trim().length === 0) {
                    res.status(400).json({ message: 'Content is required' });
                    return;
                }
                // Get user's display name from profile
                const { data: profile } = yield supabase_1.supabase
                    .from('profiles')
                    .select('display_name')
                    .eq('id', req.user.id)
                    .single();
                const authorName = (profile === null || profile === void 0 ? void 0 : profile.display_name) || ((_a = req.user.email) === null || _a === void 0 ? void 0 : _a.split('@')[0]) || 'Anonymous';
                const newPost = yield this.communityService.addCommunityPost(req.user.id, authorName, { content, route, petTypes });
                res.status(201).json(newPost);
            }
            catch (error) {
                res.status(500).json({ message: 'Error creating community post', error });
            }
        });
    }
    // POST /api/community/posts/:id/like (requires auth)
    likePost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.user) {
                    res.status(401).json({ message: 'Authentication required' });
                    return;
                }
                yield this.communityService.likePost(req.params.id, req.user.id);
                res.status(200).json({ message: 'Post liked successfully' });
            }
            catch (error) {
                if (error.message === 'Post already liked') {
                    res.status(400).json({ message: error.message });
                }
                else {
                    res.status(500).json({ message: 'Error liking post', error });
                }
            }
        });
    }
    // DELETE /api/community/posts/:id/like (requires auth)
    unlikePost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.user) {
                    res.status(401).json({ message: 'Authentication required' });
                    return;
                }
                yield this.communityService.unlikePost(req.params.id, req.user.id);
                res.status(200).json({ message: 'Post unliked successfully' });
            }
            catch (error) {
                res.status(500).json({ message: 'Error unliking post', error });
            }
        });
    }
    // GET /api/community/posts/:id/comments (public)
    getPostComments(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const comments = yield this.communityService.fetchPostComments(req.params.id);
                res.status(200).json(comments);
            }
            catch (error) {
                res.status(500).json({ message: 'Error fetching comments', error });
            }
        });
    }
    // POST /api/community/posts/:id/comments (requires auth)
    addComment(req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.user) {
                    res.status(401).json({ message: 'Authentication required' });
                    return;
                }
                const { content } = req.body;
                if (!content || content.trim().length === 0) {
                    res.status(400).json({ message: 'Comment content is required' });
                    return;
                }
                // Get user's display name
                const { data: profile } = yield supabase_1.supabase
                    .from('profiles')
                    .select('display_name')
                    .eq('id', req.user.id)
                    .single();
                const authorName = (profile === null || profile === void 0 ? void 0 : profile.display_name) || ((_a = req.user.email) === null || _a === void 0 ? void 0 : _a.split('@')[0]) || 'Anonymous';
                const comment = yield this.communityService.addComment(req.params.id, req.user.id, authorName, content.trim());
                res.status(201).json(comment);
            }
            catch (error) {
                res.status(500).json({ message: 'Error adding comment', error });
            }
        });
    }
    // DELETE /api/community/comments/:id (requires auth, owner only)
    deleteComment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.user) {
                    res.status(401).json({ message: 'Authentication required' });
                    return;
                }
                yield this.communityService.removeComment(req.params.id, req.user.id);
                res.status(204).send();
            }
            catch (error) {
                res.status(500).json({ message: 'Error deleting comment', error });
            }
        });
    }
    // DELETE /api/community/posts/:id (requires auth, owner only)
    deleteCommunityPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.user) {
                    res.status(401).json({ message: 'Authentication required' });
                    return;
                }
                yield this.communityService.removeCommunityPost(req.params.id, req.user.id);
                res.status(204).send();
            }
            catch (error) {
                res.status(500).json({ message: 'Error deleting community post', error });
            }
        });
    }
}
exports.default = new CommunityController();
