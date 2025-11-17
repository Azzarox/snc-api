import { db } from '../../config/knexConfig';
import { PostRepository } from './posts/PostRepository';
import { UserProfileRepository } from './users/UserProfileRepository';
import { UserRepository } from './users/UserRepository';

export const usersRepository = new UserRepository(db);
export const userProfilesRepository = new UserProfileRepository(db);
export const postsRepository = new PostRepository(db);

// Export classes for testing
export { UserRepository, UserProfileRepository, PostRepository };
