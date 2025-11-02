import { userProfilesRepository } from "../repositories"

const getCurrentUserProfile = async (id: number) => {
    return await userProfilesRepository.findOneBy({user_id: id}, ['id', 'user_id', 'first_name', 'last_name'])
}

export const userService = {
    getCurrentUserProfile,
}