import { StatusCodes } from 'http-status-codes';
import { CustomHttpError } from '../../common/errors/CustomHttpError';
import * as bcrypt from 'bcryptjs';
import { envConfig } from '../../../config/envConfig';

import { createToken } from '../../utils/createToken';
import { usersRepository } from '../../repositories';

const registerUser = async (username: string, password: string) => {
	const user = await usersRepository.getByUsername(username);

	if (user) {
		throw new CustomHttpError(StatusCodes.BAD_REQUEST, 'User already exists!');
	}

	const hashedPassword = await bcrypt.hash(password, envConfig.SALT);


	const newUserData = {
		username,
		password: hashedPassword,
	}

	const newUser = await usersRepository.create(newUserData, ['id', 'username']);
	return newUser;
};

const loginUser = async (username: string, password: string) => {
	const user = await usersRepository.getByUsername(username);
	if (!user) {
		throw new CustomHttpError(StatusCodes.NOT_FOUND, 'Invalid Credentials');
	}

	const isValid = await bcrypt.compare(password, user.password);
	if (!isValid) {
		throw new CustomHttpError(StatusCodes.UNAUTHORIZED, 'Invalid Credentials');
	}

	const payload = { id: user.id, username: user.username };
	const accessToken = createToken(payload);

	return {
		accessToken,
	};
};

const getUsers = async () => {
	return await usersRepository.getAll(['id','username','created_at', 'updated_at']);
}

export const authService = {
	registerUser,
	loginUser,
	getUsers,
};
