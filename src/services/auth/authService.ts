import { StatusCodes } from 'http-status-codes';
import { CustomHttpError } from '../../common/errors/CustomHttpError';

const users: { username: string; password: string }[] = [];

const registerUser = (username: string, password: string) => {
	if (users.find((u) => u.username === username)) {
		throw new CustomHttpError(
			StatusCodes.BAD_REQUEST,
			'User already exists!'
		);
	}

	const user = {
		username,
		password,
	};

	users.push(user);
	return user;
};

export const authService = {
	users,
	registerUser,
};
