<script lang="ts">
	import ChannelSettingsBar from '$lib/components/ChannelSettingsBar.svelte';
	import type { Snippet } from 'svelte';
	import type { LayoutData, LayoutParentData } from './$types';
	import { page } from '$app/state';

	const { children, data }: { children: Snippet; data: LayoutData & LayoutParentData } = $props();
	const channel = $derived.by(() => data.channels.find((c) => c.id === page.params.channelId)!);
</script>

<section
	class="fixed w-100vw h-100vh bg-main-dark left-0 top-0 z-50 flex flex-row justify-start items-start text-poppins of-hidden"
>
	<ChannelSettingsBar guild={data.guild} {channel} />

	<div class="flex-grow of-y-auto of-x-hidden h-full">
		{@render children()}
	</div>
</section>
