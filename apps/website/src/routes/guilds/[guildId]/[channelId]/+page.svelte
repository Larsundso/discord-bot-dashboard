<script lang="ts">
	import { page } from '$app/state';
	import Message from '$lib/components/message/types/Default.svelte';
	import StageEnd from '$lib/components/message/types/StageEnd.svelte';
	import StageSpeaker from '$lib/components/message/types/StageSpeaker.svelte';
	import StageStart from '$lib/components/message/types/StageStart.svelte';
	import getTimestampFromID from '$lib/scripts/util/getTimestampFromID';
	import { CacheEvents } from '@discord-bot-dashboard/cache/src/BaseClient/Cluster/Events';
	import { MessageType } from 'discord-api-types/v10';
	import { source } from 'sveltekit-sse';
	import type { PageParentData, PageServerData } from './$types';
	import Boost from '$lib/components/message/types/Boost.svelte';
	import Join from '$lib/components/message/types/Join.svelte';
	import Pin from '$lib/components/message/types/Pin.svelte';

	const { data }: { data: PageServerData & PageParentData } = $props();
	let messages = $derived(data.messages);

	$effect(() => {
		const connection = source(`/api/channels/${page.params.channelId}/messages`, {
			options: { method: 'GET' },
		});
		const channel = connection.select(CacheEvents.messageCreate);

		const unsubscribe = channel.subscribe((run) => {
			if (!run) return;

			const parsed = JSON.parse(run) as (typeof data.messages)[number];
			messages = [...messages, parsed];
		});

		return () => {
			unsubscribe();
			connection.close();
		};
	});

	const sortedMessages = $derived(
		[...messages].sort((a, b) => getTimestampFromID(b.id) - getTimestampFromID(a.id)),
	);
</script>

<div class="flex flex-col-reverse justify-start items-start gap-5 p-5 min-h-full">
	{#each sortedMessages as message}
		{#if [MessageType.Default, MessageType.ChatInputCommand, MessageType.Reply, MessageType.AutoModerationAction].includes(message.type)}
			<Message {message} guild={data.guild} roles={data.roles} />
		{:else if message.type === MessageType.StageEnd}
			<StageEnd {message} />
		{:else if message.type === MessageType.StageStart}
			<StageStart {message} />
		{:else if message.type === MessageType.StageSpeaker}
			<StageSpeaker {message} />
		{:else if [MessageType.GuildBoost, MessageType.GuildBoostTier1, MessageType.GuildBoostTier2, MessageType.GuildBoostTier3].includes(message.type)}
			<Boost {message} />
		{:else if message.type === MessageType.ChannelPinnedMessage}
			<Pin {message} />
		{:else if message.type === MessageType.UserJoin}
			<Join {message} />
		{:else}
			<span class="color-danger"> Unhandled {MessageType[message.type]} message </span>
		{/if}
	{/each}

	{#if sortedMessages.length === 0}
		<div class="flex-grow">No messages yet</div>
	{/if}
</div>
