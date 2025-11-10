type User = {
	id: number;
	username: string;
	email: string;
};

type UserJWT = User & {
	iat: number;
	exp: number;
};

export interface ContextState {
	user: UserJWT;
}

declare module 'koa' {
	interface DefaultState extends ContextState {}
}
