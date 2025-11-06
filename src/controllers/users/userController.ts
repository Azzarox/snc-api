import { Context } from 'koa';
import { SuccessResponse } from '../../common/response/Response';
import { StatusCodes } from 'http-status-codes';
import { userService } from '../../services/userService';
import { ValidatedContext } from '../../middlewares/validationMiddleware';
import { UserProfilePayload } from '../../schemas/auth/userProfileSchema';

const getCurrentUserProfile = async (ctx: Context) => {
	const profile = await userService.getCurrentUserProfile(ctx.state.user.id);
	const response = new SuccessResponse(StatusCodes.OK, null, profile);
	ctx.status = response.status;
	ctx.body = response;
};

const updateCurrentUserProfile = async (ctx: ValidatedContext<UserProfilePayload>) => {
	const updatedProfile = await userService.updateUserProfile(ctx.state.user.id, ctx.request.body)
	const response = new SuccessResponse(StatusCodes.OK, 'Updated successfully!', updatedProfile)
	ctx.status = response.status;
	ctx.body = response;
}

const getAllUsers = async (ctx: Context) => {
	const users = await userService.getAllUsers();
	const response = new SuccessResponse(StatusCodes.OK, null, users);
	ctx.status = response.status;
	ctx.body = response;
}

export const userController = {
	getCurrentUserProfile,
	updateCurrentUserProfile,
	getAllUsers,
	
};
