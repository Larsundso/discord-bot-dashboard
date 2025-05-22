<script lang="ts">
	import type { RChannel, RGuild } from '$lib/scripts/RTypes';
	import { onMount } from 'svelte';
	import ChannelIcon from '../ChannelIcon.svelte';
	import cache from '$lib/scripts/cache';

	const { id, guild }: { id: string; guild?: RGuild } = $props();
	let data: RChannel | null = $state(null);

	onMount(async () => {
		data = await cache.channels.get(id).catch(() => null);
	});
</script>

<span class="mention flex flex-rew justify-center items-center mx-1">
	{#if data}
		#<ChannelIcon channel={data} {guild} /> {data.name}
	{:else}
		<span class="flex flex-row justify-center items-center">#{id}</span>
	{/if}
</span>
