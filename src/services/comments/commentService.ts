import { StatusCodes } from 'http-status-codes';
import { CustomHttpError } from '../../common/errors/CustomHttpError';
import { commentsRepository, postsRepository } from '../../repositories';
import { CreateCommentPayload, UpdateCommentPayload } from '../../schemas/comments/createCommentSchema';
import { commentServiceHelpers } from './helpers';

const createComment = async (userId: number, postId: number, payload: CreateCommentPayload) => {
	const post = await postsRepository.findOneBy({ id: postId });
	if (!post) throw new CustomHttpError(StatusCodes.NOT_FOUND, 'Post not found!');

	return await commentsRepository.create({ userId, postId, ...payload });
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
	createComment,
	updateComment,
	deleteComment,
};
