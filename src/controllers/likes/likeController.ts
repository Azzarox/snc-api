import { StatusCodes } from 'http-status-codes';
import { SuccessResponse } from '../../common/response/Response';
import { ValidatedContext } from '../../middlewares/validationMiddleware';
import { GenericParams } from '../../schemas/common/paramsSchema';
import { LikeResponse, likeService } from '../../services/likes/likeService';

const toggleLike = async (ctx: ValidatedContext<never, GenericParams>) => {
	const like: LikeResponse = await likeService.toggleLike(ctx.state.user.id, ctx.params.id);
	const response = new SuccessResponse(StatusCodes.CREATED, 'Successfully liked post!', like);
	ctx.status = response.status;
	ctx.body = response;
};

const getPostLikes = async (ctx: ValidatedContext<never, GenericParams>) => {
	const likesCount = await likeService.getPostLikes(ctx.params.id);
	const response = new SuccessResponse(StatusCodes.OK, null, likesCount);
	ctx.status = response.status;
	ctx.body = response;
};

export const likeController = {
	toggleLike,
	getPostLikes,
};
