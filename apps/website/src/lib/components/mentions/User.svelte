<script lang="ts">
	import type { RUser } from '$lib/scripts/RTypes';

	const { id }: { id: string } = $props();
	let user: RUser | null = $derived(null);
	let interval: null | NodeJS.Timeout = null;

	const get = async () => {
		if (user) return;
		const res = await fetch(`/api/users/${id}`)
			.then((r) => (r.status === 200 ? (r.json() as Promise<RUser>) : null))
			.catch(() => Promise.resolve(null));

		user = res;
	};

	$effect(() => {
		get();
		if (user) return;

		interval = setInterval(async () => {
			await get();
			if (user && interval) clearInterval(interval);
		}, 1000);

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
		<span class="mention flex flex-row justify-center items-center">{id}</span>
	{/if}
</div>
