import { cache } from '$lib/server';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const roleKeys = await cache.roles
		.getKeystore(undefined, event.params.guildId)
		.then((r) => Object.keys(r));
	const roles = await Promise.all(
		roleKeys.map((key) => cache.roles.get(undefined, key.split(/:/g).at(-1)!)),
	).then((r) => r.filter((d) => !!d));

	const emojiKeys = await cache.emojis
		.getKeystore(undefined, event.params.guildId)
		.then((r) => Object.keys(r));
	const emojis = await Promise.all(
		emojiKeys.map((key) => cache.emojis.get(undefined, key.split(/:/g).at(-1)!)),
	).then((r) => r.filter((d) => !!d));

	const stickerKeys = await cache.stickers
		.getKeystore(undefined, event.params.guildId)
		.then((r) => Object.keys(r));
	const stickers = await Promise.all(
		stickerKeys.map((key) => cache.stickers.get(undefined, key.split(/:/g).at(-1)!)),
	).then((r) => r.filter((d) => !!d));

	const soundKeys = await cache.soundboards
		.getKeystore(undefined, event.params.guildId)
		.then((r) => Object.keys(r));
	const sounds = await Promise.all(
		soundKeys.map((key) => cache.soundboards.get(undefined, key.split(/:/g).at(-1)!)),
	).then((r) => r.filter((d) => !!d));

	return { roles, emojis, stickers, sounds };
};
