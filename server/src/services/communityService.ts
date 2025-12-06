import { CommunityPost } from '../types';

export class CommunityService {
    private posts: CommunityPost[];

    constructor() {
        // Mock data for community posts
        this.posts = [
            {
                id: '1',
                userId: 'user1',
                content: 'Just moved to Paris with my dog! Any tips for pet-friendly cafes?',
                createdAt: new Date('2024-01-15')
            },
            {
                id: '2',
                userId: 'user2',
                content: 'Flying to Tokyo next month with my cat. Who else is going?',
                createdAt: new Date('2024-01-20')
            }
        ];
    }

    public async fetchCommunityPosts(): Promise<CommunityPost[]> {
        return this.posts;
    }

    public async addCommunityPost(post: Omit<CommunityPost, 'id' | 'createdAt'>): Promise<CommunityPost> {
        const newPost: CommunityPost = {
            ...post,
            id: Date.now().toString(),
            createdAt: new Date()
        };
        this.posts.push(newPost);
        return newPost;
    }

    public async removeCommunityPost(id: string): Promise<void> {
        this.posts = this.posts.filter(post => post.id !== id);
    }
}
