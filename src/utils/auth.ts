import * as bcrypt from 'bcryptjs';

export const comparePasswords = async (password: string, hashedPassword: string) => {
    return await bcrypt.compare(password, hashedPassword);
}

export const hashPassword = async (password: string, salt: number) => {
    return await bcrypt.hash(password, salt);
}