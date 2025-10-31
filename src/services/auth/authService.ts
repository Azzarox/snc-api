import { StatusCodes } from 'http-status-codes';
import { CustomHttpError } from '../../common/errors/CustomHttpError';
import { users } from '../../controllers/auth/authController';
import * as bcrypt from 'bcryptjs';
import { envConfig } from '../../../config/envConfig';

const registerUser = async (username: string, password: string) => {
	if (users.find((u) => u.username === username)) {
		throw new CustomHttpError(
			StatusCodes.BAD_REQUEST,
			'User already exists!'
		);
	}

	const hashedPassword = await bcrypt.hash(password, envConfig.SALT);

	const user = {
		username,
		password: hashedPassword,
	};

	users.push(user);
	return user;
};

const loginUser = async (username: string, password: string) => {
	const user = users.find((u) => u.username === username);
	if (!user) {
		throw new CustomHttpError(StatusCodes.NOT_FOUND, 'Invalid Credentials');
	}

	const isValid = await bcrypt.compare(password, user.password);
	if (!isValid) {
		throw new CustomHttpError(
			StatusCodes.UNAUTHORIZED,
			'Invalid Credentials'
		);
	}

	return {
		username: user.username,
		password: user.password,
	};
};

export const authService = {
	registerUser,
	loginUser,
};
