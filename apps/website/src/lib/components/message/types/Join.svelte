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
		<Timestamp time={getTimestampFromID(message.id)} type="R" />
	</div>

	<i class="i-tabler-door-exit block w-6 h-6"></i>
	<User id={message.author_id} />
	has joined the server.
</div>
