import { generateDefaultAvatarUrl } from './generateAvatarImage';

describe('generateDefaultAvatarUrl', () => {
	it('should generate DiceBear URL with correct userId seed', () => {
		const userId = 1;

		const url = generateDefaultAvatarUrl(userId);

		expect(url).toBe('https://api.dicebear.com/9.x/notionists/svg?seed=1');
	});

	it('should generate DiceBear URL with custom style', () => {
		const userId = 123;
		const style = 'avataaars';

		const url = generateDefaultAvatarUrl(userId, style);

		expect(url).toBe('https://api.dicebear.com/9.x/avataaars/svg?seed=123');
	});

	it('should encode userId properly in URL', () => {
		const userId = 999;

		const url = generateDefaultAvatarUrl(userId);

		expect(url).toContain('seed=999');
		expect(url).toContain('https://api.dicebear.com/9.x/notionists/svg');
	});
});
