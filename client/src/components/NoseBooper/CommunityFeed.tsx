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
                <div className="posts-gallery">
                    {posts.map((post) => (
                        <div key={post.id} className="post-card">
                            <div className="post-content">{post.content}</div>
                            <div className="post-meta">
                                <span className="post-author">{post.userId}</span>
                                <span className="post-date">{new Date(post.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CommunityFeed;