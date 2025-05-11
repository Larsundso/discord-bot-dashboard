<script lang="ts">
	import './main.css';

	import { page } from '$app/state';
	import GuildBar from '$lib/components/GuildBar.svelte';
	import Profile from '$lib/components/Profile.svelte';
	import type { Snippet } from 'svelte';
	import type { LayoutData } from './$types';

	const { data, children }: { data: LayoutData; children: Snippet } = $props();
</script>

<div
	class="flex flex-row justify-start items-start bg-main-dark relative text-poppins overflow-auto h-100vh of-hidden"
>
	{#if page.url.pathname !== '/'}
		<GuildBar guilds={data.guilds} />
		{#if data.self}
			<Profile self={data.self} />
		{/if}
	{/if}

	<div class="bg-main w-full">
		{@render children()}
	</div>
</div>
