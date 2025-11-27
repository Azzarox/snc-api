import { KnexRepository } from '../KnexRepository';
import { PostLikeEntity } from '../../schemas/entities/postLikeEntitySchema';

export class PostLikesRepository extends KnexRepository<PostLikeEntity> {
	protected tableName = 'post_likes';
}
