import { Context } from "koa";
import { authService } from "../../services/auth/authService";

export const users: { username: string, password: string }[] = [];


const registerUser = (ctx: Context) => {
    const { username, password } = ctx.request.body;
    const user = authService.registerUser(username, password);

    // TODO: Have error handler
    ctx.status = 201;
    ctx.body = user;
}

export const authController = {
    registerUser,
}