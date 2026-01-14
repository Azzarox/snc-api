import { StatusCodes } from 'http-status-codes';
import { CustomHttpError } from '../../common/errors/CustomHttpError';
import { commentsRepository, postsRepository } from '../../repositories';
import { CreateCommentPayload, UpdateCommentPayload } from '../../schemas/comments/createCommentSchema';
import { commentServiceHelpers } from './helpers';

const createComment = async (userId: number, postId: number, payload: CreateCommentPayload) => {
	const post = await postsRepository.findOneBy({ id: postId });
	if (!post) throw new CustomHttpError(StatusCodes.NOT_FOUND, `Post with ID:${postId} not found!`);

	return await commentsRepository.create({ userId, postId, ...payload });
};

const getAllPostComments = async (postId: number) => {
	const post = await postsRepository.findOneBy({ id: postId });
	if (!post) throw new CustomHttpError(StatusCodes.NOT_FOUND, `Post with ID:${postId} not found!`);

	return await commentsRepository.getPostComments(postId);
};

const updateComment = async (userId: number, postId: number, commentId: number, payload: UpdateCommentPayload) => {
	await commentServiceHelpers.validateBeforeCommentOperations(userId, postId, commentId);
	return await commentsRepository.update({ id: commentId, postId, userId }, payload);
};

const deleteComment = async (userId: number, postId: number, commentId: number) => {
	await commentServiceHelpers.validateBeforeCommentOperations(userId, postId, commentId);
	return await commentsRepository.delete({ id: commentId, postId, userId });
};

export const commentService = {
	getAllPostComments,
	createComment,
	updateComment,
	deleteComment,
};
