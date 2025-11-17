import { StatusCodes } from 'http-status-codes';
import { CustomHttpError } from '../../common/errors/CustomHttpError';
import { commentsRepository, postsRepository } from '../../repositories';
import { CreateCommentPayload, UpdateCommentPayload, updateCommentSchema } from '../../schemas/comments/createCommentSchema';

const createComment = async (userId: number, postId: number, payload: CreateCommentPayload) => {
	return await commentsRepository.create({ userId, postId, ...payload });
};

const updateComment = async (userId: number, postId: number, commentId: number, payload: UpdateCommentPayload) => {
	const post = await postsRepository.findOneBy({ id: postId });
	if (!post) {
		throw new CustomHttpError(StatusCodes.NOT_FOUND, 'Post not found!');
	}

	const comment = await commentsRepository.findOneBy({ postId, id: commentId });
	if (!comment) {
		throw new CustomHttpError(StatusCodes.NOT_FOUND, 'Comment not found!');
	}

	if (comment.userId !== userId) {
		throw new CustomHttpError(StatusCodes.BAD_REQUEST, 'Comment doesn\'t belong to this user!');
	}

	return await commentsRepository.update({ id: commentId, postId, userId }, payload);
};

export const commentService = {
	createComment,
	updateComment,
};
