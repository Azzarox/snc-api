import { Context } from 'koa';
import { authService } from '../../services/auth/authService';
import { LoginPayload, RegisterPayload } from '../../schemas/auth/registerSchema';
import { SuccessResponse } from '../../common/response/Response';
import { StatusCodes } from 'http-status-codes';
import { ValidatedContext } from '../../middlewares/validationMiddleware';

export const users: { username: string; password: string }[] = [];

const registerUser = async (ctx: ValidatedContext<RegisterPayload>) => {
	const { username, password } = ctx.request.body;

	const user = await authService.registerUser(username, password);
	const response = new SuccessResponse(StatusCodes.CREATED, 'Successfully created user!', user);
	ctx.status = response.status;
	ctx.body = response;
};

const loginUser = async (ctx: ValidatedContext<LoginPayload>) => {
	const { username, password } = ctx.request.body;
	const token = await authService.loginUser(username, password);
	const response = new SuccessResponse(StatusCodes.OK, null, token);
	ctx.status = response.status;
	ctx.body = response;
};

const getUsers = async (ctx: Context) => {
	const users = await authService.getUsers();
	ctx.body = new SuccessResponse(StatusCodes.OK, null, users);
}

const getCurrentUser = (ctx: Context) => {
	const response = new SuccessResponse(StatusCodes.OK, null, ctx.state.user); //TODO: add ctx.state.user type later
	ctx.body = response;
	ctx.status = response.status;
}

export const authController = {
	getUsers,
	registerUser,
	loginUser,
	getCurrentUser,
};
