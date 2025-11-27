import { db } from '../../config/knexConfig';
import { CommentRepository } from './comments/CommentRepository';
import { PostRepository } from './posts/PostRepository';
import { PostLikesRepository } from './posts/PostLikesRepository';
import { UserProfileRepository } from './users/UserProfileRepository';
import { UserRepository } from './users/UserRepository';

export const usersRepository = new UserRepository(db);
export const userProfilesRepository = new UserProfileRepository(db);
export const postsRepository = new PostRepository(db);
export const postLikesRepository = new PostLikesRepository(db);
export const commentsRepository = new CommentRepository(db);

// Export classes for testing
export { UserRepository, UserProfileRepository, PostRepository, PostLikesRepository, CommentRepository };
