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
            },
            {
                id: '3',
                userId: 'user3',
                content: 'Looking for travel buddies! Moving from NYC to LA with my Golden Retriever next week. Anyone on a similar route?',
                createdAt: new Date('2024-02-01')
            },
            {
                id: '4',
                userId: 'user4',
                content: 'Pro tip: Always bring your pet\'s medical records in both digital and physical format. Saved me at customs in Berlin!',
                createdAt: new Date('2024-02-03')
            },
            {
                id: '5',
                userId: 'user5',
                content: 'Has anyone traveled to Australia with a rabbit? Need advice on quarantine requirements 🐰',
                createdAt: new Date('2024-02-05')
            },
            {
                id: '6',
                userId: 'user6',
                content: 'Shoutout to the pet handler at JFK! They were so gentle with my anxious poodle during the security check.',
                createdAt: new Date('2024-02-08')
            },
            {
                id: '7',
                userId: 'user7',
                content: 'Road tripping from Seattle to Miami with two rescue dogs. Day 3 and they\'re loving it! 🚗🐕',
                createdAt: new Date('2024-02-10')
            },
            {
                id: '8',
                userId: 'user8',
                content: 'Question: Best airline carriers for large breed dogs flying internationally? My German Shepherd needs to travel to London.',
                createdAt: new Date('2024-02-12')
            },
            {
                id: '9',
                userId: 'user9',
                content: 'Successfully relocated to Dubai with my parrot! Happy to answer questions about bird travel regulations.',
                createdAt: new Date('2024-02-14')
            },
            {
                id: '10',
                userId: 'user10',
                content: 'Looking for a travel companion for my senior cat. Flying from San Francisco to Toronto next month. Can share carrier tips!',
                createdAt: new Date('2024-02-16')
            },
            {
                id: '11',
                userId: 'user11',
                content: 'PSA: Check your destination\'s banned breed list! Almost got turned away with my Pit Bull mix at customs.',
                createdAt: new Date('2024-02-18')
            },
            {
                id: '12',
                userId: 'user12',
                content: 'Train travel across Europe with pets is amazing! Just did Paris-Barcelona-Rome with my French Bulldog. Highly recommend!',
                createdAt: new Date('2024-02-20')
            },
            {
                id: '13',
                userId: 'user13',
                content: 'Any vets in Singapore? My beagle needs a checkup after our long flight from Vancouver.',
                createdAt: new Date('2024-02-22')
            },
            {
                id: '14',
                userId: 'user14',
                content: 'Pet relocation services are worth every penny! Used one for my move to New Zealand and it was stress-free.',
                createdAt: new Date('2024-02-24')
            },
            {
                id: '15',
                userId: 'user15',
                content: 'Heading to Mexico City next week with my Chihuahua. Anyone know good pet-friendly accommodations?',
                createdAt: new Date('2024-02-26')
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
