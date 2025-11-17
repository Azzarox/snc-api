import { StatusCodes } from 'http-status-codes';
import { CustomHttpError } from '../../common/errors/CustomHttpError';
import { postsRepository } from '../../repositories';
import { CreatePostPayload } from '../../schemas/posts/createPostSchema';
import { UpdatePostPayload } from '../../schemas/posts/updatePostSchema';

const getAll = async () => {
	return await postsRepository.getAll();
};

const getById = async (id: number) => {
	const post = await postsRepository.getById(id);

	if (!post) throw new CustomHttpError(StatusCodes.NOT_FOUND, `Post with ID:${id} not found!`);

	return post;
};

const createPost = async (userId: number, payload: CreatePostPayload) => {
	return await postsRepository.create({ ...payload, userId });
};

const deletePost = async (userId: number, postId: number) => {
	const post = await postsRepository.findOneBy({ id: postId }); // NOTE: maybe avoid if check if fetch by postId and userId ?
	if (!post) {
		throw new CustomHttpError(StatusCodes.NOT_FOUND, 'Post not found!');
	}

	if (post.userId !== userId) {
		throw new CustomHttpError(StatusCodes.BAD_REQUEST, "You cannot delete post which doesn't belong to you!");
	}

	return await postsRepository.delete(postId);
};

const updatePost = async (userId: number, postId: number, payload: UpdatePostPayload) => {
	const post = await postsRepository.findOneBy({ id: postId }); // NOTE: maybe avoid if check if fetch by postId and userId ?
	if (!post) {
		throw new CustomHttpError(StatusCodes.NOT_FOUND, 'Post not found!');
	}

	if (post.userId !== userId) {
		throw new CustomHttpError(StatusCodes.BAD_REQUEST, "You cannot update post which doesn't belong to you!");
	}

	return await postsRepository.update(postId, payload);
};

export const postService = {
	getAll,
	getById,
	createPost,
	deletePost,
	updatePost,
};
