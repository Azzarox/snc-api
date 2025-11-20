import { postLikesRepository } from "../../repositories"
import { PostLikeEntity } from "../../schemas/entities/postLikeEntitySchema";

export type LikeResponse = {
    action: 'liked' | 'unliked'
} & Pick<PostLikeEntity, 'userId' | 'postId'>

const toggleLike = async (userId: number, postId: number): Promise<LikeResponse> => {
    const like = await postLikesRepository.findOneBy({ userId, postId });

    if (like) {
        const value = await postLikesRepository.delete({ userId, postId }, ['postId', 'userId']);
        return {
            action: 'unliked',
            ...value,
        }
    }

    const value = await postLikesRepository.create({ userId, postId }, ['postId', 'userId']);
    return { action: 'liked', ...value };
};


const getPostLikes = async (postId: number): Promise<{ likesCount: number }> => {
    const likesCount = (await postLikesRepository.find({ postId }));
    return {
        likesCount: likesCount.length,
    }

}
export const likeService = {
    toggleLike,
    getPostLikes
}