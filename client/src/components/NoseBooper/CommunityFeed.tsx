import React from 'react';
import { CommunityPost } from '../../types';
import { getCommunityPosts } from '../../services/api';

const CommunityFeed: React.FC = () => {
    const [posts, setPosts] = React.useState<CommunityPost[]>([]);

    React.useEffect(() => {
        // Fetch community posts from the API
        const fetchPosts = async () => {
            try {
                const data = await getCommunityPosts();
                setPosts(data);
            } catch (error) {
                console.error('Error fetching community posts:', error);
            }
        };

        fetchPosts();
    }, []);

    return (
        <div className="community-feed">
            <h2>Community Feed</h2>
            {posts.length === 0 ? (
                <p>No posts available. Be the first to share!</p>
            ) : (
                <ul>
                    {posts.map((post) => (
                        <li key={post.id}>
                            <p>{post.content}</p>
                            <p><strong>Posted by:</strong> {post.authorId}</p>
                            <p><small>{new Date(post.createdAt).toLocaleDateString()}</small></p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default CommunityFeed;