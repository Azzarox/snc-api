import { StatusCodes } from 'http-status-codes';
import { CustomHttpError } from '../../common/errors/CustomHttpError';
import * as bcrypt from 'bcryptjs';
import { envConfig } from '../../../config/envConfig';
import { db } from '../../../config/knexConfig';

import { createToken } from '../../utils/createToken';
import { UserRepository, usersRepository } from '../../repositories';
import {  RegisterPayload } from '../../schemas/auth/registerSchema';

import { UserEntity } from '../../schemas/entities/userEntitySchema';
import { LoginPayload } from '../../schemas/auth/loginSchema';
import { UserProfilePayload } from '../../schemas/auth/userProfileSchema';
import { userService } from '../userService';

const registerUser = async (payload: RegisterPayload) => {
	const { username, password, email } = payload;

	const userByUsername = await usersRepository.getByUsername(username, 'id');
	const userByEmail = await usersRepository.getByEmail(email, 'id');

	if (userByUsername || userByEmail) {
		throw new CustomHttpError(StatusCodes.BAD_REQUEST, 'User already exists!');
	}

	const hashedPassword = await bcrypt.hash(password, envConfig.SALT);

	// Use transaction to ensure both user and profile are created atomically
	return await db.transaction(async (trx) => {
		const newUserData = {
			username,
			password: hashedPassword,
			email: email,
		};

		const newUser = await usersRepository.create(newUserData, ['id', 'username'], trx);

		const profilePayload: UserProfilePayload = {
			firstName: payload.firstName,
			lastName: payload.lastName,
			bio: payload.bio,
			description: payload.description,
		}
		
		const profile = await userService.createUserProfile(newUser.id, profilePayload, trx);

		return { ...newUser, ...profile };
	});
};

const loginUser = async (payload: LoginPayload) => {
	const { password } = payload;

	let user: Pick<UserEntity, 'id' | 'username' | 'password'> | null = null;
	if ('username' in payload) {
		user = await usersRepository.getByUsername(payload.username, ['id', 'username', 'password']);
	} else {
		user = await usersRepository.getByEmail(payload.email, ['id', 'username', 'password']);
	}
	
	if (!user) {
		throw new CustomHttpError(StatusCodes.NOT_FOUND, 'Invalid Credentials');
	}

	const isValid = await bcrypt.compare(password, user.password);
	if (!isValid) {
		throw new CustomHttpError(StatusCodes.UNAUTHORIZED, 'Invalid Credentials');
	}

	const tokenPayload = { id: user.id, username: user.username };
	const accessToken = createToken(tokenPayload);

	return {
		accessToken,
	};
};

const getUsers = async () => {
	return await usersRepository.getAll(['id', 'username', 'created_at', 'updated_at']);
};

export const authService = {
	registerUser,
	loginUser,
	getUsers,
};
