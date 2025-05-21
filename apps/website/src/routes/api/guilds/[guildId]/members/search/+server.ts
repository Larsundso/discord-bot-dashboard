import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { cache } from '$lib/server';
import stringSimilarity from 'string-similarity';
import type { RMember, RUser } from '$lib/scripts/RTypes';

export const GET: RequestHandler = async (event) => {
	const query = event.url.searchParams.get('query');
	if (!query) return json([]);

	const memberKeys = await cache.members
		.getKeystore(event.params.guildId)
		.then((r) => Object.keys(r));

	const users = await Promise.all(
		memberKeys.map((key) => cache.users.get(key.split(/:/g).at(-1)!)),
	).then((r) => r.filter((m) => !!m));

	const members = await Promise.all(
		memberKeys.map((key) => cache.members.get(event.params.guildId, key.split(/:/g).at(-1)!)),
	).then((r) =>
		r.filter((m) => !!m).map((m) => ({ ...m, user: users.find((u) => u.id === m.user_id) })),
	);

	const filtered = members.filter(
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
	) as GETResponse;

	return json(filtered as GETResponse);
};

export type GETResponse = ({ user: RUser | undefined } & RMember)[];
