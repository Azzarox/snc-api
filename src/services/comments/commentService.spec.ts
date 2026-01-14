import { commentService as service } from './commentService';
import { commentsRepository as repository, postsRepository } from '../../repositories';
import { commentServiceHelpers as helpers } from './helpers';
import { CustomHttpError } from '../../common/errors/CustomHttpError';
import { StatusCodes } from 'http-status-codes';
import { CommentEntity } from '../../schemas/entities/commentEntitySchema';
import { PostEntity } from '../../schemas/entities/postEntitySchema';
import { CreateCommentPayload, UpdateCommentPayload } from '../../schemas/comments/createCommentSchema';

const userId = 1;
const postId = 1;
const commentId = 1;

const post = {
	id: postId,
} as PostEntity;

const comment = {
	id: commentId,
	userId: userId,
	postId: postId,
	content: 'test123',
} as CommentEntity;

describe('commentService', () => {
	afterEach(() => {
		jest.restoreAllMocks();
		jest.clearAllMocks();
	});

	describe('createComment', () => {
		const payload: CreateCommentPayload = {
			content: 'test123',
		};

		it('should successfully create comment for valid post', async () => {
			jest.spyOn(postsRepository, 'findOneBy').mockResolvedValue(post);
			jest.spyOn(repository, 'create').mockResolvedValue(comment);

			const result = await service.createComment(userId, postId, payload);

			expect(postsRepository.findOneBy).toHaveBeenCalledWith({ id: postId });
			expect(repository.create).toHaveBeenCalledWith({
				userId,
				postId,
				...payload,
			});
			expect(result).toEqual(comment);
		});

		it('should throw NOT_FOUND when post does not exist', async () => {
			jest.spyOn(postsRepository, 'findOneBy').mockResolvedValue(null);
			jest.spyOn(repository, 'create');

			try {
				await service.createComment(userId, postId, payload);
			} catch (err: any) {
				expect(err).toBeInstanceOf(CustomHttpError);
				expect(err.status).toBe(StatusCodes.NOT_FOUND);
				expect(err.message).toBe(`Post with ID:${postId} not found!`);
			}

			expect(postsRepository.findOneBy).toHaveBeenCalledWith({ id: postId });
			expect(repository.create).not.toHaveBeenCalled();
		});
	});

	describe('updateComment', () => {
		const payload: UpdateCommentPayload = {
			content: 'test123',
		};

		it('should successfully update comment', async () => {
			const updatedComment = {
				...comment,
				...payload,
			} as CommentEntity;

			jest.spyOn(helpers, 'validateBeforeCommentOperations').mockResolvedValue(undefined);
			jest.spyOn(repository, 'update').mockResolvedValue(updatedComment);

			const result = await service.updateComment(userId, postId, commentId, payload);

			expect(helpers.validateBeforeCommentOperations).toHaveBeenCalledWith(userId, postId, commentId);
			expect(repository.update).toHaveBeenCalledWith({ id: commentId, postId, userId }, payload);
			expect(result).toEqual(updatedComment);
		});

		it('should throw error when validation fails', async () => {
			const error = new CustomHttpError(StatusCodes.FORBIDDEN, "You don't have permission to modify this resource");

			jest.spyOn(helpers, 'validateBeforeCommentOperations').mockRejectedValue(error);
			jest.spyOn(repository, 'update');

			try {
				await service.updateComment(userId, postId, commentId, payload);
			} catch (err: any) {
				expect(err).toBeInstanceOf(CustomHttpError);
				expect(err.status).toBe(StatusCodes.FORBIDDEN);
			}

			expect(helpers.validateBeforeCommentOperations).toHaveBeenCalledWith(userId, postId, commentId);
			expect(repository.update).not.toHaveBeenCalled();
		});
	});

	describe('deleteComment', () => {
		it('should successfully delete comment', async () => {
			const deletedComment = comment;

			jest.spyOn(helpers, 'validateBeforeCommentOperations').mockResolvedValue(undefined);
			jest.spyOn(repository, 'delete').mockResolvedValue(deletedComment);

			const result = await service.deleteComment(userId, postId, commentId);

			expect(helpers.validateBeforeCommentOperations).toHaveBeenCalledWith(userId, postId, commentId);
			expect(repository.delete).toHaveBeenCalledWith({ id: commentId, postId, userId });
			expect(result).toEqual(deletedComment);
		});

		it('should throw error when validation fails', async () => {
			const error = new CustomHttpError(StatusCodes.NOT_FOUND, 'Comment not found!');

			jest.spyOn(helpers, 'validateBeforeCommentOperations').mockRejectedValue(error);
			jest.spyOn(repository, 'delete');

			try {
				await service.deleteComment(userId, postId, commentId);
			} catch (err: any) {
				expect(err).toBeInstanceOf(CustomHttpError);
				expect(err.status).toBe(StatusCodes.NOT_FOUND);
			}

			expect(helpers.validateBeforeCommentOperations).toHaveBeenCalledWith(userId, postId, commentId);
			expect(repository.delete).not.toHaveBeenCalled();
		});
	});
});
