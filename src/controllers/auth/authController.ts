import { Context } from "koa";
import { authService } from "../../services/auth/authService";
import { LoginPayload, RegisterPayload } from "../../schemas/auth/registerSchema";
import { SuccessResponse } from "../../common/response/Response";
import { StatusCodes } from "http-status-codes";

export const users: { username: string, password: string }[] = [];


const registerUser = async (ctx: Context) => {
    const { username, password } = ctx.request.body as RegisterPayload;
    const user = await authService.registerUser(username, password);

    const response = new SuccessResponse(StatusCodes.CREATED, 'Successfully created user!', user)
    ctx.status = response.status
    ctx.body = response
}

const loginUser = async (ctx: Context) => {
    const {username, password} = ctx.request.body as LoginPayload;
    const token = await authService.loginUser(username, password);
    const response = new SuccessResponse(StatusCodes.OK, null, token)
    ctx.status = response.status
    ctx.body = response
}

export const authController = {
    registerUser,
    loginUser,
}