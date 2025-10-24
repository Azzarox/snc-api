import { users } from "../../controllers/auth/authController";

const registerUser = (username: string, password: string) => {
    const user = {
        username,
        password
    }

    users.push(user);
    return user;
}

export const authService = {
    registerUser
}