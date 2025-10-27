import { User } from '../schemas/models/userEntitySchema';

export interface ContextState {
}
declare module 'koa' {
  interface DefaultState extends ContextState {
  }
}