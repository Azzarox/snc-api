type User = {
	id: number;
	username: string;
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
