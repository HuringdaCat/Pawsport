import React from 'react';
import { CommunityPost } from '../../types';
import { getCommunityPosts } from '../../services/api';
import './CommunityFeed.css';

const CommunityFeed: React.FC = () => {
    const [posts, setPosts] = React.useState<CommunityPost[]>([]);
    const [loading, setLoading] = React.useState<boolean>(true);

    React.useEffect(() => {
        const fetchPosts = async () => {
            try {
                const data = await getCommunityPosts();
                setPosts(data);
            } catch (error) {
                console.error('Error fetching community posts:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    if (loading) {
        return (
            <div className="community-feed">
                <h2>Community Feed</h2>
                <p className="no-posts-message">Loading posts...</p>
            </div>
        );
    }

    return (
        <div className="community-feed">
            <h2>Community Feed</h2>
            {posts.length === 0 ? (
                <div className="no-posts-message">
                    <p>No posts available. Be the first to share!</p>
                </div>
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