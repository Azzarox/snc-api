import { Context } from 'koa';
import { SuccessResponse } from '../../common/response/Response';
import { StatusCodes } from 'http-status-codes';
import { ValidatedContext } from '../../middlewares/validationMiddleware';
import { CreatePostPayload } from '../../schemas/posts/createPostSchema';
import { postService } from '../../services/posts/postService';
import { GenericParams } from '../../schemas/common/paramsSchema';
import { UpdatePostPayload } from '../../schemas/posts/updatePostSchema';

const getById = async (ctx: ValidatedContext<never, GenericParams>) => {
	const postDetails = await postService.getById(ctx.params.id);
	const response = new SuccessResponse(StatusCodes.OK, null, postDetails);
	ctx.status = response.status;
	ctx.body = response;
};

const getAll = async (ctx: Context) => {
	const posts = await postService.getAll();
	const response = new SuccessResponse(StatusCodes.OK, null, posts);
	ctx.status = response.status;
	ctx.body = response;
};

const createPost = async (ctx: ValidatedContext<CreatePostPayload>) => {
	const post = await postService.createPost(ctx.state.user.id, ctx.request.body);
	const response = new SuccessResponse(StatusCodes.CREATED, 'Successfully created post!', post);
	ctx.status = response.status;
	ctx.body = response;
};

const deletePost = async (ctx: ValidatedContext<never, GenericParams>) => {
	const deletedPost = await postService.deletePost(ctx.state.user.id, ctx.params.id);
	const response = new SuccessResponse(StatusCodes.OK, 'Successfully deleted post!', deletedPost);
	ctx.status = response.status;
	ctx.body = response;
};

const updatePost = async (ctx: ValidatedContext<UpdatePostPayload, GenericParams>) => {
	const updatedPost = await postService.updatePost(ctx.state.user.id, ctx.params.id, ctx.request.body);
	const response = new SuccessResponse(StatusCodes.OK, 'Successfully updated post!', updatedPost);
	ctx.status = response.status;
	ctx.body = response;
};

export const postController = {
	getAll,
	getById,
	createPost,
	deletePost,
	updatePost,
};
