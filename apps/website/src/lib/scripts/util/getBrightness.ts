export default (
	rgba:
		| `rgba(${number}, ${number}, ${number}, ${number})`
		| `rgb(${number}, ${number}, ${number})`
		| `#${string}`
		| string,
) => {
	let r: number, g: number, b: number;

switch (true) {
	case rgba.startsWith('rgba'):
		[r, g, b] = rgba
			.slice(rgba.indexOf('(') + 1, rgba.lastIndexOf(')'))
			.split(',')
			.map((n) => Number(n));
		break;
	case rgba.startsWith('rgb'):
		[r, g, b] = rgba
			.slice(rgba.indexOf('(') + 1, rgba.lastIndexOf(')'))
			.split(',')
			.map((n) => Number(n));
		break;
	case rgba.startsWith('#'):
		r = parseInt(rgba.slice(1, 3), 16);
		g = parseInt(rgba.slice(3, 5), 16);
		b = parseInt(rgba.slice(5, 7), 16);
		break;
	case rgba === 'transparent':
	case rgba === 'rgba(0, 0, 0, 0)':
	case rgba === '':
		r = g = b = 255;
		break;
	default:
		throw new Error('Invalid color format');
}

	return (r * 299 + g * 587 + b * 114) / 1000;
};
