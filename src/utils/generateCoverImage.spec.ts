import { generateDefaultCoverUrl } from './generateCoverImage';

describe('generateDefaultCoverUrl', () => {
	it('should generate GeoPattern data URI with correct userId seed', () => {
		const userId = 1;

		const url = generateDefaultCoverUrl(userId);

		expect(url).toContain('data:image/svg+xml');
		expect(url).toContain('base64');
	});

	it('should generate consistent URL for same userId', () => {
		const userId = 123;

		const url1 = generateDefaultCoverUrl(userId);
		const url2 = generateDefaultCoverUrl(userId);

		expect(url1).toBe(url2);
	});

	it('should generate different URLs for different userIds', () => {
		const userId1 = 1;
		const userId2 = 2;

		const url1 = generateDefaultCoverUrl(userId1);
		const url2 = generateDefaultCoverUrl(userId2);

		expect(url1).not.toBe(url2);
	});

	it('should return data URI format', () => {
		const userId = 999;

		const url = generateDefaultCoverUrl(userId);

		expect(url).toMatch(/^data:image\/svg\+xml;base64,/);
	});
});
