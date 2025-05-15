<script lang="ts">
	import type { RUser } from '$lib/scripts/RTypes';
	import cache from '$lib/scripts/cache';

	const { id }: { id: string } = $props();
	let user: RUser | null = $derived(null);
	let interval: null | NodeJS.Timeout = null;

	const get = async () => {
		const u = await cache.users.get(id).catch(() => null);
		if (user) user = u;
	};

	$effect(() => {
		get();
		if (user) return;

		interval = setInterval(async () => {
			await get();
			if (user && interval) clearInterval(interval);
		}, 10000);

		return () => {
			if (interval) clearInterval(interval);
		};
	});
</script>

<div class="mention flex flex-row justify-center items-center gap-1 w-max mx-1">
	{#if user}
		<span class="text-alt-text">@</span>
		<img src={user.avatar_url} alt="" class="w-5 h-5 rounded-full" />
		{user.global_name || user.username}
	{:else}
		<span class="mention flex flex-row justify-center items-center">@{id}</span>
	{/if}
</div>
