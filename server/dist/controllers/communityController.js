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
class CommunityController {
    constructor() {
        this.communityService = new communityService_1.CommunityService();
    }
    getCommunityPosts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const posts = yield this.communityService.fetchCommunityPosts();
                res.status(200).json(posts);
            }
            catch (error) {
                res.status(500).json({ message: 'Error fetching community posts', error });
            }
        });
    }
    createCommunityPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newPost = yield this.communityService.addCommunityPost(req.body);
                res.status(201).json(newPost);
            }
            catch (error) {
                res.status(500).json({ message: 'Error creating community post', error });
            }
        });
    }
    deleteCommunityPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.communityService.removeCommunityPost(req.params.id);
                res.status(204).send();
            }
            catch (error) {
                res.status(500).json({ message: 'Error deleting community post', error });
            }
        });
    }
}
exports.default = new CommunityController();
