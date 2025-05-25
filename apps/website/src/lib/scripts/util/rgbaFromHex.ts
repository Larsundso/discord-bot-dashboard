export default (hex: string) => {
	if (hex.startsWith('#')) {
		hex = hex.substring(1);
	}

	return [
		parseInt(hex.slice(0, 2), 16),
		parseInt(hex.slice(2, 4), 16),
		parseInt(hex.slice(4, 6), 16),
	];
};
