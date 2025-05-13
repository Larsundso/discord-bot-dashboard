<script lang="ts">
	import type { RChannel, RGuild } from '$lib/scripts/RTypes';
	import { onMount } from 'svelte';
	import ChannelIcon from '../ChannelIcon.svelte';

	const { id, guild }: { id: string; guild: RGuild } = $props();
	let data: RChannel | null = $state(null);

	onMount(async () => {
		data = await fetch(`/api/channels/${id}`)
			.then((r) => r.json() as Promise<RChannel>)
			.catch(() => Promise.resolve(null));
	});
</script>

<span class="mention flex flex-rew justify-center items-center">
	{#if data}
		<ChannelIcon channel={data} {guild} /> {data.name}
	{:else}
		<span class="mention flex flex-row justify-center items-center">{id}</span>
	{/if}
</span>
