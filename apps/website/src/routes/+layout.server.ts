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

	return Promise.all(guildKeys.map((key) => cache.guilds.get(key.split(/:/g).at(-1) || ''))).then(
		(r) => r.filter((g) => !!g),
	);
};
