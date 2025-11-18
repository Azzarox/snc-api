import { Knex } from 'knex';
import { userProfilesRepository, usersRepository } from '../../../repositories';
import { CreateEntity } from '../../../repositories/KnexRepository';
import { UpdateUserProfilePayload, UserProfilePayload } from '../../../schemas/auth/userProfileSchema';
import { UserProfileEntity } from '../../../schemas/entities/userProfileEntitySchema';
import { ImageCropPayload } from '../../../schemas/common/imageCropSchema';
import { cloudinaryService } from '../../cloudinary/cloudinaryService';
import multer from '@koa/multer';
import { CustomHttpError } from '../../../common/errors/CustomHttpError';
import { StatusCodes } from 'http-status-codes';
import { generateDefaultAvatarUrl } from '../../../utils/generateAvatarImage';
import { generateDefaultCoverUrl } from '../../../utils/generateCoverImage';

export type ProfileImageType = 'avatar' | 'cover';

const PROFILE_IMAGE_FIELDS = {
	avatar: { storageKey: 'avatarStorageKey', url: 'avatarUrl', folder: 'avatar' },
	cover: { storageKey: 'coverStorageKey', url: 'coverUrl', folder: 'cover' },
} as const satisfies Record<
	ProfileImageType,
	{
		storageKey: keyof UserProfileEntity;
		url: keyof UserProfileEntity;
		folder: string;
	}
>;

const getCurrentUserProfile = async (id: number) => {
	return await userProfilesRepository.getCurrentUserProfile(id);
};

const createUserProfile = async (
	userId: number,
	payload: UserProfilePayload,
	trx?: Knex.Transaction
): Promise<UserProfileEntity> => {
	const defaultAvatarUrl = generateDefaultAvatarUrl(userId);
	const defaultCoverUrl = generateDefaultCoverUrl(userId);

	const entity: CreateEntity<UserProfileEntity> = {
		userId,
		...payload,
		avatarUrl: defaultAvatarUrl,
		avatarStorageKey: null,
		coverUrl: defaultCoverUrl,
		coverStorageKey: null
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

	const { storageKey, url, folder } = PROFILE_IMAGE_FIELDS[imageType];

	const [user, profile] = await Promise.all([
		usersRepository.findOneBy({ id: userId }, 'username'),
		userProfilesRepository.getCurrentUserProfile(userId, storageKey),
	]);

	if (!user) {
		throw new CustomHttpError(StatusCodes.NOT_FOUND, 'User not found!');
	}

	if (!profile) {
		throw new CustomHttpError(StatusCodes.NOT_FOUND, "User doesn't have profile!");
	}

	if (profile[storageKey]) {
		await cloudinaryService.deleteImage(profile[storageKey]);
	}

	const result =
		imageType === 'avatar'
			? await cloudinaryService.uploadImage(file.buffer, `/user/${user.username}/${folder}`)
			: await cloudinaryService.uploadCoverImage(
					file.buffer,
					`/user/${user.username}/${folder}`,
					cropData?.croppedAreaPixels
				);

	const updatedProfile = await userProfilesRepository.update(
		{ userId },
		{ [url]: result.url, [storageKey]: result.publicId },
		url
	);

	return updatedProfile;
};

const removeImage = async (userId: number, imageType: ProfileImageType) => {
	const { storageKey, url } = PROFILE_IMAGE_FIELDS[imageType];

	const [user, profile] = await Promise.all([
		usersRepository.findOneBy({ id: userId }, 'id'),
		userProfilesRepository.getCurrentUserProfile(userId, storageKey),
	]);

	if (!user) {
		throw new CustomHttpError(StatusCodes.NOT_FOUND, 'User not found!');
	}

	if (!profile) {
		throw new CustomHttpError(StatusCodes.NOT_FOUND, "User doesn't have profile!");
	}

	if (profile[storageKey]) {
		await cloudinaryService.deleteImage(profile[storageKey]);
	}

	const defaultUrl = imageType === 'avatar' ? generateDefaultAvatarUrl(userId) : generateDefaultCoverUrl(userId);

	const updatedProfile = await userProfilesRepository.update({ userId }, { [url]: defaultUrl, [storageKey]: null }, [url]);

	return updatedProfile;
};

export const userProfileService = {
	getCurrentUserProfile,
	createUserProfile,
	updateUserProfile,
	uploadImage,
	removeImage,
};
