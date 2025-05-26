import type { RGuild } from '$lib/scripts/RTypes';
import { cache, redis } from '$lib/server';
import type { PageServerLoad } from '../$types';

export const load: PageServerLoad = async (event) => {
	const guildKeys = await cache.guilds
		.getKeystore(undefined)
		.then((r) => (r ? Object.keys(r) : null));
	if (!guildKeys) return { guilds: [] };

	const pipeline = redis.pipeline();
	guildKeys.forEach((key) => pipeline.get(key));

	const results = await pipeline.exec();
	const guilds = results
		?.map(([err, data]) => {
			if (err) return null;
			return typeof data === 'string' ? JSON.parse(data) : data;
		})
		.filter((g): g is RGuild => !!g);

	return { guilds: guilds || [] };
};
