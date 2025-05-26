import { cache } from '$lib/server';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async (event) => {
	const offset = parseInt(event.url.searchParams.get('offset') || '0');
	const limit = parseInt(event.url.searchParams.get('limit') || '50');

	const guildKeys = await cache.guilds
		.getKeystore(undefined)
		.then((r) => (r ? Object.keys(r) : null));
	if (!guildKeys) return json([]);

	const batchKeys = guildKeys.slice(offset, offset + limit);

	try {
		const batchSize = 10;
		const results = [];

		for (let i = 0; i < batchKeys.length; i += batchSize) {
			const batch = batchKeys.slice(i, i + batchSize);

			const batchPromises = batch.map(async (key) => {
				try {
					const guildId = key.split(/:/g).at(-1) || '';
					const timeoutPromise = new Promise((_, reject) =>
						setTimeout(() => reject(new Error('Timeout')), 2000),
					);

					const result = await Promise.race([cache.guilds.get(undefined, guildId), timeoutPromise]);

					return result;
				} catch (error) {
					return null;
				}
			});

			const batchResults = await Promise.all(batchPromises);
			const validGuilds = batchResults.filter((guild) => guild != null);
			results.push(...validGuilds);
		}

		return json(results);
	} catch (error) {
		console.error('Failed to load more guilds:', error);
		return json([]);
	}
};
