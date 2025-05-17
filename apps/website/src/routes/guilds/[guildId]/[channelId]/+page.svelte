<script lang="ts">
	import { page } from '$app/state';
	import Boost from '$lib/components/message/types/Boost.svelte';
	import Message from '$lib/components/message/types/Default.svelte';
	import Join from '$lib/components/message/types/Join.svelte';
	import Pin from '$lib/components/message/types/Pin.svelte';
	import StageEnd from '$lib/components/message/types/StageEnd.svelte';
	import StageSpeaker from '$lib/components/message/types/StageSpeaker.svelte';
	import StageStart from '$lib/components/message/types/StageStart.svelte';
	import cache from '$lib/scripts/cache';
	import getTimestampFromID from '$lib/scripts/util/getTimestampFromID';
	import { CacheEvents } from '@discord-bot-dashboard/cache/src/BaseClient/Cluster/Events';
	import { MessageType } from 'discord-api-types/v10';
	import type { PageParentData, PageServerData } from './$types';

	const { data }: { data: PageServerData & PageParentData } = $props();
	let messages = $derived(data.messages);
	let lastEl: HTMLDivElement;

	$effect(() => {
		lastEl.scrollIntoView({ behavior: 'instant', block: 'start', inline: 'start' });

		const postChannel = cache.emitter.get(CacheEvents.messageCreate)!;
		const patchChannel = cache.emitter.get(CacheEvents.messageUpdate)!;
		const deleteChannel = cache.emitter.get(CacheEvents.messageDelete)!;

		const postUnsub = postChannel.subscribe((run) => {
			if (!run) return;

			const parsed = JSON.parse(run) as (typeof data.messages)[number];
			if (parsed.channel_id !== page.params.channelId) return;

			lastEl.scrollIntoView({ behavior: 'instant', block: 'start', inline: 'start' });
			messages = [...messages, parsed];
		});

		const patchUnsub = patchChannel.subscribe((run) => {
			if (!run) return;

			const parsed = JSON.parse(run) as (typeof data.messages)[number];
			if (parsed.channel_id !== page.params.channelId) return;

			messages = messages.map((message) => (message.id === parsed.id ? parsed : message));
		});

		const deleteUnsub = deleteChannel.subscribe((run) => {
			if (!run) return;

			const parsed = JSON.parse(run) as (typeof data.messages)[number];
			if (parsed.channel_id !== page.params.channelId) return;

			messages = messages.filter((message) => message.id !== parsed.id);
		});

		return () => {
			postUnsub();
			patchUnsub();
			deleteUnsub();
		};
	});

	const sortedMessages = $derived(
		[...messages].sort((a, b) => getTimestampFromID(b.id) - getTimestampFromID(a.id)),
	);
</script>

<div class="flex flex-col-reverse justify-start items-start p-5 pb-0 min-h-full">
	<div class="invisible h-0" bind:this={lastEl}></div>

	{#each sortedMessages as message}
		<div class="invisible mt-5"></div>

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
