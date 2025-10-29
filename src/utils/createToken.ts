import jwt from 'jsonwebtoken';
import { envConfig } from '../../config/envConfig';

const EXPIRES_IN = '1h';

export const createToken = <T extends (string | object | Buffer<ArrayBufferLike>)>(payload: T) => {
    return jwt.sign(payload, envConfig.JWT_SECRET, { expiresIn: EXPIRES_IN })
}