import { api, cache } from '$lib/server';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async (event) => {
	const invites = await api.guilds.getInvites(event.params.guildId).catch((e) => null);
	if (!invites) return json({ invites: [] });

	invites.forEach((i) => cache.invites.set(i));

	return json({ invites: invites.map((i) => cache.invites.apiToR(i)).filter((i) => !!i) });
};
