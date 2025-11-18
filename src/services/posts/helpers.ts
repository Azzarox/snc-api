import { StatusCodes } from 'http-status-codes';
import { CustomHttpError } from '../../common/errors/CustomHttpError';
import { postsRepository } from '../../repositories';

const validateBeforePostOperations = async (userId: number, postId: number) => {
	const post = await postsRepository.findOneBy({ id: postId }); 
	if (!post) {
		throw new CustomHttpError(StatusCodes.NOT_FOUND, 'Post not found!');
	}

	if (post.userId !== userId) {
		throw new CustomHttpError(StatusCodes.FORBIDDEN, "You don't have permission to modify this post");
	}
};

export const postServiceHelpers = {
	validateBeforePostOperations,
};
