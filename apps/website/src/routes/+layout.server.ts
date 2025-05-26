import type { RGuild } from '$lib/scripts/RTypes';
import { api, cache, redis, savedToken } from '$lib/server';
import type { APIUser } from 'discord-api-types/v10';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async () => {
	if (!savedToken) return { self: null, guilds: [] };

	const self = await redis
		.get('self')
		.then((r) => (r ? (JSON.parse(r) as APIUser) : api.users.getCurrent().catch(() => null)));
	if (!self) {
		console.log('No self found');
		return { self: null, guilds: [] };
	}

	redis.set('self', JSON.stringify(self));

	return { self: await cache.users.get(undefined, self.id), guilds: await getGuilds() };
};

const getGuilds = async () => {
	const guildKeys = await cache.guilds
		.getKeystore(undefined)
		.then((r) => (r ? Object.keys(r) : null));
	if (!guildKeys) return [];

	const limitedKeys = guildKeys.slice(0, 100);

	const batchSize = 10;
	const results: RGuild[] = [];

	for (let i = 0; i < limitedKeys.length; i += batchSize) {
		const batch = limitedKeys.slice(i, i + batchSize);

		try {
			const batchPromises = batch.map(async (key) => {
				try {
					const guildId = key.split(/:/g).at(-1) || '';
					const timeoutPromise = new Promise((_, reject) =>
						setTimeout(() => reject(new Error('Timeout')), 2000),
					);

					const result = (await Promise.race([
						cache.guilds.get(undefined, guildId),
						timeoutPromise,
					])) as RGuild | null;

					return result;
				} catch (error) {
					return null;
				}
			});

			const batchResults = await Promise.all(batchPromises);
			const validGuilds = batchResults.filter((guild) => guild != null);
			results.push(...validGuilds);
		} catch (error) {
			console.warn(`Guild batch ${i}-${i + batchSize} failed:`, error);
		}
	}

	return results;
};
