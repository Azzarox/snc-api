import { likeService as service } from '../../services/likes/likeService';
import { likeController as controller } from './likeController';
import { SuccessResponse } from '../../common/response/Response';
import { StatusCodes } from 'http-status-codes';
import { ValidatedContext } from '../../middlewares/validationMiddleware';
import { GenericParams } from '../../schemas/common/paramsSchema';

const userId = 1;
const postId = 1;

describe('likeController', () => {
	afterEach(() => {
		jest.restoreAllMocks();
		jest.clearAllMocks();
	});

	describe('toggleLike', () => {
		it('should return proper response', async () => {
			const likeResponse = {
				action: 'liked' as const,
				userId: userId,
				postId: postId,
			};

			jest.spyOn(service, 'toggleLike').mockResolvedValue(likeResponse);

			const ctx = {
				params: { id: postId },
				state: { user: { id: userId } },
			} as ValidatedContext<never, GenericParams>;

			await controller.toggleLike(ctx);

			expect(service.toggleLike).toHaveBeenCalledWith(userId, postId);
			expect(ctx.status).toBe(StatusCodes.CREATED);
			expect(ctx.body).toBeInstanceOf(SuccessResponse);
			expect(ctx.body).toMatchObject({
				status: StatusCodes.CREATED,
				message: 'Successfully liked post!',
				data: likeResponse,
			});
		});
	});

	describe('getPostLikes', () => {
		it('should return proper response', async () => {
			const likesCount = { likesCount: 5 };

			jest.spyOn(service, 'getPostLikes').mockResolvedValue(likesCount);

			const ctx = {
				params: { id: postId },
			} as ValidatedContext<never, GenericParams>;

			await controller.getPostLikes(ctx);

			expect(service.getPostLikes).toHaveBeenCalledWith(postId);
			expect(ctx.status).toBe(StatusCodes.OK);
			expect(ctx.body).toBeInstanceOf(SuccessResponse);
			expect(ctx.body).toMatchObject({
				status: StatusCodes.OK,
				message: null,
				data: likesCount,
			});
		});
	});
});
