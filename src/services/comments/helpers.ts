import { StatusCodes } from 'http-status-codes';
import { CustomHttpError } from '../../common/errors/CustomHttpError';
import { commentsRepository, postsRepository } from '../../repositories';

const validateBeforeCommentOperations = async (userId: number, postId: number, commentId: number): Promise<void | never> => {
	const post = await postsRepository.findOneBy({ id: postId });
	if (!post) {
		throw new CustomHttpError(StatusCodes.NOT_FOUND, `Post with ID:${postId} not found!`);
	}

	const comment = await commentsRepository.findOneBy({ postId, id: commentId });
	if (!comment) {
		throw new CustomHttpError(StatusCodes.NOT_FOUND, 'Comment not found!');
	}

	if (comment.userId !== userId) {
		throw new CustomHttpError(StatusCodes.FORBIDDEN, "You don't have permission to modify this comment");
	}
};

export const commentServiceHelpers = {
	validateBeforeCommentOperations,
};
