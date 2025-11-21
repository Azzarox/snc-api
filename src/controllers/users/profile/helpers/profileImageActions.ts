import { Context } from 'koa';
import { SuccessResponse } from '../../../../common/response/Response';
import { StatusCodes } from 'http-status-codes';
import { userProfileService, ProfileImageType } from '../../../../services/user/profile/userProfileService';
import { ValidatedContext } from '../../../../middlewares/validationMiddleware';
import { ImageCropPayload } from '../../../../schemas/common/imageCropSchema';

export const handleProfileImageUpload = async <T extends Context | ValidatedContext<ImageCropPayload>>(
	ctx: T,
	imageType: ProfileImageType,
	cropData?: ImageCropPayload
) => {
	const file = ctx.request.file;
	const imageData = await userProfileService.uploadImage(ctx.state.user.id, file, imageType, cropData);
	const message = `${imageType.charAt(0).toUpperCase() + imageType.slice(1)} uploaded successfully`;
	const response = new SuccessResponse(StatusCodes.OK, message, imageData);
	ctx.status = response.status;
	ctx.body = response;
};

export const handleProfileImageRemove = async (ctx: Context, imageType: ProfileImageType) => {
	const imageData = await userProfileService.removeImage(ctx.state.user.id, imageType);
	const message = `${imageType.charAt(0).toUpperCase() + imageType.slice(1)} removed successfully`;
	const response = new SuccessResponse(StatusCodes.OK, message, imageData);
	ctx.status = response.status;
	ctx.body = response;
};
