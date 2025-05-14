<script lang="ts">
	import './main.css';
	import '$lib/scripts/index';

	import { page } from '$app/state';
	import GuildBar from '$lib/components/GuildBar.svelte';
	import Profile from '$lib/components/Profile.svelte';
	import type { Snippet } from 'svelte';
	import type { LayoutData } from './$types';

	const { data, children }: { data: LayoutData; children: Snippet } = $props();
</script>

<div
	class="flex flex-row justify-start items-start bg-main-dark relative text-poppins h-100vh w-screen of-hidden max-w-full"
>
	{#if page.url.pathname !== '/'}
		<GuildBar guilds={data.guilds} />
		{#if data.self}
			<Profile self={data.self} />
		{/if}
	{/if}

	<div class="bg-main flex-grow of-hidden">
		{@render children()}
	</div>
</div>
