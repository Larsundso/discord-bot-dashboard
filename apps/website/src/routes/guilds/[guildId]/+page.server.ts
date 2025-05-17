import { cache } from '$lib/server';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const roleKeys = await cache.roles.getKeystore(event.params.guildId).then((r) => Object.keys(r));
	const roles = await Promise.all(
		roleKeys.map((key) => cache.roles.get(key.split(/:/g).at(-1)!)),
	).then((r) => r.filter((d) => !!d));

	const emojiKeys = await cache.emojis.getKeystore(event.params.guildId).then((r) => Object.keys(r));
	const emojis = await Promise.all(
		emojiKeys.map((key) => cache.emojis.get(key.split(/:/g).at(-1)!)),
	).then((r) => r.filter((d) => !!d));

	const stickerKeys = await cache.stickers
		.getKeystore(event.params.guildId)
		.then((r) => Object.keys(r));
	const stickers = await Promise.all(
		stickerKeys.map((key) => cache.stickers.get(key.split(/:/g).at(-1)!)),
	).then((r) => r.filter((d) => !!d));

	const soundKeys = await cache.soundboards
		.getKeystore(event.params.guildId)
		.then((r) => Object.keys(r));
	const sounds = await Promise.all(
		soundKeys.map((key) => cache.soundboards.get(key.split(/:/g).at(-1)!)),
	).then((r) => r.filter((d) => !!d));

	return { roles, emojis, stickers, sounds };
};
