import { cache, redis } from '$lib/server';
import { redirect } from '@sveltejs/kit';
import { ChannelType, type APIUser } from 'discord-api-types/v10';
import type { LayoutServerLoad } from './$types';
import type { RChannel } from '$lib/scripts/RTypes';

export const load: LayoutServerLoad = async (event) => {
	const guildId = event.params.guildId;

	const guild = await cache.guilds.get(guildId);
	if (!guild) throw redirect(302, '/@me');

	const fetched = await redis.hget('fetched', guildId);
	const sessionStart = event.cookies.get('sessionStart');
	if (!fetched || fetched !== sessionStart) {
		event.fetch(`/api/guilds/${guildId}/init`);
		redis.hset('fetched', guildId, String(sessionStart));
	}

	return { guild, channels: await getChannels(guildId) };
};

const getChannels = async (guildId: string) => {
	const channelKeys = await cache.channels
		.getKeystore(guildId)
		.then((r) => (r ? Object.keys(r) : []));
	const channels = await Promise.all(
		channelKeys.map((k) => cache.channels.get(k.split(/:/g).at(-1) || '')),
	).then((r) => r.filter((c) => !!c));

	const sortedChannels: { parent: RChannel; channels: RChannel[] }[] = [];

	channels
		.filter((c) => !c.parent_id)
		.forEach((channel) => sortedChannels.push({ parent: channel, channels: [] }));

	channels
		.filter((c) => c.parent_id)
		.forEach((channel) => {
			const parent = sortedChannels.find((p) => p.parent.id === channel.parent_id);
			if (!parent) return;
			parent.channels.push(channel);
		});

	sortedChannels.sort((a, b) => a.parent.position - b.parent.position);
	sortedChannels.forEach((p) => p.channels.sort((a, b) => a.position - b.position));

	const nonCategoryChannels = sortedChannels.filter(
		(c) => c.channels.length === 0 && c.parent.type !== ChannelType.GuildCategory,
	);
	const categoryChannels = sortedChannels.filter(
		(c) => !(c.channels.length === 0 && c.parent.type !== ChannelType.GuildCategory),
	);

	nonCategoryChannels.sort((a, b) => a.parent.position - b.parent.position);

	const finalSortedChannels = [...nonCategoryChannels, ...categoryChannels];

	return finalSortedChannels.map((c) => [c.parent, ...c.channels]).flat();
};
