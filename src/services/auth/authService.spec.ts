import { authService } from './authService';
import { usersRepository } from '../../repositories';
import * as authUtils from '../../utils/auth';
import * as createTokenUtil from '../../utils/createToken';
import * as withTransactionUtil from '../../utils/withTransaction';
import { userProfileService } from '../user/profile/userProfileService';
import { CustomHttpError } from '../../common/errors/CustomHttpError';
import { StatusCodes } from 'http-status-codes';
import { UserEntity } from '../../schemas/entities/userEntitySchema';
import { RegisterPayload } from '../../schemas/auth/registerSchema';

const username = 'test123';
const email = 'test123@gmail.com';
const password = 'test123';
const hashedPassword = '$2a$10$hashedpassword';
const jwtToken = 'mock.jwt.token';

const user = {
	id: 1,
	username: username,
	email: email,
	password: hashedPassword,
} as UserEntity;

jest.mock('../../utils/auth', () => ({
	hashPassword: jest.fn(),
	comparePasswords: jest.fn(),
}));

describe('authService', () => {
	afterEach(() => {
		jest.restoreAllMocks();
		jest.clearAllMocks();
	});

	describe('registerUser', () => {
		const registerPayload: RegisterPayload = {
			username: username,
			email: email,
			password: password,
			firstName: 'Test',
			lastName: 'Testing',
		};

		const newUser = { id: 1, username: username };
		const newProfile = { id: 1, firstName: registerPayload.firstName, lastName: registerPayload.lastName };

		it('should successfully register a new user', async () => {
			jest.spyOn(usersRepository, 'getByUsername').mockResolvedValue(null);
			jest.spyOn(usersRepository, 'getByEmail').mockResolvedValue(null);
			jest.spyOn(authUtils, 'hashPassword').mockResolvedValue(hashedPassword);
			jest.spyOn(withTransactionUtil, 'withTransaction').mockImplementation(async (callback) => {
				return await callback(null as any);
			});
			jest.spyOn(usersRepository, 'create').mockResolvedValue(newUser as any);
			jest.spyOn(userProfileService, 'createUserProfile').mockResolvedValue(newProfile as any);

			const result = await authService.registerUser(registerPayload);

			expect(usersRepository.getByUsername).toHaveBeenCalledWith(username, 'id');
			expect(usersRepository.getByEmail).toHaveBeenCalledWith(email, 'id');
			expect(usersRepository.create).toHaveBeenCalledWith(
				{
					username: username,
					email: email,
					password: hashedPassword,
				},
				['id', 'username'],
				null
			);
			expect(userProfileService.createUserProfile).toHaveBeenCalledWith(
				1,
				{
					firstName: registerPayload.firstName,
					lastName: registerPayload.lastName,
					bio: undefined,
					description: undefined,
				},
				null
			);
			expect(result).toEqual({
				id: 1,
				profile: {
					id: 1,
					firstName: registerPayload.firstName,
					lastName: registerPayload.lastName,
				},
			});
		});

		it('should throw CustomHttpError 400 when user already exists by username', async () => {
			jest.spyOn(usersRepository, 'getByUsername').mockResolvedValue(user);
			jest.spyOn(usersRepository, 'getByEmail').mockResolvedValue(null);

			try {
				await authService.registerUser(registerPayload);
				expect(usersRepository.getByUsername).toHaveBeenCalledWith(username, 'id');
				expect(usersRepository.create).not.toHaveBeenCalled();
			} catch (err: any) {
				expect(err).toBeInstanceOf(CustomHttpError);
				expect(err.status).toBe(StatusCodes.BAD_REQUEST);
				expect(err.message).toBe('User already exists!');
			}
		});

		it('should throw CustomHttpError 400 when user already exists by email', async () => {
			jest.spyOn(usersRepository, 'getByUsername').mockResolvedValue(null);
			jest.spyOn(usersRepository, 'getByEmail').mockResolvedValue(user);

			try {
				await authService.registerUser(registerPayload);
				expect(usersRepository.getByEmail).toHaveBeenCalledWith(email, 'id');
				expect(usersRepository.create).not.toHaveBeenCalled();
			} catch (err: any) {
				expect(err).toBeInstanceOf(CustomHttpError);
				expect(err.status).toBe(StatusCodes.BAD_REQUEST);
				expect(err.message).toBe('User already exists!');
			}
		});

		it('should hash password with correct salt', async () => {
			jest.spyOn(usersRepository, 'getByUsername').mockResolvedValue(null);
			jest.spyOn(usersRepository, 'getByEmail').mockResolvedValue(null);
			jest.spyOn(authUtils, 'hashPassword').mockResolvedValue(hashedPassword);
			jest.spyOn(withTransactionUtil, 'withTransaction').mockImplementation(async (callback) => {
				return await callback(null as any);
			});
			jest.spyOn(usersRepository, 'create').mockResolvedValue(newUser as any);
			jest.spyOn(userProfileService, 'createUserProfile').mockResolvedValue(newProfile as any);

			await authService.registerUser(registerPayload);

			expect(authUtils.hashPassword).toHaveBeenCalledWith(password, expect.any(Number));
		});
	});

	describe('loginUser', () => {
		describe('with username', () => {
			const loginPayload = {
				username: username,
				password: password,
			};

			it('should successfully login a user with valid credentials', async () => {
				const userWithEmail = {
					id: 1,
					username: username,
					email: email,
					password: hashedPassword,
				} as UserEntity;

				jest.spyOn(usersRepository, 'getByUsername').mockResolvedValue(userWithEmail);
				jest.spyOn(authUtils, 'comparePasswords').mockResolvedValue(true);
				jest.spyOn(createTokenUtil, 'createToken').mockReturnValue(jwtToken);

				const result = await authService.loginUser(loginPayload);

				expect(usersRepository.getByUsername).toHaveBeenCalledWith(username, ['id', 'username', 'password', 'email']);
				expect(authUtils.comparePasswords).toHaveBeenCalledWith(password, hashedPassword);
				expect(createTokenUtil.createToken).toHaveBeenCalledWith({
					id: userWithEmail.id,
					username: userWithEmail.username,
					email: userWithEmail.email,
				});
				expect(result).toEqual({ accessToken: jwtToken });
			});

			it('should throw CustomHttpError 404 when user does not exist', async () => {
				jest.spyOn(usersRepository, 'getByUsername').mockResolvedValue(null);

				try {
					await authService.loginUser(loginPayload);
					expect(usersRepository.getByUsername).toHaveBeenCalledWith(username, ['id', 'username', 'password', 'email']);
					expect(authUtils.comparePasswords).not.toHaveBeenCalled();
				} catch (err: any) {
					expect(err).toBeInstanceOf(CustomHttpError);
					expect(err.status).toBe(StatusCodes.NOT_FOUND);
					expect(err.message).toBe('Wrong username or password');
				}
			});

			it('should throw CustomHttpError 401 when password is invalid', async () => {
				jest.spyOn(usersRepository, 'getByUsername').mockResolvedValue(user);
				jest.spyOn(authUtils, 'comparePasswords').mockResolvedValue(false);

				try {
					await authService.loginUser(loginPayload);
				} catch (err: any) {
					expect(err).toBeInstanceOf(CustomHttpError);
					expect(err.status).toBe(StatusCodes.UNAUTHORIZED);
					expect(err.message).toBe('Wrong username or password');
				}

				expect(usersRepository.getByUsername).toHaveBeenCalledWith(username, ['id', 'username', 'password', 'email']);
				expect(authUtils.comparePasswords).toHaveBeenCalledWith(password, hashedPassword);
			});

			it('should create token with only safe user data without password', async () => {
				jest.spyOn(usersRepository, 'getByUsername').mockResolvedValue(user);
				jest.spyOn(authUtils, 'comparePasswords').mockResolvedValue(true);
				jest.spyOn(createTokenUtil, 'createToken').mockReturnValue(jwtToken);

				await authService.loginUser(loginPayload);

				expect(createTokenUtil.createToken).toHaveBeenCalledWith({
					id: user.id,
					username: user.username,
					email: user.email,
				});
				expect(createTokenUtil.createToken).not.toHaveBeenCalledWith(
					expect.objectContaining({
						password: expect.any(String),
					})
				);
			});
		});

		describe('with email', () => {
			const loginPayload = {
				email: email,
				password: password,
			};

			it('should successfully login a user with valid credentials', async () => {
				const userWithEmail = {
					id: 1,
					username: username,
					email: email,
					password: hashedPassword,
				} as UserEntity;

				jest.spyOn(usersRepository, 'getByEmail').mockResolvedValue(userWithEmail);
				jest.spyOn(authUtils, 'comparePasswords').mockResolvedValue(true);
				jest.spyOn(createTokenUtil, 'createToken').mockReturnValue(jwtToken);

				const result = await authService.loginUser(loginPayload);

				expect(usersRepository.getByEmail).toHaveBeenCalledWith(email, ['id', 'username', 'password', 'email']);
				expect(authUtils.comparePasswords).toHaveBeenCalledWith(password, hashedPassword);
				expect(createTokenUtil.createToken).toHaveBeenCalledWith({
					id: userWithEmail.id,
					username: userWithEmail.username,
					email: userWithEmail.email,
				});
				expect(result).toEqual({ accessToken: jwtToken });
			});

			it('should throw CustomHttpError 404 when user does not exist', async () => {
				jest.spyOn(usersRepository, 'getByEmail').mockResolvedValue(null);

				try {
					await authService.loginUser(loginPayload);
					expect(usersRepository.getByEmail).toHaveBeenCalledWith(email, ['id', 'username', 'password', 'email']);
					expect(authUtils.comparePasswords).not.toHaveBeenCalled();
				} catch (err: any) {
					expect(err).toBeInstanceOf(CustomHttpError);
					expect(err.status).toBe(StatusCodes.NOT_FOUND);
					expect(err.message).toBe('Wrong username or password');
				}
			});
		});
	});
});
