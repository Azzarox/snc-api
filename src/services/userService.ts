import { Knex } from 'knex';
import { userProfilesRepository, usersRepository } from '../repositories';
import { CreateEntity } from '../repositories/KnexRepository';
import { UpdateUserProfilePayload, UserProfilePayload } from '../schemas/auth/userProfileSchema';
import { UserProfileEntity } from '../schemas/entities/userProfileEntitySchema';
import { cloudinaryService } from './cloudinary/cloudinaryService';
import multer from '@koa/multer';
import { CustomHttpError } from '../common/errors/CustomHttpError';
import { StatusCodes } from 'http-status-codes';
import { generateDefaultAvatarUrl } from '../utils/generateAvatarImage';

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

export const userService = {
	getAllUsers,
	getCurrentUserProfile,
	createUserProfile,
	updateUserProfile,
	uploadAvatar,
	removeAvatar,
};
