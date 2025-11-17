import { KnexRepository } from '../KnexRepository';
import { PostEntity } from '../../schemas/entities/postEntitySchema';
export class PostRepository extends KnexRepository<PostEntity> {
	protected tableName = 'posts';
}
