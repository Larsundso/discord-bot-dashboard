<script lang="ts">
	import type { RUser } from '$lib/scripts/RTypes';
	import cache from '$lib/scripts/cache';

	const { id }: { id: string } = $props();
	let data: RUser | null = $derived(null);
	let interval: null | NodeJS.Timeout = null;

	const get = async () => {
		const res = await cache.users.get(id).catch(() => null);
		if (res) data = res;
	};

	$effect(() => {
		if (data) return;
		get();

		interval = setInterval(async () => {
			await get();
			if (data && interval) clearInterval(interval);
		}, 1000);

		return () => {
			if (interval) clearInterval(interval);
		};
	});
</script>

<div class="mention flex flex-row justify-center items-center gap-1 w-max mx-1">
	{#if data}
		<span class="text-alt-text">@</span>
		<img src={data.avatar_url} alt="" class="w-5 h-5 rounded-full" />
		{data.global_name || data.username}
	{:else}
		<span class="mention flex flex-row justify-center items-center">@{id}</span>
	{/if}
</div>
