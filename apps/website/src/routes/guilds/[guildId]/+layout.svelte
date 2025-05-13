<script lang="ts">
	import ChannelBar from '$lib/components/ChannelBar.svelte';
	import { type Snippet } from 'svelte';
	import type { LayoutData } from './$types';

	const { children, data }: { children: Snippet; data: LayoutData } = $props();
</script>

<div
	class="flex flex-row justify-start items-start bg-main-dark relative text-poppins overflow-auto h-100vh of-hidden"
>
	<ChannelBar channels={data.channels || []} guild={data.guild} />

	{@render children()}
</div>
