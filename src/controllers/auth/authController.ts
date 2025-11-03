import { Context } from 'koa';
import { authService } from '../../services/auth/authService';
import {  RegisterPayload } from '../../schemas/auth/registerSchema';
import { SuccessResponse } from '../../common/response/Response';
import { StatusCodes } from 'http-status-codes';
import { ValidatedContext } from '../../middlewares/validationMiddleware';
import { LoginPayload } from '../../schemas/auth/loginSchema';

const registerUser = async (ctx: ValidatedContext<RegisterPayload>) => {
	const user = await authService.registerUser(ctx.request.body);
	const response = new SuccessResponse(StatusCodes.CREATED, 'Successfully created user!', user);
	ctx.status = response.status;
	ctx.body = response;
};

const loginUser = async (ctx: ValidatedContext<LoginPayload>) => {
	const token = await authService.loginUser(ctx.request.body);
	const response = new SuccessResponse(StatusCodes.OK, null, token);
	ctx.status = response.status;
	ctx.body = response;
};

const getUsers = async (ctx: Context) => {
	const users = await authService.getUsers();
	ctx.body = new SuccessResponse(StatusCodes.OK, null, users);
};

const getCurrentUser = (ctx: Context) => {
	const response = new SuccessResponse(StatusCodes.OK, null, ctx.state.user);
	ctx.body = response;
	ctx.status = response.status;
};

export const authController = {
	getUsers,
	registerUser,
	loginUser,
	getCurrentUser,
};
