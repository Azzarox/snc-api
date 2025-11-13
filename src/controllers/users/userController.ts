import { Context } from 'koa';
import { SuccessResponse } from '../../common/response/Response';
import { StatusCodes } from 'http-status-codes';
import { userService } from '../../services/userService';
import { ValidatedContext } from '../../middlewares/validationMiddleware';
import { UpdateUserProfilePayload } from '../../schemas/auth/userProfileSchema';
import { ImageCropPayload } from '../../schemas/common/imageCropSchema';
import { usersRepository } from '../../repositories';

const getCurrentUserProfile = async (ctx: Context) => {
	const profile = await userService.getCurrentUserProfile(ctx.state.user.id);
	const response = new SuccessResponse(StatusCodes.OK, null, profile);
	ctx.status = response.status;
	ctx.body = response;
};

const updateCurrentUserProfile = async (ctx: ValidatedContext<UpdateUserProfilePayload>) => {
	const updatedProfile = await userService.updateUserProfile(ctx.state.user.id, ctx.request.body);
	const response = new SuccessResponse(StatusCodes.OK, 'Updated successfully!', updatedProfile);
	ctx.status = response.status;
	ctx.body = response;
};

const getAllUsers = async (ctx: Context) => {
	const users = await userService.getAllUsers();
	const response = new SuccessResponse(StatusCodes.OK, null, users);
	ctx.status = response.status;
	ctx.body = response;
};

const uploadAvatar = async (ctx: Context) => {
	const file = ctx.request.file;
	const avatarUrlData = await userService.uploadAvatar(ctx.state.user.id, file);
	const response = new SuccessResponse(StatusCodes.OK, 'Avatar uploaded successfully', avatarUrlData);
	ctx.status = response.status;
	ctx.body = response;
};

const removeAvatar = async (ctx: Context) => {
	const avatarUrlData = await userService.removeAvatar(ctx.state.user.id);
	const response = new SuccessResponse(StatusCodes.OK, 'Avatar removed successfully', avatarUrlData);
	ctx.status = response.status;
	ctx.body = response;
};

const uploadCover = async (ctx: ValidatedContext<ImageCropPayload>) => {
	const file = ctx.request.file;
	const cropData = ctx.request.body;
	const coverUrlData = await userService.uploadCover(ctx.state.user.id, file, cropData);
	const response = new SuccessResponse(StatusCodes.OK, 'Cover uploaded successfully', coverUrlData);
	ctx.status = response.status;
	ctx.body = response;
};


const removeCover = async (ctx: Context) => {
	const coverUrlData = await userService.removeCover(ctx.state.user.id);
	const response = new SuccessResponse(StatusCodes.OK, 'Cover removed successfully', coverUrlData);
	ctx.status = response.status;
	ctx.body = response;
};


export const userController = {
	getCurrentUserProfile,
	updateCurrentUserProfile,
	getAllUsers,
	uploadAvatar,
	removeAvatar,
	uploadCover,
	removeCover,
};
