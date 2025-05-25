import { cache, redis } from '$lib/server';
import type { LayoutServerLoad } from './$types';
import type { APIUser } from 'discord-api-types/v10';

export const load: LayoutServerLoad = async () => {
	const selfS = await redis.get('self');
	if (!selfS) return { self: null, guilds: [] };

	const self = JSON.parse(selfS) as APIUser;

	return { self: await cache.users.get(self.id), guilds: await getGuilds() };
};

const getGuilds = async () => {
	const guildKeys = await cache.guilds.getKeystore().then((r) => (r ? Object.keys(r) : null));
	if (!guildKeys) return [];

	const limitedKeys = guildKeys.slice(0, 100);

	const batchSize = 10;
	const results = [];

	for (let i = 0; i < limitedKeys.length; i += batchSize) {
		const batch = limitedKeys.slice(i, i + batchSize);

		try {
			const batchPromises = batch.map(async (key) => {
				try {
					const guildId = key.split(/:/g).at(-1) || '';
					const timeoutPromise = new Promise((_, reject) =>
						setTimeout(() => reject(new Error('Timeout')), 2000),
					);

					const result = await Promise.race([cache.guilds.get(guildId), timeoutPromise]);

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
