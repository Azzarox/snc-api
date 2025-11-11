import { cloudinary } from '../../../config/cloudinaryConfig';
import { UploadApiResponse } from 'cloudinary';

export interface UploadResult {
	url: string;
	publicId: string;
}

const MAIN_FOLDER = 'stringhub/';

export const cloudinaryService = {
	uploadImage(fileBuffer: Buffer, folderPath: string): Promise<UploadResult> {
		return new Promise((resolve, reject) => {
			const uploadStream = cloudinary.uploader.upload_stream(
				{
					folder: `${MAIN_FOLDER}${folderPath}`,
					resource_type: 'image',
					transformation: [{ width: 1000, height: 1000, crop: 'limit' }, { quality: 'auto' }, { fetch_format: 'auto' }],
				},
				(error, result: UploadApiResponse | undefined) => {
					if (error || !result) {
						reject(error || new Error('Upload failed'));
					} else {
						resolve({
							url: result.secure_url,
							publicId: result.public_id,
						});
					}
				}
			);

			uploadStream.end(fileBuffer);
		});
	},

	async deleteImage(publicId: string): Promise<void> {
		await cloudinary.uploader.destroy(publicId);
	},
};
