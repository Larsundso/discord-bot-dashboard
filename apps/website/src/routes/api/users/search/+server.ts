import type { RUser } from '$lib/scripts/RTypes';
import getChunks from '$lib/scripts/util/getChunks';
import { cache } from '$lib/server';
import { json } from '@sveltejs/kit';
import stringSimilarity from 'string-similarity';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async (event) => {
	const query = event.url.searchParams.get('query');
	if (!query) return json([]);

	const userKeys = await cache.users.getKeystore().then((r) => Object.keys(r));
	const userChunks = getChunks(userKeys, 100);
	let filtered: RUser[] = [];

	for (const chunk of userChunks) {
		const users = await Promise.all(
			chunk.map((key) => cache.users.get(key.split(/:/g).at(-1)!)),
		).then((r) => r.filter((m) => !!m));

		filtered = [
			...filtered,
			...(users.filter(
				(m) =>
					m.username.toLowerCase().includes(query.toLowerCase()) ||
					m.global_name?.toLowerCase().includes(query.toLowerCase()) ||
					stringSimilarity.compareTwoStrings(m.username.toLowerCase() || '', query.toLowerCase()) >
						0.8 ||
					stringSimilarity.compareTwoStrings(m.global_name?.toLowerCase() || '', query.toLowerCase()) >
						0.8,
			) as GETResponse),
		];

		if (filtered.length >= 25) break;
	}

	return json(filtered as GETResponse);
};

export type GETResponse = RUser[];
