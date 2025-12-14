import { Context } from 'koa';
import { commentService as service } from '../../services/comments/commentService';
import { commentController as controller } from './commentController';
import { SuccessResponse } from '../../common/response/Response';
import { StatusCodes } from 'http-status-codes';
import { ValidatedContext } from '../../middlewares/validationMiddleware';
import { CreateCommentPayload, UpdateCommentPayload } from '../../schemas/comments/createCommentSchema';
import { CommentParams } from '../../schemas/comments/commentParamSchema';
import { GenericParams } from '../../schemas/common/paramsSchema';
import { commentsRepository as repository } from '../../repositories';

const userId = 1;
const postId = 1;
const commentId = 1;

const comment = {
	id: commentId,
	userId: userId,
	postId: postId,
	content: 'test123',
};

describe('commentController', () => {
	afterEach(() => {
		jest.restoreAllMocks();
		jest.clearAllMocks();
	});

	describe('createComment', () => {
		it('should return proper response', async () => {
			const payload: CreateCommentPayload = {
				content: 'test123',
			};

			jest.spyOn(service, 'createComment').mockResolvedValue(comment as any);

			const ctx = {
				params: { id: postId },
				request: { body: payload },
				state: { user: { id: userId } },
			} as ValidatedContext<CreateCommentPayload, GenericParams>;

			await controller.createComment(ctx);

			expect(service.createComment).toHaveBeenCalledWith(userId, postId, payload);
			expect(ctx.status).toBe(StatusCodes.CREATED);
			expect(ctx.body).toBeInstanceOf(SuccessResponse);
			expect(ctx.body).toMatchObject({
				status: StatusCodes.CREATED,
				message: 'Successfully added comment!',
				data: comment,
			});
		});
	});

	describe('updateComment', () => {
		it('should return proper response', async () => {
			const payload: UpdateCommentPayload = {
				content: 'test123',
			};

			const updatedComment = { ...comment, ...payload };

			jest.spyOn(service, 'updateComment').mockResolvedValue(updatedComment as any);

			const ctx = {
				params: { id: postId, commentId: commentId },
				request: { body: payload },
				state: { user: { id: userId } },
			} as ValidatedContext<UpdateCommentPayload, CommentParams>;

			await controller.updateComment(ctx);

			expect(service.updateComment).toHaveBeenCalledWith(userId, postId, commentId, payload);
			expect(ctx.status).toBe(StatusCodes.CREATED);
			expect(ctx.body).toBeInstanceOf(SuccessResponse);
			expect(ctx.body).toMatchObject({
				status: StatusCodes.CREATED,
				message: 'Successfully updated comment!',
				data: updatedComment,
			});
		});
	});

	describe('deleteComment', () => {
		it('should return proper response', async () => {
			jest.spyOn(service, 'deleteComment').mockResolvedValue(comment as any);

			const ctx = {
				params: { id: postId, commentId: commentId },
				state: { user: { id: userId } },
			} as ValidatedContext<never, CommentParams>;

			await controller.deleteComment(ctx);

			expect(service.deleteComment).toHaveBeenCalledWith(userId, postId, commentId);
			expect(ctx.status).toBe(StatusCodes.CREATED);
			expect(ctx.body).toBeInstanceOf(SuccessResponse);
			expect(ctx.body).toMatchObject({
				status: StatusCodes.CREATED,
				message: 'Successfully deleted comment!',
				data: comment,
			});
		});
	});

	describe('getAllComments', () => {
		it('should return proper response', async () => {
			const comments = [comment];

			jest.spyOn(repository, 'getAll').mockResolvedValue(comments as any);

			const ctx = {} as Context;

			await controller.getAllComments(ctx);

			expect(repository.getAll).toHaveBeenCalled();
			expect(ctx.status).toBe(StatusCodes.OK);
			expect(ctx.body).toBeInstanceOf(SuccessResponse);
			expect(ctx.body).toMatchObject({
				status: StatusCodes.OK,
				message: null,
				data: comments,
			});
		});
	});

	describe('getAllPostComments', () => {
		it('should return proper response', async () => {
			const comments = [comment];

			jest.spyOn(repository, 'getPostComments').mockResolvedValue(comments as any);

			const ctx = {
				params: { id: postId },
			} as ValidatedContext<never, GenericParams>;

			await controller.getAllPostComments(ctx);

			expect(repository.getPostComments).toHaveBeenCalledWith(postId);
			expect(ctx.status).toBe(StatusCodes.OK);
			expect(ctx.body).toBeInstanceOf(SuccessResponse);
			expect(ctx.body).toMatchObject({
				status: StatusCodes.OK,
				message: null,
				data: comments,
			});
		});
	});
});
