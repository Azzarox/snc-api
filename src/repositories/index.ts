import { db } from "../../config/knexConfig";
import { UserRepository } from "./users/UserRepository";

export const usersRepository = new UserRepository(db);

// Export classes for testing
export { UserRepository };
