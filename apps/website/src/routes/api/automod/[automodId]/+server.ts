import { cache } from '$lib/server';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { RAutomod, RUser } from '$lib/scripts/RTypes';

export const GET: RequestHandler = async (event) => {
	const automodId = event.params.automodId;

	const automod = await cache.automods.get(automodId);
	console.log(automod, automodId);
	if (!automod) return error(404);

	return json(automod as GETResponse);
};

export type GETResponse = RAutomod;
