// style = https://www.dicebear.com/styles/notionists/

export const generateDefaultAvatarUrl = (userId: number, style = 'notionists'): string => {
	const seed = encodeURIComponent(userId.toString());
	return `https://api.dicebear.com/9.x/${style}/svg?seed=${seed}`;
};
