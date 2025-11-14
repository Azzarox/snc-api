import { Context } from 'koa';
import { SuccessResponse } from '../../common/response/Response';
import { StatusCodes } from 'http-status-codes';
import { userService } from '../../services/user/userService';

const getAllUsers = async (ctx: Context) => {
	const users = await userService.getAllUsers();
	const response = new SuccessResponse(StatusCodes.OK, null, users);
	ctx.status = response.status;
	ctx.body = response;
};

export const userController = {
	getAllUsers,
};
