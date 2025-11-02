import { authService } from './authService';
import { usersRepository } from '../../repositories';
import * as bcrypt from 'bcryptjs';
import * as createTokenUtil from '../../utils/createToken';
import { CustomHttpError } from '../../common/errors/CustomHttpError';
import { StatusCodes } from 'http-status-codes';
import { UserEntity } from '../../schemas/entities/userEntitySchema';

const username = 'testuser';
const password = 'testpassword123';
const hashedPassword = '$2a$10$hashedpassword';
const jwtToken = 'mock.jwt.token';

const user = {
	id: 1,
	username: username,
	password: hashedPassword,
} as UserEntity;

jest.mock('bcryptjs', () => ({
	hash: jest.fn(),
	compare: jest.fn(),
}));

describe('authService', () => {
	afterEach(() => {
		jest.restoreAllMocks();
		jest.clearAllMocks();
	});

	describe('authService.registerUser', () => {
		it('should successfully register a new user', async () => {
			const newUser = { id: 1, username: username } as UserEntity;

			jest.spyOn(usersRepository, 'getByUsername').mockResolvedValue(null);
			jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashedPassword as never);
			jest.spyOn(usersRepository, 'create').mockResolvedValue(newUser);

			const result = await authService.registerUser(username, password);

			expect(usersRepository.getByUsername).toHaveBeenCalledWith(username);
			expect(usersRepository.create).toHaveBeenCalledWith(
				{
					username: username,
					password: hashedPassword,
				},
				['id', 'username']
			);
			expect(result).toEqual(newUser);
		});

		it('should throw CustomHttpError 400 when user already exists', async () => {
			jest.spyOn(usersRepository, 'getByUsername').mockResolvedValue(user);

			try {
				await authService.registerUser(username, password);
				expect(usersRepository.getByUsername).toHaveBeenCalledWith(username);
				expect(usersRepository.create).not.toHaveBeenCalled();
			} catch (err: any) {
				expect(err).toBeInstanceOf(CustomHttpError);
				expect(err.status).toBe(StatusCodes.BAD_REQUEST);
				expect(err.message).toBe('User already exists!');
			}
		});

		it('should hash password with correct salt', async () => {
			jest.spyOn(usersRepository, 'getByUsername').mockResolvedValue(null);
			jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashedPassword as never);
			jest.spyOn(usersRepository, 'create').mockResolvedValue(user);

			await authService.registerUser(username, password);

			expect(bcrypt.hash).toHaveBeenCalledWith(password, expect.any(Number));
		});
	});

	describe('authService.loginUser', () => {
		it('should successfully login a user with valid credentials', async () => {
			const user = {
				id: 1,
				username: username,
				password: hashedPassword,
			} as UserEntity;

			jest.spyOn(usersRepository, 'getByUsername').mockResolvedValue(user);
			jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);
			jest.spyOn(createTokenUtil, 'createToken').mockReturnValue(jwtToken);

			const result = await authService.loginUser(username, password);

			expect(usersRepository.getByUsername).toHaveBeenCalledWith(username);
			expect(bcrypt.compare).toHaveBeenCalledWith(password, hashedPassword);
			expect(createTokenUtil.createToken).toHaveBeenCalledWith({
				id: user.id,
				username: user.username,
			});
			expect(result).toEqual({ accessToken: jwtToken });
		});

		it('should throw CustomHttpError 404 when user does not exist', async () => {
			jest.spyOn(usersRepository, 'getByUsername').mockResolvedValue(null);

			try {
				await authService.loginUser(username, password);
				expect(usersRepository.getByUsername).toHaveBeenCalledWith(username);
				expect(bcrypt.compare).not.toHaveBeenCalled();
			} catch (err: any) {
				expect(err).toBeInstanceOf(CustomHttpError);
				expect(err.status).toBe(StatusCodes.NOT_FOUND);
				expect(err.message).toBe('Invalid Credentials');
			}
		});

		it('should throw CustomHttpError 401 when password is invalid', async () => {
			jest.spyOn(usersRepository, 'getByUsername').mockResolvedValue(user);
			jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

			try {
				await authService.loginUser(username, password);
			} catch (err: any) {
				expect(err).toBeInstanceOf(CustomHttpError);
				expect(err.status).toBe(StatusCodes.UNAUTHORIZED);
				expect(err.message).toBe('Invalid Credentials');
			}

			expect(usersRepository.getByUsername).toHaveBeenCalledWith(username);
			expect(bcrypt.compare).toHaveBeenCalledWith(password, hashedPassword);
		});

		it('should create token with only safe user data without password', async () => {
			jest.spyOn(usersRepository, 'getByUsername').mockResolvedValue(user);
			jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);
			jest.spyOn(createTokenUtil, 'createToken').mockReturnValue(jwtToken);

			await authService.loginUser(username, password);

			expect(createTokenUtil.createToken).toHaveBeenCalledWith({
				id: user.id,
				username: user.username,
			});
			expect(createTokenUtil.createToken).not.toHaveBeenCalledWith(
				expect.objectContaining({
					password: expect.any(String),
				})
			);
		});
	});

	describe('authService.getUsers', () => {
		it('should successfully retrieve all users', async () => {
			const users = [
				{
					id: 1,
					username: 'user1',
					created_at: new Date('2024-01-01'),
					updated_at: new Date('2024-01-01'),
				},
				{
					id: 2,
					username: 'user2',
					created_at: new Date('2024-01-02'),
					updated_at: new Date('2024-01-02'),
				},
			] as UserEntity[];

			jest.spyOn(usersRepository, 'getAll').mockResolvedValue(users);

			const result = await authService.getUsers();

			expect(usersRepository.getAll).toHaveBeenCalledWith(['id', 'username', 'created_at', 'updated_at']);
			expect(result).toEqual(users);
		});

		it('should return empty array when no users exist', async () => {
			jest.spyOn(usersRepository, 'getAll').mockResolvedValue([]);

			const result = await authService.getUsers();

			expect(usersRepository.getAll).toHaveBeenCalledWith(['id', 'username', 'created_at', 'updated_at']);
			expect(result).toEqual([]);
		});

		it('should not include password field in the result', async () => {
			const users = [
				{
					id: 1,
					username: 'user1',
					created_at: new Date('2024-01-01'),
					updated_at: new Date('2024-01-01'),
				},
			] as UserEntity[];

			jest.spyOn(usersRepository, 'getAll').mockResolvedValue(users);

			const result = await authService.getUsers();

			expect(usersRepository.getAll).toHaveBeenCalledWith(['id', 'username', 'created_at', 'updated_at']);
			result.forEach((user) => {
				expect(user).not.toHaveProperty('password');
			});
		});
	});
});
