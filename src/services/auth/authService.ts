const registerUser = (username: string, password: string) => {
    return {
        username,
        password
    }
}

export const authService = {
    registerUser
}