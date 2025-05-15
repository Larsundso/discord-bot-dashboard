<script lang="ts">
	import cache from '$lib/scripts/cache';
	import type { RRole } from '$lib/scripts/RTypes';
	import { onMount } from 'svelte';

	const { id }: { id: string } = $props();
	let data: RRole | null = $state(null);

	onMount(async () => {
		data = await cache.roles.get(id).catch(() => null);
	});
</script>

<span
	class="mention flex flex-ow justify-center items-center mx-1"
	style={`color: #${data?.color ? `${data.color.toString(16).padStart(6, '0')}` : 'fff'};`}
>
	{#if data}
		@
		{#if data.unicode_emoji}
			{data.unicode_emoji}
		{:else if data.icon_url}
			<img src={data.icon_url} alt="" class="w-6 h-6" />
		{/if}
		{data.name}
	{:else}
		<span class="mention flex flex-row justify-center items-center">@&{id}</span>
	{/if}
</span>
