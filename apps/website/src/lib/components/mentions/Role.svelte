<script lang="ts">
	import type { RRole } from '$lib/scripts/RTypes';
	import { onMount } from 'svelte';

	const { id }: { id: string } = $props();
	let data: RRole | null = $state(null);

	onMount(async () => {
		data = await fetch(`/api/roles/${id}`)
			.then((r) => r.json() as Promise<RRole>)
			.catch(() => Promise.resolve(null));
	});
</script>

<span class="mention flex flex-rew justify-center items-center mx-1">
	{#if data}
		@{data.name}
	{:else}
		<span class="mention flex flex-row justify-center items-center">{id}</span>
	{/if}
</span>
