import { Context, DefaultContext } from "koa";
import { authService } from "../../services/auth/authService"
import { User, UserJWT } from "../../types/koa"
import { authController } from "./authController"
import { RegisterPayload } from "../../schemas/auth/registerSchema";
import { ValidatedContext } from "../../middlewares/validationMiddleware";
import { StatusCodes } from "http-status-codes";
import { SuccessResponse } from "../../common/response/Response";
import { LoginPayload } from "../../schemas/auth/loginSchema";


const service = authService;
const controller = authController;

describe('authController', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    })

    describe('registerUser', () => {
        it('should return proper response', async () => {
            const payload: RegisterPayload = {
                username: 'test123',
                password: 'test123',
                email: 'test123@gmail.com',
                firstName: 'Test',
                lastName: 'Testing'
            }

            const user = {
                id: 1,
                profile: {
                    id: 1,
                    firstName: payload.firstName,
                    lastName: payload.lastName
                }
            }

            const ctx = {
                request: {
                    body: {
                        ...payload
                    }
                },
            } as ValidatedContext<RegisterPayload>;

            jest.spyOn(service, 'registerUser').mockResolvedValue(user)

            await controller.registerUser(ctx);

            expect(service.registerUser).toHaveBeenCalledWith(payload);
            expect(ctx.status).toBe(StatusCodes.CREATED);
            expect(ctx.body).toBeInstanceOf(SuccessResponse);
            expect(ctx.body).toMatchObject({
                success: true,
                message: 'Successfully created user!',
                data: user,
            });
        })
    })
    describe('loginUser', () => {
        it('should return proper response when username', async () => {
            const payload: LoginPayload = {
                username: 'test123',
                password: 'test123',
            }

            const response = {
                accessToken: 'fake-token'
            }

            const ctx = {
                request: {
                    body: {
                        ...payload
                    }
                },
            } as ValidatedContext<LoginPayload>;

            jest.spyOn(service, 'loginUser').mockResolvedValue(response)

            await controller.loginUser(ctx);

            expect(service.loginUser).toHaveBeenCalledWith(payload);
            expect(ctx.status).toBe(StatusCodes.OK);
            expect(ctx.body).toBeInstanceOf(SuccessResponse);
            expect(ctx.body).toMatchObject({
                success: true,
                message: null,
                data: response,
            });
        })

        it('should return proper response when email', async () => {
            const payload: LoginPayload = {
                email: 'test123@gmail.com',
                password: 'test123',
            }

            const response = {
                accessToken: 'fake-token'
            }

            const ctx = {
                request: {
                    body: {
                        ...payload
                    }
                },
            } as ValidatedContext<LoginPayload>;

            jest.spyOn(service, 'loginUser').mockResolvedValue(response)

            await controller.loginUser(ctx);

            expect(service.loginUser).toHaveBeenCalledWith(payload);
            expect(ctx.status).toBe(StatusCodes.OK);
            expect(ctx.body).toBeInstanceOf(SuccessResponse);
            expect(ctx.body).toMatchObject({
                success: true,
                message: null,
                data: response,
            });
        })
    })

    describe('getCurrentUser', () => {
        it('should return the user', async () => {
            const ctx = {
                state: {
                    user: {
                        id: 1,
                    } as UserJWT
                }
            } as Context;

            controller.getCurrentUser(ctx);

            expect(ctx.status).toBe(StatusCodes.OK);
            expect(ctx.body).toBeInstanceOf(SuccessResponse);
            expect(ctx.body).toMatchObject({
                success: true,
                message: null,
                data: ctx.state.user,
            });
        })

    })
})