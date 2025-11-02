import { db } from "../../config/knexConfig";
import { UserProfileRepository } from "./users/UserProfileRepository";
import { UserRepository } from "./users/UserRepository";

export const usersRepository = new UserRepository(db);
export const userProfilesRepository = new UserProfileRepository(db);

// Export classes for testing
export { UserRepository, UserProfileRepository };
