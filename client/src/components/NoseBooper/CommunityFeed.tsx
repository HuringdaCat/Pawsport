import React from 'react';

const CommunityFeed: React.FC = () => {
    const [posts, setPosts] = React.useState([]);

    React.useEffect(() => {
        // Fetch community posts from the API
        const fetchPosts = async () => {
            try {
                const response = await fetch('/api/community/posts');
                const data = await response.json();
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
                            <h3>{post.title}</h3>
                            <p>{post.content}</p>
                            <p><strong>Posted by:</strong> {post.author}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default CommunityFeed;