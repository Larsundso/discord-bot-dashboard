<script lang="ts">
	import { afterNavigate, beforeNavigate, invalidateAll } from '$app/navigation';
	import type { RUser } from '$lib/scripts/RTypes';
	import { onMount } from 'svelte';

	const { id }: { id: string } = $props();
	let user: RUser | null = $derived(null);
	let interval: null | NodeJS.Timeout = null;

	const get = async () => {
		const res = await fetch(`/api/users/${id}`)
			.then((r) => (r.status === 200 ? (r.json() as Promise<RUser>) : null))
			.catch(() => Promise.resolve(null));

		user = res;
	};

	onMount(() => {
		get();
		if (user) return;

		interval = setInterval(async () => {
			await get();
			if (user && interval) clearInterval(interval);
		}, 1000);

		return () => {
			if (interval) clearInterval(interval);
			invalidateAll();
		};
	});
</script>

<div class="mention flex flex-row justify-center items-center gap-1 w-max">
	{#if user}
		@
		<img src={user.avatar_url} alt="" class="w-5 h-5 rounded-full" />
		{user.global_name}
	{:else}
		<span class="mention flex flex-row justify-center items-center">{id}</span>
	{/if}
</div>
