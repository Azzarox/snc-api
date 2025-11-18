import { ValidatedContext } from '../../middlewares/validationMiddleware';
import { CreateCommentPayload, UpdateCommentPayload } from '../../schemas/comments/createCommentSchema';
import { CommentParams } from '../../schemas/comments/commentParamSchema';
import { commentService } from '../../services/comments/commentService';
import { SuccessResponse } from '../../common/response/Response';
import { StatusCodes } from 'http-status-codes';
import { Context } from 'koa';
import { commentsRepository } from '../../repositories';
import { GenericParams } from '../../schemas/common/paramsSchema';

const createComment = async (ctx: ValidatedContext<CreateCommentPayload, GenericParams>) => {
	const comment = await commentService.createComment(ctx.state.user.id, ctx.params.id, ctx.request.body);
	const response = new SuccessResponse(StatusCodes.CREATED, 'Successfully added comment!', comment);
	ctx.status = response.status;
	ctx.body = response;
};

const updateComment = async (ctx: ValidatedContext<UpdateCommentPayload, CommentParams>) => {
	const comment = await commentService.updateComment(ctx.state.user.id, ctx.params.id, ctx.params.commentId, ctx.request.body);
	const response = new SuccessResponse(StatusCodes.CREATED, 'Successfully updated comment!', comment);
	ctx.status = response.status;
	ctx.body = response;
};

const getAllComments = async (ctx: Context) => {
	const comments = await commentsRepository.getAll();
	const response = new SuccessResponse(StatusCodes.OK, null, comments);
	ctx.status = response.status;
	ctx.body = response;
};


const deleteComment = async (ctx: ValidatedContext<never, CommentParams>) => {
	const comment = await commentService.deleteComment(ctx.state.user.id, ctx.params.id, ctx.params.commentId);
	const response = new SuccessResponse(StatusCodes.CREATED, 'Successfully deleted comment!', comment);
	ctx.status = response.status;
	ctx.body = response;
};

export const commentController = {
	createComment,
	getAllComments,
	updateComment,
	deleteComment,
};
