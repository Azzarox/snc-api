import { Context } from 'koa';
import { userProfileService as service } from '../../../services/user/profile/userProfileService';
import { userProfileController as controller } from './userProfileController';
import { SuccessResponse } from '../../../common/response/Response';
import { StatusCodes } from 'http-status-codes';
import { ValidatedContext } from '../../../middlewares/validationMiddleware';
import { UpdateUserProfilePayload } from '../../../schemas/auth/userProfileSchema';
import { GenericParams } from '../../../schemas/common/paramsSchema';
import * as profileImageActions from './helpers/profileImageActions';

const userId = 1;

const profile = {
	id: 1,
	userId: userId,
	firstName: 'Test',
	lastName: 'Testing',
};

describe('userProfileController', () => {
	afterEach(() => {
		jest.restoreAllMocks();
		jest.clearAllMocks();
	});

	describe('getCurrentUserProfile', () => {
		it('should return proper response', async () => {
			jest.spyOn(service, 'getUserProfile').mockResolvedValue(profile as any);

			const ctx = {
				state: { user: { id: userId } },
			} as Context;

			await controller.getCurrentUserProfile(ctx);

			expect(service.getUserProfile).toHaveBeenCalledWith(userId);
			expect(ctx.status).toBe(StatusCodes.OK);
			expect(ctx.body).toBeInstanceOf(SuccessResponse);
			expect(ctx.body).toMatchObject({
				status: StatusCodes.OK,
				message: null,
				data: profile,
			});
		});
	});

	describe('getProfileByUserId', () => {
		it('should return proper response', async () => {
			jest.spyOn(service, 'getUserProfile').mockResolvedValue(profile as any);

			const ctx = {
				params: { id: userId },
			} as ValidatedContext<never, GenericParams>;

			await controller.getProfileByUserId(ctx);

			expect(service.getUserProfile).toHaveBeenCalledWith(userId);
			expect(ctx.status).toBe(StatusCodes.OK);
			expect(ctx.body).toBeInstanceOf(SuccessResponse);
			expect(ctx.body).toMatchObject({
				status: StatusCodes.OK,
				message: null,
				data: profile,
			});
		});
	});

	describe('updateCurrentUserProfile', () => {
		it('should return proper response', async () => {
			const payload: UpdateUserProfilePayload = {
				firstName: 'Test',
				lastName: 'Testing',
			};

			const updatedProfile = { ...profile, ...payload };

			jest.spyOn(service, 'updateUserProfile').mockResolvedValue(updatedProfile as any);

			const ctx = {
				request: { body: payload },
				state: { user: { id: userId } },
			} as ValidatedContext<UpdateUserProfilePayload>;

			await controller.updateCurrentUserProfile(ctx);

			expect(service.updateUserProfile).toHaveBeenCalledWith(userId, payload);
			expect(ctx.status).toBe(StatusCodes.OK);
			expect(ctx.body).toBeInstanceOf(SuccessResponse);
			expect(ctx.body).toMatchObject({
				status: StatusCodes.OK,
				message: 'Updated successfully!',
				data: updatedProfile,
			});
		});
	});

	describe('uploadAvatar', () => {
		it('should call handleProfileImageUpload with avatar type', async () => {
			const ctx = {} as Context;

			jest.spyOn(profileImageActions, 'handleProfileImageUpload').mockResolvedValue(undefined);

			await controller.uploadAvatar(ctx);

			expect(profileImageActions.handleProfileImageUpload).toHaveBeenCalledWith(ctx, 'avatar');
		});
	});

	describe('uploadCover', () => {
		it('should call handleProfileImageUpload with cover type and crop data', async () => {
			const cropData = {
				croppedAreaPixels: { x: 0, y: 0, width: 100, height: 100 },
			};

			const ctx = {
				request: { body: cropData },
			} as any;

			jest.spyOn(profileImageActions, 'handleProfileImageUpload').mockResolvedValue(undefined);

			await controller.uploadCover(ctx);

			expect(profileImageActions.handleProfileImageUpload).toHaveBeenCalledWith(ctx, 'cover', cropData);
		});
	});

	describe('removeAvatar', () => {
		it('should call handleProfileImageRemove with avatar type', async () => {
			const ctx = {} as Context;

			jest.spyOn(profileImageActions, 'handleProfileImageRemove').mockResolvedValue(undefined);

			await controller.removeAvatar(ctx);

			expect(profileImageActions.handleProfileImageRemove).toHaveBeenCalledWith(ctx, 'avatar');
		});
	});

	describe('removeCover', () => {
		it('should call handleProfileImageRemove with cover type', async () => {
			const ctx = {} as Context;

			jest.spyOn(profileImageActions, 'handleProfileImageRemove').mockResolvedValue(undefined);

			await controller.removeCover(ctx);

			expect(profileImageActions.handleProfileImageRemove).toHaveBeenCalledWith(ctx, 'cover');
		});
	});
});
