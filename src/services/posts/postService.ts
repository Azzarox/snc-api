import { StatusCodes } from 'http-status-codes';
import { CustomHttpError } from '../../common/errors/CustomHttpError';
import { postsRepository, UserRepository } from '../../repositories';
import { CreatePostPayload } from '../../schemas/posts/createPostSchema';
import { UpdatePostPayload } from '../../schemas/posts/updatePostSchema';
import { postServiceHelpers } from './helpers';

const getAll = async () => {
	return await postsRepository.getAll();
};

const getAllWithComments = async () => {
	return await postsRepository.getAllWithComments();
};

const getById = async (id: number, includeComments = false) => {
	const post = await postsRepository.getById(id, includeComments);

	if (!post) throw new CustomHttpError(StatusCodes.NOT_FOUND, `Post with ID:${id} not found!`);

	return post;
};

const createPost = async (userId: number, payload: CreatePostPayload) => {
	return await postsRepository.create({ ...payload, userId });
};

const deletePost = async (userId: number, postId: number) => {
	await postServiceHelpers.validateBeforePostOperations(userId, postId);
	return await postsRepository.delete(postId);
};

const updatePost = async (userId: number, postId: number, payload: UpdatePostPayload) => {
	await postServiceHelpers.validateBeforePostOperations(userId, postId);
	return await postsRepository.update(postId, payload);
};

export const postService = {
	getAll,
	getAllWithComments,
	getById,
	createPost,
	deletePost,
	updatePost,
};
