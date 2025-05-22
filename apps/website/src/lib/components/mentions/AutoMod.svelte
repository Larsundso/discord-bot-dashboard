<script lang="ts">
	import cache from '$lib/scripts/cache';
	import type { RAutomod } from '$lib/scripts/RTypes';

	const { id }: { id: string } = $props();
	let data: RAutomod | string = $derived(id);
	let color: number[] = $derived([]);

	$effect(() => {
		if (typeof data !== 'string') return;

		cache.automod
			.get(data)
			.catch(() => null)
			.then((res) => {
				if (!res) return;

				data = res;
			});
	});
</script>

<span class="mention flex flex-row justify-center items-center mx-1">
	{#if typeof data !== 'string'}
		<span>{data.name}</span>
	{:else}
		<span class="flex flex-row justify-center items-center">{id}</span>
	{/if}
</span>
