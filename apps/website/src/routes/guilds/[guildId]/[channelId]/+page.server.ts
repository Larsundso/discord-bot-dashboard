import { api, cache } from '$lib/server';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const guildId = event.params.guildId;

	const fetchedMessages = await api.channels.getMessages(event.params.channelId, {
		limit: 100,
	});

	const mergedMessages = fetchedMessages.map((m) => cache.messages.apiToR(m, guildId));
	const authorIds = mergedMessages.map((m) => m.author_id);

	const authors = await Promise.all(authorIds.map((m) => cache.users.get(undefined, m))).then((r) =>
		r.filter((m) => !!m),
	);
	const members = await Promise.all(
		authorIds.map((m) => cache.members.get(undefined, guildId, m)),
	).then((r) => r.filter((m) => !!m));

	return {
		messages: mergedMessages.map((m) => ({
			...m,
			author: authors.find((u) => u.id === m.author_id),
			member: members.find((u) => u.user_id === m.author_id),
		})),
	};
};
