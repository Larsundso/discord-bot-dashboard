import type { RSticker } from '$lib/scripts/RTypes';
import { cache } from '$lib/server';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const soundKeys = await cache.soundboards
		.getKeystore(event.params.guildId)
		.then((r) => Object.keys(r));
	const sounds = await Promise.all(
		soundKeys.map((key) => cache.soundboards.get(key.split(/:/g).at(-1)!)),
	).then((r) => r.filter((e) => !!e));

	const emojiKeys = await cache.emojis.getKeystore(event.params.guildId).then((r) => Object.keys(r));
	const emojis = await Promise.all(
		emojiKeys.map((key) => cache.emojis.get(key.split(/:/g).at(-1)!)),
	).then((r) => r.filter((e) => !!e));

	return { sounds, emojis };
};
