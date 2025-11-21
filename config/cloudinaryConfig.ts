import { v2 as cloudinary } from 'cloudinary';
import { envConfig } from './envConfig';

cloudinary.config({
	cloudinary_url: envConfig.CLOUDINARY_URL,
});

export { cloudinary };
