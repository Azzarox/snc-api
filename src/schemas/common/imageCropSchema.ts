import z from 'zod';

const croppedAreaPixelsSchema = z.object({
	x: z.number().int().nonnegative(),
	y: z.number().int().nonnegative(),
	width: z.number().int().positive(),
	height: z.number().int().positive(),
});

export const imageCropSchema = z.object({
	croppedAreaPixels: z
		.string()
		.transform((val) => JSON.parse(val))
		.pipe(croppedAreaPixelsSchema)
		.optional(),
});

export type ImageCropPayload = z.infer<typeof imageCropSchema>;
