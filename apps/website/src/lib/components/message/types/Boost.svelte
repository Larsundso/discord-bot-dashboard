<script lang="ts">
	import Timestamp from '$lib/components/form/Timestamp.svelte';
	import User from '$lib/components/mentions/User.svelte';
	import type { RMember, RMessage, RUser } from '$lib/scripts/RTypes';
	import getTimestampFromID from '$lib/scripts/util/getTimestampFromID';
	import { MessageType } from 'discord-api-types/v10';

	const { message }: { message: RMessage & { author?: RUser; member?: RMember } } = $props();
</script>

<div class="flex flex-row -ml-1 color-alt-text items-center gap-2">
	<div class="text-xs color-alt-text">
		<Timestamp time={getTimestampFromID(message.id)} type="R" autoConvert={true} />
	</div>

	<i class="i-tabler-diamonds-filled block w-6 h-6 color-purple-6"></i>
	<User id={message.author_id} />
	has boosted the server.

	{#if message.type !== MessageType.GuildBoost}
		The server is now boosted to level
		{#if message.type === MessageType.GuildBoostTier1}
			1.
		{:else if message.type === MessageType.GuildBoostTier2}
			2.
		{:else if message.type === MessageType.GuildBoostTier3}
			3.
		{:else}
			?.
		{/if}
	{/if}
</div>
