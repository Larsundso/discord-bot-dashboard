<script lang="ts">
	import ChannelBar from '$lib/components/ChannelBar.svelte';
	import { type Snippet } from 'svelte';
	import type { LayoutData } from './$types';

	const { children, data }: { children: Snippet; data: LayoutData } = $props();
</script>

<div
	class="flex flex-row justify-start items-start bg-main-dark relative  h-100vh w-full"
>
	<ChannelBar channels={data.channels || []} guild={data.guild} />

	<div class="flex-grow of-y-auto of-x-hidden h-full">
		{@render children()}
	</div>
</div>
