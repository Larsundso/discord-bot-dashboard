import { cache } from '$lib/server';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { RUser } from '$lib/scripts/RTypes';

export const GET: RequestHandler = async (event) => {
	const userId = event.params.userId;

	const user = await cache.users.get(userId);
	if (!user) return error(404);

	return json(user as GETResponse);
};

export type GETResponse = RUser;
