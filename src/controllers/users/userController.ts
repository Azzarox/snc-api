import { Context } from 'koa';
import { authService } from '../../services/auth/authService';
import { LoginPayload, RegisterPayload } from '../../schemas/auth/registerSchema';
import { SuccessResponse } from '../../common/response/Response';
import { StatusCodes } from 'http-status-codes';
import { ValidatedContext } from '../../middlewares/validationMiddleware';
import { userService } from '../../services/userService';

const getCurrentUserProfile = async (ctx: Context) => {
    const profile = await userService.getCurrentUserProfile(ctx.state.user.id);
    const response = new SuccessResponse(StatusCodes.OK, null, profile);
    ctx.status = response.status;
    ctx.body = response;
};


export const userController = {
    getCurrentUserProfile
};
