<script lang="ts">
	import { page } from '$app/state';
	import Content from '$lib/components/message/content.svelte';
	import Embed from '$lib/components/message/embed.svelte';
	import getHighestRoleWithColor from '$lib/scripts/util/getHighestRoleWithColor';
	import getTimestampFromID from '$lib/scripts/util/getTimestampFromID';
	import { CacheEvents } from '@discord-bot-dashboard/cache/src/BaseClient/Cluster/Events';
	import { source } from 'sveltekit-sse';
	import type { PageParentData, PageServerData } from './$types';

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
		<div class="flex flex-row message gap-2 w-full max-w-full">
			<img
				src={message.author?.avatar_url}
				alt=""
				class="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex-shrink-0"
			/>
			<div
				class="flex flex-col justify-start items-start max-w-[calc(100%-3rem)] sm:max-w-[calc(100%-3.5rem)] overflow-hidden"
			>
				<span
					class="font-medium truncate max-w-full"
					style={`color: #${
						message.member
							? getHighestRoleWithColor(message.member, data.guild, data.roles)
									.color.toString(16)
									.padStart(6, '0')
							: 'fff'
					}`}
				>
					{message.member?.nick || message.author?.global_name || message.author?.username}
				</span>
				<Content content={message.content} />

				{#each message.embeds as embed}
					<Embed {embed} guild={data.guild} />
				{/each}
			</div>
		</div>
	{/each}

	{#if sortedMessages.length === 0}
		<div class="flex-grow">No messages yet</div>
	{/if}
</div>
