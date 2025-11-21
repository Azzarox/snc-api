import { usersRepository } from '../../repositories';

const getAllUsers = async () => {
	return await usersRepository.getAll(['id', 'username', 'createdAt', 'updatedAt']);
};

export const userService = {
	getAllUsers,
};
