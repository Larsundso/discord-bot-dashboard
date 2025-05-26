import { api, cache } from '$lib/server';
import type { RMember } from '../RTypes';

export default async (guildId: string) => {
	const members: Array<RMember> = [];
	let lastId: string | null = null;
	let errored = false;

	do {
		const response = await api.guilds
			.getMembers(guildId, { after: lastId || undefined, limit: 1000 })
			.catch(() => {
				errored = true;
				return null;
			});

		if (!response) break;
		if (lastId === members[0]?.user_id) {
			lastId = null;
			break;
		}

		response.forEach((m) => {
			cache.members.set(undefined, m, guildId);
			cache.users.set(undefined, m.user);
		});

		members.push(...response.map((m) => cache.members.apiToR(m, guildId)));
		lastId = members[0].user_id || null;
	} while (lastId && !errored);

	return members;
};
