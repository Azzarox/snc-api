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

const uploadAvatar = async (userId: number, file: multer.File) => {
	if (!file) {
		throw new CustomHttpError(StatusCodes.BAD_REQUEST, 'No uploaded file!');
	}

	const profile = await userProfilesRepository.getCurrentUserProfile(userId, 'avatarStorageKey');

	if (!profile) {
		throw new CustomHttpError(StatusCodes.NOT_FOUND, "User doesn't have profile!");
	}

	if (profile.avatarStorageKey) {
		await cloudinaryService.deleteImage(profile.avatarStorageKey);
	}

	const user = await usersRepository.findOneBy({ id: userId }, 'username');
	if (!user) {
		throw new CustomHttpError(StatusCodes.NOT_FOUND, 'User not found!');
	}

	const result = await cloudinaryService.uploadImage(file.buffer, `/user/${user.username}/avatar`);

	const updatedProfile = await userProfilesRepository.update(
		{ userId },
		{ avatarUrl: result.url, avatarStorageKey: result.publicId },
		'avatarUrl'
	);

	return updatedProfile;
};

const uploadCover = async (userId: number, file: multer.File, cropData?: ImageCropPayload) => {
	if (!file) {
		throw new CustomHttpError(StatusCodes.BAD_REQUEST, 'No uploaded file!');
	}

	const profile = await userProfilesRepository.getCurrentUserProfile(userId, 'coverStorageKey');

	if (!profile) {
		throw new CustomHttpError(StatusCodes.NOT_FOUND, "User doesn't have profile!");
	}

	if (profile.coverStorageKey) {
		await cloudinaryService.deleteImage(profile.coverStorageKey);
	}

	const user = await usersRepository.findOneBy({ id: userId }, 'username');
	if (!user) {
		throw new CustomHttpError(StatusCodes.NOT_FOUND, 'User not found!');
	}

	const cropParams =
		cropData?.cropX !== undefined
			? { x: cropData.cropX, y: cropData.cropY!, width: cropData.cropWidth!, height: cropData.cropHeight! }
			: undefined;

	const result = await cloudinaryService.uploadCoverImage(file.buffer, `/user/${user.username}/cover`, cropParams);

	const updatedProfile = await userProfilesRepository.update(
		{ userId },
		{ coverUrl: result.url, coverStorageKey: result.publicId },
		'coverUrl'
	);

	return updatedProfile;
};

const removeAvatar = async (userId: number) => {
	const profile = await userProfilesRepository.getCurrentUserProfile(userId, 'avatarStorageKey');

	if (!profile) {
		throw new CustomHttpError(StatusCodes.NOT_FOUND, "User doesn't have profile!");
	}

	if (profile.avatarStorageKey) {
		await cloudinaryService.deleteImage(profile.avatarStorageKey);
	}

	const defaultAvatarUrl = generateDefaultAvatarUrl(userId);

	const updatedProfile = await userProfilesRepository.update(
		{ userId },
		{ avatarUrl: defaultAvatarUrl, avatarStorageKey: null },
		['avatarUrl', 'avatarStorageKey']
	);

	return updatedProfile;
};

const removeCover = async (userId: number) => {
	const profile = await userProfilesRepository.getCurrentUserProfile(userId, 'coverStorageKey');

	if (!profile) {
		throw new CustomHttpError(StatusCodes.NOT_FOUND, "User doesn't have profile!");
	}

	if (profile.coverStorageKey) {
		await cloudinaryService.deleteImage(profile.coverStorageKey);
	}

	const defaultCoverUrl = generateDefaultCoverUrl(userId);

	const updatedProfile = await userProfilesRepository.update({ userId }, { coverUrl: defaultCoverUrl, coverStorageKey: null }, [
		'coverUrl',
		'coverStorageKey',
	]);

	return updatedProfile;
};

export const userService = {
	getAllUsers,
	getCurrentUserProfile,
	createUserProfile,
	updateUserProfile,
	uploadAvatar,
	removeAvatar,
	uploadCover,
	removeCover,
};
