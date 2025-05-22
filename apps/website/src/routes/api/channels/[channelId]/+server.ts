import { cache } from '$lib/server';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { RChannel } from '$lib/scripts/RTypes';

export const GET: RequestHandler = async (event) => {
	const channelId = event.params.channelId;

	const channel = await cache.channels.get(channelId);
	const thread = await cache.threads.get(channelId);
	if (!channel && !thread) return error(404);

	return json(channel || thread);
};

export type GETResponse = RChannel;
