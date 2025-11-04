import { Knex } from 'knex';
import { userProfilesRepository } from '../repositories';
import { CreateEntity } from '../repositories/KnexRepository';
import { UserProfilePayload } from '../schemas/auth/userProfileSchema';
import { UserProfileEntity } from '../schemas/entities/userProfileEntitySchema';

const getCurrentUserProfile = async (id: number) => {
	return await userProfilesRepository.getCurrentUserProfile(id)
};

const createUserProfile = async (userId: number, payload: UserProfilePayload, trx?: Knex.Transaction): Promise<UserProfileEntity> => {
	const entity: CreateEntity<UserProfileEntity> = {
		userId,
		...payload,
	}

	return await userProfilesRepository.create(entity, '*', trx);
};

export const userService = {
	getCurrentUserProfile,
	createUserProfile,
};
