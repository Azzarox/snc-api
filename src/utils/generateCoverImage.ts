
import GeoPattern from 'geopattern';

export const generateDefaultCoverUrl = (userId: number): string => {
	const seed = encodeURIComponent(userId);

	const pattern = GeoPattern.generate(seed, {
		color: '#f5f5f5',
		baseColor: '#f5f5f5',
	});

	return pattern.toDataUri();
};