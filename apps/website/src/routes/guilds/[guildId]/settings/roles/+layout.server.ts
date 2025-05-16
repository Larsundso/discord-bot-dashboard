import { cache } from '$lib/server';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {
	const roleKeys = await cache.roles.getKeystore(event.params.guildId).then((r) => Object.keys(r));
	if (!roleKeys.length) return { roles: [] };

	const roles = await Promise.all(
		roleKeys.map((key) => cache.roles.get(key.split(/:/g).at(-1)!)),
	).then((r) => r.filter((role) => !!role).sort((a, b) => b.position - a.position));
	if (!roles.length) return { roles: [] };

	return { roles };
};
