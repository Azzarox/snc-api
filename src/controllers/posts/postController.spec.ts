import { Context } from 'koa';
import { postService as service } from '../../services/posts/postService';
import { postController as controller } from './postController';
import { SuccessResponse } from '../../common/response/Response';
import { StatusCodes } from 'http-status-codes';
import { ValidatedContext } from '../../middlewares/validationMiddleware';
import { CreatePostPayload } from '../../schemas/posts/createPostSchema';
import { UpdatePostPayload } from '../../schemas/posts/updatePostSchema';
import { GenericParams } from '../../schemas/common/paramsSchema';
import { GetPostQuery } from '../../schemas/posts/getPostQuerySchema';

const userId = 1;
const postId = 1;

const post = {
	id: postId,
	userId: userId,
	title: 'test123',
	content: 'test123',
};

describe('postController', () => {
	afterEach(() => {
		jest.restoreAllMocks();
		jest.clearAllMocks();
	});

	describe('getAll', () => {
		it('should return proper response', async () => {
			const posts = [post];

			jest.spyOn(service, 'getAll').mockResolvedValue(posts as any);

			const ctx = {
				state: { user: { id: userId } },
			} as Context;

			await controller.getAll(ctx);

			expect(service.getAll).toHaveBeenCalledWith(userId);
			expect(ctx.status).toBe(StatusCodes.OK);
			expect(ctx.body).toBeInstanceOf(SuccessResponse);
			expect(ctx.body).toMatchObject({
				status: StatusCodes.OK,
				message: null,
				data: posts,
			});
		});
	});

	describe('getAllWithComments', () => {
		it('should return proper response', async () => {
			const posts = [post];

			jest.spyOn(service, 'getAllWithComments').mockResolvedValue(posts as any);

			const ctx = {
				state: { user: { id: userId } },
			} as Context;

			await controller.getAllWithComments(ctx);

			expect(service.getAllWithComments).toHaveBeenCalledWith(userId);
			expect(ctx.status).toBe(StatusCodes.OK);
			expect(ctx.body).toBeInstanceOf(SuccessResponse);
			expect(ctx.body).toMatchObject({
				status: StatusCodes.OK,
				message: null,
				data: posts,
			});
		});
	});

	describe('getById', () => {
		it('should return proper response', async () => {
			jest.spyOn(service, 'getById').mockResolvedValue(post as any);

			const ctx = {
				params: { id: postId },
				query: { includeComments: 'false' },
				state: { user: { id: userId } },
			} as ValidatedContext<never, GenericParams, GetPostQuery>;

			await controller.getById(ctx);

			expect(service.getById).toHaveBeenCalledWith(postId, false, userId);
			expect(ctx.status).toBe(StatusCodes.OK);
			expect(ctx.body).toBeInstanceOf(SuccessResponse);
			expect(ctx.body).toMatchObject({
				status: StatusCodes.OK,
				message: null,
				data: post,
			});
		});
	});

	describe('getAllUserPosts', () => {
		it('should return proper response', async () => {
			const posts = [post];

			jest.spyOn(service, 'getAllUserPosts').mockResolvedValue(posts as any);

			const ctx = {
				params: { id: userId },
				query: { includeComments: 'false' },
				state: { user: { id: userId } },
			} as ValidatedContext<never, GenericParams, GetPostQuery>;

			await controller.getAllUserPosts(ctx);

			expect(service.getAllUserPosts).toHaveBeenCalledWith(userId, false, userId);
			expect(ctx.status).toBe(StatusCodes.OK);
			expect(ctx.body).toBeInstanceOf(SuccessResponse);
			expect(ctx.body).toMatchObject({
				status: StatusCodes.OK,
				message: null,
				data: posts,
			});
		});
	});

	describe('createPost', () => {
		it('should return proper response', async () => {
			const payload: CreatePostPayload = {
				title: 'test123',
				content: 'test123',
			};

			jest.spyOn(service, 'createPost').mockResolvedValue(post as any);

			const ctx = {
				request: { body: payload },
				state: { user: { id: userId } },
			} as ValidatedContext<CreatePostPayload>;

			await controller.createPost(ctx);

			expect(service.createPost).toHaveBeenCalledWith(userId, payload);
			expect(ctx.status).toBe(StatusCodes.CREATED);
			expect(ctx.body).toBeInstanceOf(SuccessResponse);
			expect(ctx.body).toMatchObject({
				status: StatusCodes.CREATED,
				message: 'Successfully created post!',
				data: post,
			});
		});
	});

	describe('deletePost', () => {
		it('should return proper response', async () => {
			jest.spyOn(service, 'deletePost').mockResolvedValue(post as any);

			const ctx = {
				params: { id: postId },
				state: { user: { id: userId } },
			} as ValidatedContext<never, GenericParams>;

			await controller.deletePost(ctx);

			expect(service.deletePost).toHaveBeenCalledWith(userId, postId);
			expect(ctx.status).toBe(StatusCodes.OK);
			expect(ctx.body).toBeInstanceOf(SuccessResponse);
			expect(ctx.body).toMatchObject({
				status: StatusCodes.OK,
				message: 'Successfully deleted post!',
				data: post,
			});
		});
	});

	describe('updatePost', () => {
		it('should return proper response', async () => {
			const payload: UpdatePostPayload = {
				title: 'test123',
				content: 'test123',
			};

			const updatedPost = { ...post, ...payload };

			jest.spyOn(service, 'updatePost').mockResolvedValue(updatedPost as any);

			const ctx = {
				params: { id: postId },
				request: { body: payload },
				state: { user: { id: userId } },
			} as ValidatedContext<UpdatePostPayload, GenericParams>;

			await controller.updatePost(ctx);

			expect(service.updatePost).toHaveBeenCalledWith(userId, postId, payload);
			expect(ctx.status).toBe(StatusCodes.OK);
			expect(ctx.body).toBeInstanceOf(SuccessResponse);
			expect(ctx.body).toMatchObject({
				status: StatusCodes.OK,
				message: 'Successfully updated post!',
				data: updatedPost,
			});
		});
	});
});
