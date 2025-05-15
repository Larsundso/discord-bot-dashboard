<script lang="ts">
	import './main.css';
	import '$lib/scripts/index';

	import { page } from '$app/state';
	import GuildBar from '$lib/components/GuildBar.svelte';
	import Profile from '$lib/components/Profile.svelte';
	import type { Snippet } from 'svelte';
	import type { LayoutData } from './$types';
	import type { RGuild } from '$lib/scripts/RTypes';
	import { source } from 'sveltekit-sse';
	import { CacheEvents } from '@discord-bot-dashboard/cache/src/BaseClient/Cluster/Events';

	const { data, children }: { data: LayoutData; children: Snippet } = $props();
	let guilds = $derived(data.guilds);

	$effect(() => {
		const postConnection = source(`/api/guilds/events`, {
			options: { method: 'POST' },
		});
		const patchConnection = source(`/api/guilds/events`, {
			options: { method: 'PATCH' },
		});
		const deleteConnection = source(`/api/guilds/events`, {
			options: { method: 'DELETE' },
		});

		const postChannel = postConnection.select(CacheEvents.guildCreate);
		const patchChannel = patchConnection.select(CacheEvents.guildUpdate);
		const deleteChannel = deleteConnection.select(CacheEvents.guildDelete);

		const postUnsub = postChannel.subscribe((run) => {
			if (!run) return;

			const parsed = JSON.parse(run) as RGuild;
			guilds = [...guilds, parsed];
		});

		const patchUnsub = patchChannel.subscribe((run) => {
			if (!run) return;

			const parsed = JSON.parse(run) as RGuild;
			guilds = guilds.map((guild) => (guild.id === parsed.id ? parsed : guild));
		});

		const deleteUnsub = deleteChannel.subscribe((run) => {
			if (!run) return;

			const parsed = JSON.parse(run) as RGuild;
			guilds = guilds.filter((guild) => guild.id !== parsed.id);
		});

		return () => {
			postUnsub();
			patchUnsub();
			deleteUnsub();
			postConnection.close();
			patchConnection.close();
			deleteConnection.close();
		};
	});
</script>

<div
	class="flex flex-row justify-start items-start bg-main-dark relative text-poppins h-100vh w-screen of-hidden max-w-full"
>
	{#if page.url.pathname !== '/'}
		<GuildBar {guilds} />
		{#if data.self}
			<Profile self={data.self} />
		{/if}
	{/if}

	<div class="bg-main flex-grow of-hidden">
		{@render children()}
	</div>
</div>
