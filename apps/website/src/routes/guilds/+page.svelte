<script lang="ts">
	import { CacheEvents } from '@discord-bot-dashboard/cache/src/BaseClient/Cluster/Events';
	import type { PageData } from './$types';
	import { source } from 'sveltekit-sse';
	import type { RGuild } from '$lib/scripts/RTypes';
	import cache from '$lib/scripts/cache';

	const { data }: { data: PageData } = $props();
	let guilds = $derived(data.guilds);

	$effect(() => {
		const postChannel = cache.emitter.get(CacheEvents.guildCreate)!;
		const patchChannel = cache.emitter.get(CacheEvents.guildUpdate)!;
		const deleteChannel = cache.emitter.get(CacheEvents.guildDelete)!;

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
		};
	});

	let query = $state('');
</script>

<section class="h-100vh flex flex-col justify-start items-center of-auto">
	<div class="w-auto relative">
		<input
			type="text"
			placeholder="Search"
			bind:value={query}
			class="mt-5 p-2 border-none rounded-xl text-lg w-120"
		/>
		<button
			class="absolute top-7 right-2 hover:bg-main-light p-1 rounded-lg"
			aria-label="Clear query"
			onclick={() => (query = '')}
			onkeydown={(e) => (e.key === 'Enter' ? (query = '') : null)}
			><i class="i-tabler-x w-5 h-5 block color-main-lighter"></i></button
		>
	</div>

	<div class="flex flex-row justify-center items-center gap-2 w-full flex-wrap mt-5">
		{#each guilds.filter((g) => g.name.toLowerCase().includes(query.toLowerCase())) as guild}
			<a
				class="w-10% flex flex-col justify-center items-center gap-2 relative of-hidden
    hover:scale-105 transition-all duration-100 ease-in-out"
				href={`/guilds/${guild.id}`}
			>
				{#if guild.icon_url}
					<img src={guild.icon_url} alt="" class="rounded-full p-2 w-60px z-2" />
				{:else}
					<div
						class="bg-main-lighter p-1 rounded-full transition-all duration-300 ease-in-out w-60px h-60px flex justify-center items-center color-alt-text hover:color-main-text text-lg of-hidden z-2"
					>
						{guild.name
							.split(/\s+/g)
							.map((w) => w[0].toUpperCase())
							.join('')
							.slice(0, 5)}
					</div>
				{/if}
				<span class="text-center z-2">{guild.name}</span>
			</a>
		{/each}
	</div>
</section>
