<script lang="ts">
	import cache from '$lib/scripts/cache';
	import type { RRole } from '$lib/scripts/RTypes';
	import rgbaFromHex from '$lib/scripts/util/rgbaFromHex';

	const { id }: { id: string } = $props();
	let data: RRole | string = $derived(id);
	let color: number[] = $derived([]);

	$effect(() => {
		if (typeof data !== 'string') return;

		cache.roles
			.get(data)
			.catch(() => null)
			.then((res) => {
				if (!res) return;

				data = res;
				color = data.color ? rgbaFromHex(data.color.toString(16).padStart(6, '0')) : [];
			});
	});
</script>

<span
	class="mention flex flex-row justify-center items-center mx-1"
	style={`color: rgb(${color.join(', ')});
 background-color: rgba(${color.join(', ')}, 0.3);`}
>
	{#if typeof data !== 'string'}
		@
		{#if data.unicode_emoji}
			{data.unicode_emoji}
		{:else if data.icon_url}
			<img src={data.icon_url} alt="" class="w-6 h-6" />
		{/if}
		{data.name}
	{:else}
		<span class="flex flex-row justify-center items-center">@&{id}</span>
	{/if}
</span>
