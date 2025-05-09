export default (element: HTMLElement | null): string => {
	let current = element;
	let backgroundColor;

	while (current) {
		backgroundColor = window.getComputedStyle(current).backgroundColor;

		if (['transparent', 'rgba(0, 0, 0, 0)', ''].includes(backgroundColor)) {
			current = current.parentElement;
		} else break;
	}

	return backgroundColor || 'rgb(255, 255, 255)';
};
