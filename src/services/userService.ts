import { userProfilesRepository } from '../repositories';

const getCurrentUserProfile = async (id: number) => {
	return await userProfilesRepository.getCurrentUserProfile(id)
};

export const userService = {
	getCurrentUserProfile,
};
