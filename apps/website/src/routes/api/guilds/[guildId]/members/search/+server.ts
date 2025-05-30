import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { cache } from '$lib/server';
import stringSimilarity from 'string-similarity';
import type { RMember, RUser } from '$lib/scripts/RTypes';
import getChunks from '$lib/scripts/util/getChunks';

export const GET: RequestHandler = async (event) => {
	const query = event.url.searchParams.get('query');
	if (!query) return json([]);

	const memberKeys = await cache.members
		.getKeystore(undefined, event.params.guildId)
		.then((r) => Object.keys(r));

	const memberChunks = getChunks(memberKeys, 1000);

	let filtered: (RMember & { user: RUser | undefined })[] = [];

	for (const chunk of memberChunks) {
		const users = await Promise.all(
			memberKeys.map((key) => cache.users.get(undefined, key.split(/:/g).at(-1)!)),
		).then((r) => r.filter((m) => !!m));

		const members = await Promise.all(
			chunk.map((key) => cache.members.get(undefined, event.params.guildId, key.split(/:/g).at(-1)!)),
		).then((r) =>
			r.filter((m) => !!m).map((m) => ({ ...m, user: users.find((u) => u.id === m.user_id) })),
		);

		filtered = [
			...filtered,
			...(members.filter(
				(m) =>
					m.user?.username.toLowerCase().includes(query.toLowerCase()) ||
					m.user?.global_name?.toLowerCase().includes(query.toLowerCase()) ||
					m.nick?.toLowerCase().includes(query.toLowerCase()) ||
					stringSimilarity.compareTwoStrings(m.user?.username.toLowerCase() || '', query.toLowerCase()) >
						0.8 ||
					stringSimilarity.compareTwoStrings(
						m.user?.global_name?.toLowerCase() || '',
						query.toLowerCase(),
					) > 0.8 ||
					stringSimilarity.compareTwoStrings(m.nick?.toLowerCase() || '', query.toLowerCase()) > 0.8,
			) as GETResponse),
		];

		if (filtered.length >= 100) break;
	}

	return json(filtered as GETResponse);
};

export type GETResponse = ({ user: RUser | undefined } & RMember)[];
