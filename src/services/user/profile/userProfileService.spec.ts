import { userProfilesRepository as repository, usersRepository } from "../../../repositories";
import { EnrichedUserProfile } from "../../../repositories/users/UserProfileRepository";
import { UpdateUserProfilePayload, UserProfilePayload } from "../../../schemas/auth/userProfileSchema";
import { userProfileService as service } from "./userProfileService";
import * as avatarUtil from '../../../utils/generateAvatarImage';
import * as coverUtil from '../../../utils/generateCoverImage';
import { cloudinaryService } from '../../cloudinary/cloudinaryService';
import { UserEntity } from '../../../schemas/entities/userEntitySchema';
import { CustomHttpError } from '../../../common/errors/CustomHttpError';
import { StatusCodes } from 'http-status-codes';
import multer from '@koa/multer';

const userId = 1;
const profileId = 24;
const avatarUrl = 'http:/someavatar.com/'
const coverUrl = 'http:/somecover.com/'



describe('userProfileService', () => {
    afterEach(() => {
        jest.restoreAllMocks();
        jest.clearAllMocks();
    });

    describe('getUserProfile', () => {
        it('should get the user profile', async () => {
            const profile = { id: profileId } as EnrichedUserProfile;
            jest.spyOn(repository, 'getUserProfile').mockResolvedValue(profile)
            const result = await service.getUserProfile(userId);
            expect(result).toEqual(profile);
            expect(repository.getUserProfile).toHaveBeenCalledWith(1)
        })
    })

    describe('createUserProfile', () => {
        it('should create user profile entity', async () => {
            const payload: UserProfilePayload = {
                firstName: 'Test',
                lastName: "Testing"
            }
            const profile = { id: profileId, firstName: payload.firstName, lastName: payload.lastName } as EnrichedUserProfile;

            jest.spyOn(repository, 'create').mockResolvedValue(profile)
            jest.spyOn(avatarUtil, 'generateDefaultAvatarUrl').mockReturnValue(avatarUrl)
            jest.spyOn(coverUtil, 'generateDefaultCoverUrl').mockReturnValue(coverUrl)

            const result = await service.createUserProfile(userId, payload)
            expect(result).toEqual(profile);
            expect(avatarUtil.generateDefaultAvatarUrl).toHaveBeenCalledWith(userId)
            expect(coverUtil.generateDefaultCoverUrl).toHaveBeenCalledWith(userId)
            expect(repository.create).toHaveBeenCalledWith({
                userId,
                ...payload,
                avatarUrl,
                avatarStorageKey: null,
                coverUrl,
                coverStorageKey: null
            }, '*', undefined)
        })
    })
    describe('updateUserProfile', () => {
        it('should update user profile entity', async () => {
            const payload: UpdateUserProfilePayload = {
                firstName: 'Update Test',
                lastName: "Update Testing"
            }
            const profile = { id: profileId, firstName: payload.firstName, lastName: payload.lastName } as EnrichedUserProfile;

            jest.spyOn(repository, 'update').mockResolvedValue(profile)

            const result = await service.updateUserProfile(userId, payload)
            expect(result).toEqual(profile);
            expect(repository.update).toHaveBeenCalledWith({userId: userId}, payload)
        })
    })

    describe('uploadImage', () => {
        const file = { buffer: Buffer.from('test') } as multer.File;
        const user = { id: userId, username: 'test123' } as UserEntity;

        it('should successfully upload avatar', async () => {
            const profile = {
                userId: userId,
                avatarStorageKey: null,
            } as EnrichedUserProfile;

            const cloudinaryResult = {
                url: 'https://cloudinary.com/avatar.jpg',
                publicId: 'public-id-123',
            };

            const updatedProfile = {
                avatarUrl: cloudinaryResult.url,
            } as EnrichedUserProfile;

            jest.spyOn(usersRepository, 'findOneBy').mockResolvedValue(user);
            jest.spyOn(repository, 'getUserProfile').mockResolvedValue(profile);
            jest.spyOn(cloudinaryService, 'uploadImage').mockResolvedValue(cloudinaryResult);
            jest.spyOn(repository, 'update').mockResolvedValue(updatedProfile);

            const result = await service.uploadImage(userId, file, 'avatar');

            expect(usersRepository.findOneBy).toHaveBeenCalledWith({ id: userId }, 'username');
            expect(repository.getUserProfile).toHaveBeenCalledWith(userId, 'avatarStorageKey');
            expect(cloudinaryService.uploadImage).toHaveBeenCalledWith(file.buffer, '/user/test123/avatar');
            expect(repository.update).toHaveBeenCalledWith(
                { userId },
                { avatarUrl: cloudinaryResult.url, avatarStorageKey: cloudinaryResult.publicId },
                'avatarUrl'
            );
            expect(result).toEqual(updatedProfile);
        });

        it('should successfully upload cover with crop data', async () => {
            const profile = {
                userId: userId,
                coverStorageKey: null,
            } as EnrichedUserProfile;

            const cropData = {
                croppedAreaPixels: { x: 0, y: 0, width: 100, height: 100 },
            };

            const cloudinaryResult = {
                url: 'https://cloudinary.com/cover.jpg',
                publicId: 'cover-id-123',
            };

            const updatedProfile = {
                coverUrl: cloudinaryResult.url,
            } as EnrichedUserProfile;

            jest.spyOn(usersRepository, 'findOneBy').mockResolvedValue(user);
            jest.spyOn(repository, 'getUserProfile').mockResolvedValue(profile);
            jest.spyOn(cloudinaryService, 'uploadCoverImage').mockResolvedValue(cloudinaryResult);
            jest.spyOn(repository, 'update').mockResolvedValue(updatedProfile);

            const result = await service.uploadImage(userId, file, 'cover', cropData);

            expect(usersRepository.findOneBy).toHaveBeenCalledWith({ id: userId }, 'username');
            expect(repository.getUserProfile).toHaveBeenCalledWith(userId, 'coverStorageKey');
            expect(cloudinaryService.uploadCoverImage).toHaveBeenCalledWith(
                file.buffer,
                '/user/test123/cover',
                cropData.croppedAreaPixels
            );
            expect(repository.update).toHaveBeenCalledWith(
                { userId },
                { coverUrl: cloudinaryResult.url, coverStorageKey: cloudinaryResult.publicId },
                'coverUrl'
            );
            expect(result).toEqual(updatedProfile);
        });

        it('should throw BAD_REQUEST when no file provided', async () => {
            try {
                await service.uploadImage(userId, null as any, 'avatar');
            } catch (err: any) {
                expect(err).toBeInstanceOf(CustomHttpError);
                expect(err.status).toBe(StatusCodes.BAD_REQUEST);
                expect(err.message).toBe('No uploaded file!');
            }
        });

        it('should throw NOT_FOUND when user not found', async () => {
            const profile = { userId: userId } as EnrichedUserProfile;

            jest.spyOn(usersRepository, 'findOneBy').mockResolvedValue(null);
            jest.spyOn(repository, 'getUserProfile').mockResolvedValue(profile);

            try {
                await service.uploadImage(userId, file, 'avatar');
            } catch (err: any) {
                expect(err).toBeInstanceOf(CustomHttpError);
                expect(err.status).toBe(StatusCodes.NOT_FOUND);
                expect(err.message).toBe('User not found!');
            }

            expect(usersRepository.findOneBy).toHaveBeenCalledWith({ id: userId }, 'username');
        });
    });

    describe('removeImage', () => {
        const user = { id: userId } as UserEntity;

        it('should successfully remove avatar and reset to default', async () => {
            const profile = {
                userId: userId,
                avatarStorageKey: 'old-avatar-key',
            } as EnrichedUserProfile;

            const updatedProfile = {
                avatarUrl: expect.any(String),
            } as EnrichedUserProfile;

            jest.spyOn(usersRepository, 'findOneBy').mockResolvedValue(user);
            jest.spyOn(repository, 'getUserProfile').mockResolvedValue(profile);
            jest.spyOn(cloudinaryService, 'deleteImage').mockResolvedValue(undefined);
            jest.spyOn(repository, 'update').mockResolvedValue(updatedProfile);

            const result = await service.removeImage(userId, 'avatar');

            expect(usersRepository.findOneBy).toHaveBeenCalledWith({ id: userId }, 'id');
            expect(repository.getUserProfile).toHaveBeenCalledWith(userId, 'avatarStorageKey');
            expect(cloudinaryService.deleteImage).toHaveBeenCalledWith('old-avatar-key');
            expect(repository.update).toHaveBeenCalledWith(
                { userId },
                { avatarUrl: expect.any(String), avatarStorageKey: null },
                ['avatarUrl']
            );
            expect(result).toEqual(updatedProfile);
        });

        it('should successfully remove cover and reset to default', async () => {
            const profile = {
                userId: userId,
                coverStorageKey: 'old-cover-key',
            } as EnrichedUserProfile;

            const updatedProfile = {
                coverUrl: expect.any(String),
            } as EnrichedUserProfile;

            jest.spyOn(usersRepository, 'findOneBy').mockResolvedValue(user);
            jest.spyOn(repository, 'getUserProfile').mockResolvedValue(profile);
            jest.spyOn(cloudinaryService, 'deleteImage').mockResolvedValue(undefined);
            jest.spyOn(repository, 'update').mockResolvedValue(updatedProfile);

            const result = await service.removeImage(userId, 'cover');

            expect(usersRepository.findOneBy).toHaveBeenCalledWith({ id: userId }, 'id');
            expect(repository.getUserProfile).toHaveBeenCalledWith(userId, 'coverStorageKey');
            expect(cloudinaryService.deleteImage).toHaveBeenCalledWith('old-cover-key');
            expect(repository.update).toHaveBeenCalledWith(
                { userId },
                { coverUrl: expect.any(String), coverStorageKey: null },
                ['coverUrl']
            );
            expect(result).toEqual(updatedProfile);
        });

        it('should throw NOT_FOUND when user not found', async () => {
            const profile = { userId: userId } as EnrichedUserProfile;

            jest.spyOn(usersRepository, 'findOneBy').mockResolvedValue(null);
            jest.spyOn(repository, 'getUserProfile').mockResolvedValue(profile);

            try {
                await service.removeImage(userId, 'avatar');
            } catch (err: any) {
                expect(err).toBeInstanceOf(CustomHttpError);
                expect(err.status).toBe(StatusCodes.NOT_FOUND);
                expect(err.message).toBe('User not found!');
            }

            expect(usersRepository.findOneBy).toHaveBeenCalledWith({ id: userId }, 'id');
        });

        it('should throw NOT_FOUND when profile does not exist', async () => {
            jest.spyOn(usersRepository, 'findOneBy').mockResolvedValue(user);
            jest.spyOn(repository, 'getUserProfile').mockResolvedValue(null);

            try {
                await service.removeImage(userId, 'avatar');
            } catch (err: any) {
                expect(err).toBeInstanceOf(CustomHttpError);
                expect(err.status).toBe(StatusCodes.NOT_FOUND);
                expect(err.message).toBe("User doesn't have profile!");
            }

            expect(usersRepository.findOneBy).toHaveBeenCalledWith({ id: userId }, 'id');
            expect(repository.getUserProfile).toHaveBeenCalledWith(userId, 'avatarStorageKey');
        });
    });
})