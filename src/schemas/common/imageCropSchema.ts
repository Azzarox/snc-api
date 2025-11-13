import z from 'zod';

export const imageCropSchema = z.object({
	cropX: z.string().transform((val) => parseInt(val, 10)).pipe(z.number().int().nonnegative()).optional(),
	cropY: z.string().transform((val) => parseInt(val, 10)).pipe(z.number().int().nonnegative()).optional(),
	cropWidth: z.string().transform((val) => parseInt(val, 10)).pipe(z.number().int().positive()).optional(),
	cropHeight: z.string().transform((val) => parseInt(val, 10)).pipe(z.number().int().positive()).optional(),
}).superRefine((data, ctx) => {
	const hasSome = data.cropX !== undefined || data.cropY !== undefined ||
	                data.cropWidth !== undefined || data.cropHeight !== undefined;
	const hasAll = data.cropX !== undefined && data.cropY !== undefined &&
	               data.cropWidth !== undefined && data.cropHeight !== undefined;

	if (hasSome && !hasAll) {
		ctx.addIssue({
			code: 'custom',
			message: 'All crop parameters (cropX, cropY, cropWidth, cropHeight) must be provided together',
			path: ['body'],
		});
	}
});

export type ImageCropPayload = z.infer<typeof imageCropSchema>;
