import { postService as service } from './postService';
import { postsRepository as repository, usersRepository } from '../../repositories';
import { postServiceHelpers as helpers } from './helpers';
import { CustomHttpError } from '../../common/errors/CustomHttpError';
import { StatusCodes } from 'http-status-codes';
import { UserEntity } from '../../schemas/entities/userEntitySchema';
import { EnrichedPost, EnrichedPostWithComments } from '../../repositories/posts/PostRepository';

const userId = 1;
const postId = 1;
const post = {
	id: postId,
	userId: userId,
} as EnrichedPost;

const postWithComments = {
	id: postId,
	userId: userId,
	comments: [],
} as unknown as EnrichedPostWithComments;

const user = {
	id: userId,
} as UserEntity;

describe('postService', () => {
	afterEach(() => {
		jest.restoreAllMocks();
		jest.clearAllMocks();
	});

	describe('getAll', () => {
		it('should successfully retrieve all posts', async () => {
			const posts = [post, { ...post, id: 2 }] as EnrichedPost[];

			jest.spyOn(repository, 'getAll').mockResolvedValue(posts);

			const result = await service.getAll();

			expect(repository.getAll).toHaveBeenCalledWith('*', undefined);
			expect(result).toEqual(posts);
		});
	});

	describe('getAllWithComments', () => {
		it('should successfully retrieve all posts with comments', async () => {
			const posts = [postWithComments];

			jest.spyOn(repository, 'getAllWithComments').mockResolvedValue(posts);

			const result = await service.getAllWithComments();

			expect(repository.getAllWithComments).toHaveBeenCalledWith('*', undefined);
			expect(result).toEqual(posts);
		});
	});

	describe('getById', () => {
		it('should successfully retrieve a post by id', async () => {
			jest.spyOn(repository, 'getById').mockResolvedValue(post);

			const result = await service.getById(postId);

			expect(repository.getById).toHaveBeenCalledWith(postId, false, '*', undefined);
			expect(result).toEqual(post);
		});

		it('should throw CustomHttpError 404 when post not found', async () => {
			jest.spyOn(repository, 'getById').mockResolvedValue(null);

			try {
				await service.getById(postId);
			} catch (err: any) {
				expect(err).toBeInstanceOf(CustomHttpError);
				expect(err.status).toBe(StatusCodes.NOT_FOUND);
				expect(err.message).toBe(`Post with ID:${postId} not found!`);
			}

			expect(repository.getById).toHaveBeenCalledWith(postId, false, '*', undefined);
		});
	});

	describe('getAllUserPosts', () => {
		it('should successfully retrieve all posts for a user', async () => {
			const posts = [post];

			jest.spyOn(usersRepository, 'findOneBy').mockResolvedValue(user);
			jest.spyOn(repository, 'getAllUsersPosts').mockResolvedValue(posts as any);

			const result = await service.getAllUserPosts(userId);

			expect(usersRepository.findOneBy).toHaveBeenCalledWith({ id: userId });
			expect(repository.getAllUsersPosts).toHaveBeenCalledWith(userId, false, '*', undefined);
			expect(result).toEqual(posts);
		});

		it('should throw CustomHttpError 404 when user not found', async () => {
			jest.spyOn(usersRepository, 'findOneBy').mockResolvedValue(null);
			jest.spyOn(repository, 'getAllUsersPosts');

			try {
				await service.getAllUserPosts(userId);
			} catch (err: any) {
				expect(err).toBeInstanceOf(CustomHttpError);
				expect(err.status).toBe(StatusCodes.NOT_FOUND);
				expect(err.message).toBe('User not found!');
			}

			expect(usersRepository.findOneBy).toHaveBeenCalledWith({ id: userId });
			expect(repository.getAllUsersPosts).not.toHaveBeenCalled();
		});
	});

	describe('createPost', () => {
		it('should successfully create a post', async () => {
			const createPayload = {
				title: 'New Post',
				content: 'New Content',
			};

			const newPost = { id: 3, ...createPayload, userId } as any;

			jest.spyOn(repository, 'create').mockResolvedValue(newPost);

			const result = await service.createPost(userId, createPayload);

			expect(repository.create).toHaveBeenCalledWith({
				...createPayload,
				userId,
			});
			expect(result).toEqual(newPost);
		});
	});

	describe('deletePost', () => {
		it('should successfully delete a post', async () => {
			const deletedPost = post;

			jest.spyOn(helpers, 'validateBeforePostOperations').mockResolvedValue(undefined);
			jest.spyOn(repository, 'delete').mockResolvedValue(deletedPost);

			const result = await service.deletePost(userId, postId);

			expect(helpers.validateBeforePostOperations).toHaveBeenCalledWith(userId, postId);
			expect(repository.delete).toHaveBeenCalledWith(postId);
			expect(result).toEqual(deletedPost);
		});

		it('should throw error when validation fails', async () => {
			const error = new CustomHttpError(StatusCodes.FORBIDDEN, "You don't have permission to modify this resource");

			jest.spyOn(helpers, 'validateBeforePostOperations').mockRejectedValue(error);
			jest.spyOn(repository, 'delete');

			try {
				await service.deletePost(userId, postId);
			} catch (err: any) {
				expect(err).toBeInstanceOf(CustomHttpError);
				expect(err.status).toBe(StatusCodes.FORBIDDEN);
			}

			expect(helpers.validateBeforePostOperations).toHaveBeenCalledWith(userId, postId);
			expect(repository.delete).not.toHaveBeenCalled();
		});
	});

	describe('updatePost', () => {
		it('should successfully update a post', async () => {
			const updatePayload = {
				title: 'Updated Title',
				content: 'Updated Content',
			};

			const updatedPost = { ...post, ...updatePayload } as any;

			jest.spyOn(helpers, 'validateBeforePostOperations').mockResolvedValue(undefined);
			jest.spyOn(repository, 'update').mockResolvedValue(updatedPost);

			const result = await service.updatePost(userId, postId, updatePayload);

			expect(helpers.validateBeforePostOperations).toHaveBeenCalledWith(userId, postId);
			expect(repository.update).toHaveBeenCalledWith(postId, updatePayload);
			expect(result).toEqual(updatedPost);
		});

		it('should throw error when validation fails', async () => {
			const updatePayload = {
				title: 'Updated Title',
			};

			const error = new CustomHttpError(StatusCodes.NOT_FOUND, 'Post not found!');

			jest.spyOn(helpers, 'validateBeforePostOperations').mockRejectedValue(error);
			jest.spyOn(repository, 'update');

			try {
				await service.updatePost(userId, postId, updatePayload);
			} catch (err: any) {
				expect(err).toBeInstanceOf(CustomHttpError);
				expect(err.status).toBe(StatusCodes.NOT_FOUND);
			}

			expect(helpers.validateBeforePostOperations).toHaveBeenCalledWith(userId, postId);
			expect(repository.update).not.toHaveBeenCalled();
		});
	});
});
