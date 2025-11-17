import { Context } from 'koa';
import { postsRepository } from '../../repositories';
import { SuccessResponse } from '../../common/response/Response';
import { StatusCodes } from 'http-status-codes';

const getAll = async (ctx: Context) => {
	const data = await postsRepository.getAll();
	const response = new SuccessResponse(StatusCodes.OK, null, data);
	ctx.status = response.status;
	ctx.body = response;
};

export const postController = {
	getAll,
};
