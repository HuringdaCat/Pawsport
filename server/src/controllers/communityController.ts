import { Request, Response } from 'express';
import { CommunityService } from '../services/communityService';

class CommunityController {
    private communityService: CommunityService;

    constructor() {
        this.communityService = new CommunityService();
    }

    public async getCommunityPosts(req: Request, res: Response): Promise<void> {
        try {
            const posts = await this.communityService.fetchCommunityPosts();
            res.status(200).json(posts);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching community posts', error });
        }
    }

    public async createCommunityPost(req: Request, res: Response): Promise<void> {
        try {
            const newPost = await this.communityService.addCommunityPost(req.body);
            res.status(201).json(newPost);
        } catch (error) {
            res.status(500).json({ message: 'Error creating community post', error });
        }
    }

    public async deleteCommunityPost(req: Request, res: Response): Promise<void> {
        try {
            await this.communityService.removeCommunityPost(req.params.id);
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ message: 'Error deleting community post', error });
        }
    }
}

export default new CommunityController();