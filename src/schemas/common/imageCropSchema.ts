import z from 'zod';

const croppedAreaPixelsSchema = z.object({
	x: z.number('x must be a number').int('x must be an integer').nonnegative('x must be non-negative'),
	y: z.number('y must be a number').int('y must be an integer').nonnegative('y must be non-negative'),
	width: z.number('width must be a number').int('width must be an integer').positive('width must be greater than 0'),
	height: z.number('height must be a number').int('height must be an integer').positive('height must be greater than 0'),
});

export const imageCropSchema = z.object({
	croppedAreaPixels: z
		.string('croppedAreaPixels must be a string')
		.transform((val) => {
			try {
				return JSON.parse(val);
			} catch (error) {
				throw new Error('croppedAreaPixels must be valid JSON');
			}
		})
		.pipe(croppedAreaPixelsSchema)
		.optional(),
});

export type ImageCropPayload = z.infer<typeof imageCropSchema>;
