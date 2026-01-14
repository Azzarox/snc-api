import { likeService as service } from './likeService';
import { postLikesRepository as repository, postsRepository } from '../../repositories';
import { PostLikeEntity } from '../../schemas/entities/postLikeEntitySchema';
import { PostEntity } from '../../schemas/entities/postEntitySchema';

const userId = 1;
const postId = 1;

const like = {
	userId: userId,
	postId: postId,
} as PostLikeEntity;

describe('likeService', () => {
	afterEach(() => {
		jest.restoreAllMocks();
		jest.clearAllMocks();
	});

	describe('toggleLike', () => {
		it('should create like when it does not exist', async () => {
			jest.spyOn(postsRepository, 'findOneBy').mockResolvedValue({ id: postId } as PostEntity);
			jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);
			jest.spyOn(repository, 'create').mockResolvedValue(like);

			const result = await service.toggleLike(userId, postId);

			expect(repository.findOneBy).toHaveBeenCalledWith({ userId, postId });
			expect(repository.create).toHaveBeenCalledWith({ userId, postId }, ['postId', 'userId']);
			expect(result).toEqual({
				action: 'liked',
				userId,
				postId,
			});
		});

		it('should delete like when it exists', async () => {
			jest.spyOn(postsRepository, 'findOneBy').mockResolvedValue({ id: postId } as PostEntity);
			jest.spyOn(repository, 'findOneBy').mockResolvedValue(like);
			jest.spyOn(repository, 'delete').mockResolvedValue(like);

			const result = await service.toggleLike(userId, postId);

			expect(repository.findOneBy).toHaveBeenCalledWith({ userId, postId });
			expect(repository.delete).toHaveBeenCalledWith({ userId, postId }, ['postId', 'userId']);
			expect(result).toEqual({
				action: 'unliked',
				userId,
				postId,
			});
		});
	});

	describe('getPostLikes', () => {
		it('should return likes count for post', async () => {
			const likes = [like, { ...like, userId: 2 }, { ...like, userId: 3 }];

			jest.spyOn(postsRepository, 'findOneBy').mockResolvedValue({ id: postId } as PostEntity);
			jest.spyOn(repository, 'find').mockResolvedValue(likes as any);

			const result = await service.getPostLikes(postId);

			expect(repository.find).toHaveBeenCalledWith({ postId });
			expect(result).toEqual({ likesCount: 3 });
		});

		it('should return 0 when post has no likes', async () => {
			jest.spyOn(postsRepository, 'findOneBy').mockResolvedValue({ id: postId } as PostEntity);
			jest.spyOn(repository, 'find').mockResolvedValue([]);

			const result = await service.getPostLikes(postId);

			expect(repository.find).toHaveBeenCalledWith({ postId });
			expect(result).toEqual({ likesCount: 0 });
		});
	});
});
