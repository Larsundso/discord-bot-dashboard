import {
	CacheEvents,
	type Message,
} from '@discord-bot-dashboard/cache/src/BaseClient/Cluster/Events';
import { cache as Cache } from '..';

const event = CacheEvents.messageCreate;

export default async (cache: typeof Cache, message: string) => {
	if (!cache.listeners.length) return;

	const payload = JSON.parse(message) as Message<typeof event>;

	const messageData = await cache.messages.get(undefined, payload.channel_id, payload.id);
	if (!messageData) return;

	const author = await cache.users.get(undefined, messageData.author_id);
	if (!author) return;

	const member = await cache.members.get(undefined, messageData.guild_id, messageData.author_id);
	if (!member) return;

	cache.listeners.forEach((emit) => emit(event, JSON.stringify({ ...messageData, author, member })));
};
