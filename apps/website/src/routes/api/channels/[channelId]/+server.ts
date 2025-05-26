import { cache } from '$lib/server';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { RChannel, RThread } from '$lib/scripts/RTypes';

export const GET: RequestHandler = async (event) => {
	const channelId = event.params.channelId;

	const channel = await cache.channels.get(undefined, channelId);
	const thread = await cache.threads.get(undefined, channelId);
	if (!channel && !thread) return error(404);

	return json((channel || thread) as GETResponse);
};

export type GETResponse = RChannel | RThread;
