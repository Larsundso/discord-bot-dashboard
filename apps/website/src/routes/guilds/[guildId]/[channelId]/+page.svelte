<script lang="ts">
	import { page } from '$app/state';
	import getTimestampFromID from '$lib/scripts/util/getTimestampFromID';
	import { CacheEvents } from '@discord-bot-dashboard/cache/src/BaseClient/Cluster/Events';
	import { source } from 'sveltekit-sse';
	import type { PageServerData } from './$types';

	const { data: initialData }: { data: PageServerData } = $props();
	let messages = $derived(initialData.messages);

	const connection = source(`/api/channels/${page.params.channelId}/messages`, {
		options: { method: 'GET' },
	});
	const channel = connection.select(CacheEvents.messageCreate);

	channel.subscribe((run) => {
		if (!run) return;

		const parsed = JSON.parse(run) as (typeof initialData.messages)[number];
		messages = [...messages, parsed];
	});

	const sortedMessages = $derived(
		[...messages].sort((a, b) => getTimestampFromID(b.id) - getTimestampFromID(a.id)),
	);
</script>

<div class="w-full h-full flex flex-col-reverse justify-start items-start gap-5 p-5">
	{#each sortedMessages as message}
		<div class="flex flex-row message gap-2">
			<img src={message.author?.avatar_url} alt="" class="w-10 h-10 rounded-full" />
			<div class="flex flex-col justify-start items-start">
				<span>{message.member?.nick || message.author?.global_name || message.author?.username}</span>
				<span>{message.content}</span>
			</div>
		</div>
	{/each}
</div>
