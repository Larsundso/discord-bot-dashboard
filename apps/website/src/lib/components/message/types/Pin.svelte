<script lang="ts">
	import Timestamp from '$lib/components/form/Timestamp.svelte';
	import User from '$lib/components/mentions/User.svelte';
	import type { RMessage } from '$lib/scripts/RTypes';
	import getTimestampFromID from '$lib/scripts/util/getTimestampFromID';

	const { message }: { message: RMessage } = $props();
</script>

<div class="flex flex-row justify-start items-center gap-2">
	<div class="text-xs color-alt-text">
		<Timestamp time={getTimestampFromID(message.id)} type="R" />
	</div>

	<User id={message.author_id} /> pinned a message to the channel.
</div>
