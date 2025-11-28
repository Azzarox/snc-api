import { cloudinaryService } from './cloudinaryService';
import { cloudinary } from '../../../config/cloudinaryConfig';
import { UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';
import { Writable } from 'stream';

jest.mock('../../../config/cloudinaryConfig', () => ({
	cloudinary: {
		uploader: {
			upload_stream: jest.fn(),
			destroy: jest.fn(),
		},
	},
}));

const createMockStream = () => {
	return new Writable({
		write(chunk, encoding, cb) {
			cb();
		},
	});
};

const mockUploadStream = (error: UploadApiErrorResponse | null, result?: Partial<UploadApiResponse>) => {
	(cloudinary.uploader.upload_stream as jest.Mock).mockImplementation((options: any, callback: any) => {
		setImmediate(() => callback(error, result));
		return createMockStream();
	});
};

describe('cloudinaryService Integration Tests', () => {
	afterEach(() => {
		jest.clearAllMocks();
		jest.restoreAllMocks();
	});

	describe('uploadImage', () => {
		const buffer = Buffer.from('fake-image-data');
		const folderPath = '/user/test/avatar';

		it('should successfully upload image with correct transformations', async () => {
			const result = {
				secure_url: 'https://res.cloudinary.com/test/image/upload/v1234/stringhub/user/test/avatar/image.jpg',
				public_id: 'stringhub/user/test/avatar/image123',
			};

			mockUploadStream(null, result);

			const uploadResult = await cloudinaryService.uploadImage(buffer, folderPath);

			expect(uploadResult.url).toBe(result.secure_url);
			expect(uploadResult.publicId).toBe(result.public_id);
			expect(cloudinary.uploader.upload_stream).toHaveBeenCalledWith(
				{
					folder: 'stringhub//user/test/avatar',
					resource_type: 'image',
					transformation: [{ width: 1000, height: 1000, crop: 'limit' }, { quality: 'auto' }, { fetch_format: 'auto' }],
				},
				expect.any(Function)
			);
		});

		it('should handle network errors gracefully', async () => {
			const error: UploadApiErrorResponse = {
				message: 'Network timeout',
				http_code: 500,
			} as UploadApiErrorResponse;

			mockUploadStream(error, undefined);

			await expect(cloudinaryService.uploadImage(buffer, folderPath)).rejects.toEqual(error);
		});

		it('should handle upload failure when result is undefined', async () => {
			mockUploadStream(null, undefined);

			await expect(cloudinaryService.uploadImage(buffer, folderPath)).rejects.toThrow('Upload failed');
		});
	});

	describe('uploadCoverImage', () => {
		const buffer = Buffer.from('fake-cover-data');
		const folderPath = '/user/test/cover';

		it('should successfully upload cover with crop data', async () => {
			const cropData = { x: 10, y: 20, width: 800, height: 400 };
			const result = {
				secure_url: 'https://res.cloudinary.com/test/original.jpg',
				public_id: 'stringhub/user/test/cover/cover123',
				eager: [
					{
						secure_url: 'https://res.cloudinary.com/test/transformed.jpg',
						transformation: 'c_crop,x_10,y_20,w_800,h_400',
					},
				],
			};

			mockUploadStream(null, result);

			const uploadResult = await cloudinaryService.uploadCoverImage(buffer, folderPath, cropData);

			expect(uploadResult.url).toBe('https://res.cloudinary.com/test/transformed.jpg');
			expect(uploadResult.publicId).toBe(result.public_id);
			expect(cloudinary.uploader.upload_stream).toHaveBeenCalledWith(
				{
					folder: 'stringhub//user/test/cover',
					resource_type: 'image',
					eager: [
						{ crop: 'crop', x: 10, y: 20, width: 800, height: 400 },
						{ width: 1600, crop: 'scale' },
						{ quality: 'auto' },
						{ fetch_format: 'auto' },
					],
					eager_async: true,
				},
				expect.any(Function)
			);
		});

		it('should successfully upload cover without crop data', async () => {
			const result = {
				secure_url: 'https://res.cloudinary.com/test/cover.jpg',
				public_id: 'stringhub/user/test/cover/cover456',
			};

			mockUploadStream(null, result);

			const uploadResult = await cloudinaryService.uploadCoverImage(buffer, folderPath);

			expect(uploadResult.url).toBe(result.secure_url);
			expect(uploadResult.publicId).toBe(result.public_id);
			expect(cloudinary.uploader.upload_stream).toHaveBeenCalledWith(
				{
					folder: 'stringhub//user/test/cover',
					resource_type: 'image',
					eager: [{ width: 1600, crop: 'limit' }, { quality: 'auto' }, { fetch_format: 'auto' }],
					eager_async: true,
				},
				expect.any(Function)
			);
		});
	});

	describe('deleteImage', () => {
		it('should successfully delete image', async () => {
			const publicId = 'stringhub/user/test/avatar/image123';

			jest.spyOn(cloudinary.uploader, 'destroy').mockResolvedValue({ result: 'ok' });

			await cloudinaryService.deleteImage(publicId);

			expect(cloudinary.uploader.destroy).toHaveBeenCalledWith(publicId);
		});

		it('should handle delete errors gracefully', async () => {
			const publicId = 'stringhub/user/test/avatar/nonexistent';
			const error = new Error('Resource not found');

			jest.spyOn(cloudinary.uploader, 'destroy').mockRejectedValue(error);

			await expect(cloudinaryService.deleteImage(publicId)).rejects.toThrow('Resource not found');

			expect(cloudinary.uploader.destroy).toHaveBeenCalledWith(publicId);
		});
	});
});
