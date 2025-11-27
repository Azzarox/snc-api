import Router from '@koa/router';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { userController } from '../../controllers/users/userController';
import { userProfileController } from '../../controllers/users/profile/userProfileController';
import { updateUserProfileSchema } from '../../schemas/auth/userProfileSchema';
import { imageCropSchema } from '../../schemas/common/imageCropSchema';
import { validate } from '../../middlewares/validationMiddleware';
import { uploadSingleImage } from '../../middlewares/uploadMiddleware';
import { paramsSchema } from '../../schemas/common/paramsSchema';
import { postController } from '../../controllers/posts/postController';
import { getPostQuerySchema } from '../../schemas/posts/getPostQuerySchema';

export const userRouter = new Router({
	prefix: '/users',
});

userRouter.get('/', authMiddleware, userController.getAllUsers);
userRouter.get(
	'/:id/posts',
	authMiddleware,
	validate({ params: paramsSchema, query: getPostQuerySchema }),
	postController.getAllUserPosts
);

// TODO: Move the profile router to own router .use(userProfileRouter)
userRouter.get('/profile', authMiddleware, userProfileController.getCurrentUserProfile);

userRouter.get('/:id/profile', authMiddleware, validate({ params: paramsSchema }), userProfileController.getProfileByUserId);

userRouter.patch(
	'/profile',
	authMiddleware,
	validate({ body: updateUserProfileSchema }),
	userProfileController.updateCurrentUserProfile
);

userRouter.put('/profile/avatar', authMiddleware, uploadSingleImage('image'), userProfileController.uploadAvatar);
userRouter.delete('/profile/avatar', authMiddleware, userProfileController.removeAvatar);

userRouter.put(
	'/profile/cover',
	authMiddleware,
	uploadSingleImage('image'),
	validate({ body: imageCropSchema }),
	userProfileController.uploadCover
);
userRouter.delete('/profile/cover', authMiddleware, userProfileController.removeCover);
