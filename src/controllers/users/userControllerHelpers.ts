import { Context } from 'koa';
import { SuccessResponse } from '../../common/response/Response';
import { StatusCodes } from 'http-status-codes';
import { userService } from '../../services/userService';
import { ValidatedContext } from '../../middlewares/validationMiddleware';
import { ImageCropPayload } from '../../schemas/common/imageCropSchema';

export type ProfileImageType = 'avatar' | 'cover';

export const handleProfileImageUpload = async <T extends Context | ValidatedContext<ImageCropPayload>>(
	ctx: T,
	imageType: ProfileImageType,
	cropData?: ImageCropPayload
) => {
	const file = ctx.request.file;
	const imageData = await userService.uploadImage(ctx.state.user.id, file, imageType, cropData);
	const message = `${imageType.charAt(0).toUpperCase() + imageType.slice(1)} uploaded successfully`;
	const response = new SuccessResponse(StatusCodes.OK, message, imageData);
	ctx.status = response.status;
	ctx.body = response;
};

export const handleProfileImageRemove = async (ctx: Context, imageType: ProfileImageType) => {
	const imageData = await userService.removeImage(ctx.state.user.id, imageType);
	const message = `${imageType.charAt(0).toUpperCase() + imageType.slice(1)} removed successfully`;
	const response = new SuccessResponse(StatusCodes.OK, message, imageData);
	ctx.status = response.status;
	ctx.body = response;
};
