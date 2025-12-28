import { supabase } from '../config/supabase';
import { CommunityPost, Comment } from '../types';

export class CommunityService {
    // Fetch all posts with like counts and user names
    public async fetchCommunityPosts(currentUserId?: string): Promise<CommunityPost[]> {
        const { data: posts, error } = await supabase
            .from('community_posts')
            .select(`
                id,
                user_id,
                author_name,
                content,
                route,
                pet_types,
                likes,
                comment_count,
                created_at,
                updated_at
            `)
            .order('created_at', { ascending: false });

        if (error) throw error;

        // If user is logged in, check which posts they liked
        if (currentUserId) {
            const { data: userLikes } = await supabase
                .from('post_likes')
                .select('post_id')
                .eq('user_id', currentUserId);

            const likedPostIds = new Set(userLikes?.map(l => l.post_id) || []);
            
            return posts.map(post => ({
                id: post.id,
                userId: post.user_id,
                authorName: post.author_name,
                content: post.content,
                route: post.route,
                petTypes: post.pet_types,
                likes: post.likes,
                commentCount: post.comment_count,
                isLikedByUser: likedPostIds.has(post.id),
                createdAt: new Date(post.created_at),
                updatedAt: new Date(post.updated_at)
            }));
        }

        return posts.map(post => ({
            id: post.id,
            userId: post.user_id,
            authorName: post.author_name,
            content: post.content,
            route: post.route,
            petTypes: post.pet_types,
            likes: post.likes,
            commentCount: post.comment_count,
            createdAt: new Date(post.created_at),
            updatedAt: new Date(post.updated_at)
        }));
    }

    // Create new post (requires auth)
    public async addCommunityPost(
        userId: string,
        authorName: string,
        postData: { content: string; route?: string; petTypes?: string[] }
    ): Promise<CommunityPost> {
        const { data, error } = await supabase
            .from('community_posts')
            .insert({
                user_id: userId,
                author_name: authorName,
                content: postData.content,
                route: postData.route,
                pet_types: postData.petTypes,
                likes: 0,
                comment_count: 0
            })
            .select()
            .single();

        if (error) throw error;
        
        return {
            id: data.id,
            userId: data.user_id,
            authorName: data.author_name,
            content: data.content,
            route: data.route,
            petTypes: data.pet_types,
            likes: data.likes,
            commentCount: data.comment_count,
            createdAt: new Date(data.created_at),
            updatedAt: new Date(data.updated_at)
        };
    }

    // Like a post
    public async likePost(postId: string, userId: string): Promise<void> {
        // Insert like record
        const { error: likeError } = await supabase
            .from('post_likes')
            .insert({ post_id: postId, user_id: userId });

        if (likeError) {
            // Check if already liked (unique constraint violation)
            if (likeError.code === '23505') {
                throw new Error('Post already liked');
            }
            throw likeError;
        }

        // Increment like count
        const { error: updateError } = await supabase.rpc('increment_post_likes', {
            post_id: postId
        });

        if (updateError) throw updateError;
    }

    // Unlike a post
    public async unlikePost(postId: string, userId: string): Promise<void> {
        // Delete like record
        const { error: deleteError } = await supabase
            .from('post_likes')
            .delete()
            .match({ post_id: postId, user_id: userId });

        if (deleteError) throw deleteError;

        // Decrement like count
        const { error: updateError } = await supabase.rpc('decrement_post_likes', {
            post_id: postId
        });

        if (updateError) throw updateError;
    }

    // Delete post (owner only)
    public async removeCommunityPost(id: string, userId: string): Promise<void> {
        const { error } = await supabase
            .from('community_posts')
            .delete()
            .match({ id, user_id: userId });

        if (error) throw error;
    }

    // Get comments for a post
    public async fetchPostComments(postId: string): Promise<Comment[]> {
        const { data, error } = await supabase
            .from('post_comments')
            .select('*')
            .eq('post_id', postId)
            .order('created_at', { ascending: true });

        if (error) throw error;
        
        return (data || []).map(comment => ({
            id: comment.id,
            postId: comment.post_id,
            userId: comment.user_id,
            authorName: comment.author_name,
            content: comment.content,
            createdAt: new Date(comment.created_at),
            updatedAt: new Date(comment.updated_at)
        }));
    }

    // Add comment to a post
    public async addComment(
        postId: string,
        userId: string,
        authorName: string,
        content: string
    ): Promise<Comment> {
        // Insert comment
        const { data: comment, error: commentError } = await supabase
            .from('post_comments')
            .insert({
                post_id: postId,
                user_id: userId,
                author_name: authorName,
                content
            })
            .select()
            .single();

        if (commentError) throw commentError;

        // Increment comment count
        await supabase.rpc('increment_comment_count', { post_id: postId });

        // Get post owner to send notification
        const { data: post } = await supabase
            .from('community_posts')
            .select('user_id, author_name')
            .eq('id', postId)
            .single();

        // Create notification for post owner (if not commenting on own post)
        if (post && post.user_id !== userId) {
            await supabase
                .from('notifications')
                .insert({
                    user_id: post.user_id,
                    type: 'comment',
                    title: 'New Comment',
                    message: `${authorName} commented on your post`,
                    link: `/community?post=${postId}`,
                    read: false
                });
        }

        return {
            id: comment.id,
            postId: comment.post_id,
            userId: comment.user_id,
            authorName: comment.author_name,
            content: comment.content,
            createdAt: new Date(comment.created_at),
            updatedAt: new Date(comment.updated_at)
        };
    }

    // Delete comment
    public async removeComment(commentId: string, userId: string): Promise<void> {
        // Get comment to find post_id
        const { data: comment } = await supabase
            .from('post_comments')
            .select('post_id')
            .eq('id', commentId)
            .single();

        // Delete comment
        const { error } = await supabase
            .from('post_comments')
            .delete()
            .match({ id: commentId, user_id: userId });

        if (error) throw error;

        // Decrement comment count
        if (comment) {
            await supabase.rpc('decrement_comment_count', { post_id: comment.post_id });
        }
    }
}
