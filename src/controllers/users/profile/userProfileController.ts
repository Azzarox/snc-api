import { Context } from 'koa';
import { SuccessResponse } from '../../../common/response/Response';
import { StatusCodes } from 'http-status-codes';
import { userProfileService } from '../../../services/user/profile/userProfileService';
import { ValidatedContext } from '../../../middlewares/validationMiddleware';
import { UpdateUserProfilePayload } from '../../../schemas/auth/userProfileSchema';
import { ImageCropPayload } from '../../../schemas/common/imageCropSchema';
import { handleProfileImageUpload, handleProfileImageRemove } from './helpers/profileImageActions';

const getCurrentUserProfile = async (ctx: Context) => {
	const profile = await userProfileService.getCurrentUserProfile(ctx.state.user.id);
	const response = new SuccessResponse(StatusCodes.OK, null, profile);
	ctx.status = response.status;
	ctx.body = response;
};

const updateCurrentUserProfile = async (ctx: ValidatedContext<UpdateUserProfilePayload>) => {
	const updatedProfile = await userProfileService.updateUserProfile(ctx.state.user.id, ctx.request.body);
	const response = new SuccessResponse(StatusCodes.OK, 'Updated successfully!', updatedProfile);
	ctx.status = response.status;
	ctx.body = response;
};

const uploadAvatar = async (ctx: Context) => {
	await handleProfileImageUpload(ctx, 'avatar');
};

const uploadCover = async (ctx: ValidatedContext<ImageCropPayload>) => {
	await handleProfileImageUpload(ctx, 'cover', ctx.request.body);
};

const removeAvatar = async (ctx: Context) => {
	await handleProfileImageRemove(ctx, 'avatar');
};

const removeCover = async (ctx: Context) => {
	await handleProfileImageRemove(ctx, 'cover');
};

export const userProfileController = {
	getCurrentUserProfile,
	updateCurrentUserProfile,
	uploadAvatar,
	removeAvatar,
	uploadCover,
	removeCover,
};
