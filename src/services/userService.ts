import { Knex } from 'knex';
import { userProfilesRepository, usersRepository } from '../repositories';
import { CreateEntity } from '../repositories/KnexRepository';
import { UpdateUserProfilePayload, UserProfilePayload } from '../schemas/auth/userProfileSchema';
import { UserProfileEntity } from '../schemas/entities/userProfileEntitySchema';



const getAllUsers = async () => {
	return await usersRepository.getAll(['id', 'username', 'createdAt', 'updatedAt']);
};

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

const updateUserProfile = async (userId: number, payload: UpdateUserProfilePayload) => {
	const p = await userProfilesRepository.update({userId: userId}, payload);
	return p;
}


export const userService = {
	getAllUsers,
	getCurrentUserProfile,
	createUserProfile,
	updateUserProfile,
};
