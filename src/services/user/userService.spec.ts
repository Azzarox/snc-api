import { userService as service } from './userService';
import { usersRepository as repository } from '../../repositories';

describe('userService', () => {
	afterEach(() => {
		jest.restoreAllMocks();
		jest.clearAllMocks();
	});

	describe('getAllUsers', () => {
		it('should return all users with correct columns', async () => {
			const users = [
				{ id: 1, username: 'test123', createdAt: new Date(), updatedAt: new Date() },
				{ id: 2, username: 'test456', createdAt: new Date(), updatedAt: new Date() },
			];

			jest.spyOn(repository, 'getAll').mockResolvedValue(users as any);

			const result = await service.getAllUsers();

			expect(repository.getAll).toHaveBeenCalledWith(['id', 'username', 'createdAt', 'updatedAt']);
			expect(result).toEqual(users);
		});
	});
});
