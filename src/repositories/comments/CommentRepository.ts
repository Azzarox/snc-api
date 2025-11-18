import { CommentEntity } from '../../schemas/entities/commentEntitySchema';
import { KnexRepository } from '../KnexRepository';

export class CommentRepository extends KnexRepository<CommentEntity> {
	protected tableName = 'comments';
}
