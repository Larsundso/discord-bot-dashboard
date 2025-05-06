import type { APIUser } from 'discord-api-types/v10';

export default (user: APIUser) => {
	if (!user.avatar) {
		return `https://cdn.discordapp.com/embed/avatars/${user.discriminator === '0' ? Number(BigInt(user.id) >> 22n) % 6 : Number(user.discriminator) % 5}.png`;
	}

	const format = user.avatar.startsWith('a_') ? 'gif' : 'webp';
	return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${format}`;
};
