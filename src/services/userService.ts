import { Knex } from 'knex';
import { userProfilesRepository, usersRepository } from '../repositories';
import { CreateEntity } from '../repositories/KnexRepository';
import { UpdateUserProfilePayload, UserProfilePayload } from '../schemas/auth/userProfileSchema';
import { UserProfileEntity } from '../schemas/entities/userProfileEntitySchema';
import { ImageCropPayload } from '../schemas/common/imageCropSchema';
import { cloudinaryService } from './cloudinary/cloudinaryService';
import multer from '@koa/multer';
import { CustomHttpError } from '../common/errors/CustomHttpError';
import { StatusCodes } from 'http-status-codes';
import { generateDefaultAvatarUrl } from '../utils/generateAvatarImage';
import { generateDefaultCoverUrl } from '../utils/generateCoverImage';

type ProfileImageType = 'avatar' | 'cover';

const getAllUsers = async () => {
	return await usersRepository.getAll(['id', 'username', 'createdAt', 'updatedAt']);
};

const getCurrentUserProfile = async (id: number) => {
	return await userProfilesRepository.getCurrentUserProfile(id);
};

const createUserProfile = async (
	userId: number,
	payload: UserProfilePayload,
	trx?: Knex.Transaction
): Promise<UserProfileEntity> => {
	const defaultAvatarUrl = generateDefaultAvatarUrl(userId);

	const entity: CreateEntity<UserProfileEntity> = {
		userId,
		...payload,
		avatarUrl: defaultAvatarUrl,
		avatarStorageKey: null,
	};

	return await userProfilesRepository.create(entity, '*', trx);
};

const updateUserProfile = async (userId: number, payload: UpdateUserProfilePayload) => {
	return await userProfilesRepository.update({ userId: userId }, payload);
};

const uploadImage = async (userId: number, file: multer.File, imageType: ProfileImageType, cropData?: ImageCropPayload) => {
	if (!file) {
		throw new CustomHttpError(StatusCodes.BAD_REQUEST, 'No uploaded file!');
	}

	const storageKeyField = imageType === 'avatar' ? 'avatarStorageKey' : 'coverStorageKey';
	const urlField = imageType === 'avatar' ? 'avatarUrl' : 'coverUrl';
	const folderPath = imageType === 'avatar' ? 'avatar' : 'cover';

	const profile = await userProfilesRepository.getCurrentUserProfile(userId, storageKeyField);

	if (!profile) {
		throw new CustomHttpError(StatusCodes.NOT_FOUND, "User doesn't have profile!");
	}

	if (profile[storageKeyField]) {
		await cloudinaryService.deleteImage(profile[storageKeyField]);
	}

	const user = await usersRepository.findOneBy({ id: userId }, 'username');
	if (!user) {
		throw new CustomHttpError(StatusCodes.NOT_FOUND, 'User not found!');
	}

	const result =
		imageType === 'avatar'
			? await cloudinaryService.uploadImage(file.buffer, `/user/${user.username}/${folderPath}`)
			: await cloudinaryService.uploadCoverImage(file.buffer, `/user/${user.username}/${folderPath}`, cropData?.croppedAreaPixels);

	const updatedProfile = await userProfilesRepository.update(
		{ userId },
		{ [urlField]: result.url, [storageKeyField]: result.publicId },
		urlField
	);

	return updatedProfile;
};

const removeImage = async (userId: number, imageType: ProfileImageType) => {
	const storageKeyField = imageType === 'avatar' ? 'avatarStorageKey' : 'coverStorageKey';
	const urlField = imageType === 'avatar' ? 'avatarUrl' : 'coverUrl';

	const profile = await userProfilesRepository.getCurrentUserProfile(userId, storageKeyField);

	if (!profile) {
		throw new CustomHttpError(StatusCodes.NOT_FOUND, "User doesn't have profile!");
	}

	if (profile[storageKeyField]) {
		await cloudinaryService.deleteImage(profile[storageKeyField]);
	}

	const defaultUrl = imageType === 'avatar' ? generateDefaultAvatarUrl(userId) : generateDefaultCoverUrl(userId);

	const updatedProfile = await userProfilesRepository.update(
		{ userId },
		{ [urlField]: defaultUrl, [storageKeyField]: null },
		[urlField]
	);

	return updatedProfile;
};

export const userService = {
	getAllUsers,
	getCurrentUserProfile,
	createUserProfile,
	updateUserProfile,
	uploadImage,
	removeImage,
};
