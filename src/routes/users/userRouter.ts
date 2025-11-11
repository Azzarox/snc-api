import Router from '@koa/router';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { userController } from '../../controllers/users/userController';
import { updateUserProfileSchema } from '../../schemas/auth/userProfileSchema';
import { validate } from '../../middlewares/validationMiddleware';
import { uploadSingleImage } from '../../middlewares/uploadMiddleware';

export const userRouter = new Router({
	prefix: '/users',
});

userRouter.get('/', authMiddleware, userController.getAllUsers);

userRouter.get('/profile', authMiddleware, userController.getCurrentUserProfile);
userRouter.patch(
	'/profile',
	authMiddleware,
	validate({ body: updateUserProfileSchema }),
	userController.updateCurrentUserProfile
);

userRouter.put('/profile/avatar', authMiddleware, uploadSingleImage('image'), userController.uploadAvatar);
userRouter.delete('/profile/avatar', authMiddleware, userController.removeAvatar);
