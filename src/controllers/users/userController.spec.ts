import { Context } from 'koa';
import { userService as service } from '../../services/user/userService';
import { userController as controller } from './userController';
import { SuccessResponse } from '../../common/response/Response';
import { StatusCodes } from 'http-status-codes';

describe('userController', () => {
	afterEach(() => {
		jest.restoreAllMocks();
		jest.clearAllMocks();
	});

	describe('getAllUsers', () => {
		it('should return proper response', async () => {
			const users = [
				{ id: 1, username: 'test123', createdAt: new Date(), updatedAt: new Date() },
				{ id: 2, username: 'test456', createdAt: new Date(), updatedAt: new Date() },
			];

			jest.spyOn(service, 'getAllUsers').mockResolvedValue(users as any);

			const ctx = {} as Context;

			await controller.getAllUsers(ctx);

			expect(service.getAllUsers).toHaveBeenCalled();
			expect(ctx.status).toBe(StatusCodes.OK);
			expect(ctx.body).toBeInstanceOf(SuccessResponse);
			expect(ctx.body).toMatchObject({
				status: StatusCodes.OK,
				message: null,
				data: users,
			});
		});
	});
});
