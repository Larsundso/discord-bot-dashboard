<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { LayoutServerData, LayoutServerParentData } from './$types';
	import ChannelBar from '$lib/components/ChannelBar.svelte';

	const { children, data }: { children: Snippet; data: LayoutServerData & LayoutServerParentData } =
		$props();
</script>

<div
	class="flex flex-row justify-start items-start bg-main-dark relative text-poppins overflow-auto h-100vh of-hidden"
>
	<ChannelBar channels={data.channels || []} guild={data.guild} />

	{@render children()}
</div>
