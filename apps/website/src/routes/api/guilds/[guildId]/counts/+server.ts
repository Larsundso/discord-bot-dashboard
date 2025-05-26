import { cache } from '$lib/server';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async (event) => {
	const guild = await cache.guilds.get(undefined, event.params.guildId);
	if (!guild) return error(404);

	return json({
		members: guild.approximate_member_count || 0,
		online: guild.approximate_presence_count || 0,
	});
};
