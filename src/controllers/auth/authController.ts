import { Context } from 'koa';
import { authService } from '../../services/auth/authService';
import { RegisterPayload } from '../../schemas/auth/registerSchema';
import { SuccessResponse } from '../../common/response/Response';
import { StatusCodes } from 'http-status-codes';

const registerUser = (ctx: Context) => {
	const { username, password } = ctx.request.body as RegisterPayload;
	const user = authService.registerUser(username, password);

	const response = new SuccessResponse(
		StatusCodes.CREATED,
		'Successfully created user!',
		user
	);
	ctx.status = response.status;
	ctx.body = response;
};

export const authController = {
	registerUser,
};
