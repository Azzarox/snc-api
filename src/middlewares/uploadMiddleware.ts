import multer from '@koa/multer';
import { CustomHttpError } from '../common/errors/CustomHttpError';
import { StatusCodes } from 'http-status-codes';

const storage = multer.memoryStorage();

const imageFileFilter = (_req: any, file: any, cb: any) => {
	if (file.mimetype.startsWith('image/')) {
		cb(null, true);
	} else {
		throw new CustomHttpError(StatusCodes.BAD_REQUEST, 'Wrong file format! You can upload only images!');
	}
};

const imageUpload = multer({
	storage,
	limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
	fileFilter: imageFileFilter,
});

export const uploadSingleImage = (fieldName: string) => imageUpload.single(fieldName);
export const uploadMultipleImages = (fieldName: string, maxCount: number) =>
	imageUpload.array(fieldName, maxCount);
