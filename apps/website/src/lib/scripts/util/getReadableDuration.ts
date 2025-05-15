export default (duration: number) => {
	const seconds = Math.floor(duration % 60);
	const minutes = Math.floor((duration / 60) % 60);
	const hours = Math.floor((duration / (60 * 60)) % 24);
	const days = Math.floor(duration / (60 * 60 * 24));

	if (days > 0) {
		return `${days}d ${hours}h ${minutes}m ${seconds}s`;
	} else if (hours > 0) {
		return `${hours}h ${minutes}m ${seconds}s`;
	} else if (minutes > 0) {
		return `${minutes}m ${seconds}s`;
	} else {
		return `${seconds}s`;
	}
};
