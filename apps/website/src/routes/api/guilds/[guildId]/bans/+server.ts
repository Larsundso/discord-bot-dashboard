import { api, cache } from '$lib/server';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { APIBan } from 'discord-api-types/v10';
import type { RUser } from '$lib/scripts/RTypes';

export const GET: RequestHandler = async (event) => {
	const after = event.url.searchParams.get('after');
	const before = event.url.searchParams.get('before');
	const limit = event.url.searchParams.get('limit');

	const bans = await api.guilds
		.getMemberBans(event.params.guildId, {
			after: after || undefined,
			before: before || undefined,
			limit: limit ? parseInt(limit) : 100,
		})
		.catch(() => [])
		.then((r) => r.map((ban) => ({ ...ban, user: cache.users.apiToR(ban.user) })));

	return json(bans as GETResponse);
};

export type GETResponse = (Omit<APIBan, 'user'> & { user: RUser })[];
