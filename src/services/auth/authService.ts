import { StatusCodes } from 'http-status-codes';
import { CustomHttpError } from '../../common/errors/CustomHttpError';
import * as bcrypt from 'bcryptjs';
import { envConfig } from '../../../config/envConfig';

const users: { username: string; password: string }[] = [];
import { createToken } from "../../utils/createToken";

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
        throw new CustomHttpError(StatusCodes.UNAUTHORIZED, 'Invalid Credentials')
    }
    
    const payload = { username: user.username };
    const accessToken = createToken(payload);

    return {
        accessToken
    };
}

export const authService = {
	users,
	registerUser,
	loginUser,
};
