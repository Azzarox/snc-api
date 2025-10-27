import { Context } from "koa";
import { authService } from "../../services/auth/authService";
import { RegisterPayload } from "../../schemas/auth/registerSchema";

export const users: { username: string, password: string }[] = [];


const registerUser = (ctx: Context) => {
    const { username, password } = ctx.request.body as RegisterPayload;
    const user = authService.registerUser(username, password);
    ctx.status = 201;
    ctx.body = user;
}

export const authController = {
    registerUser,
}