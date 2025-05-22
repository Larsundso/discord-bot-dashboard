<script lang="ts">
	import { CacheEvents } from '@discord-bot-dashboard/cache/src/BaseClient/Cluster/Events';
	import type { PageData } from './$types';
	import { source } from 'sveltekit-sse';
	import type { RGuild } from '$lib/scripts/RTypes';
	import cache from '$lib/scripts/cache';
	import Button from '$lib/components/form/Button.svelte';

	const { data }: { data: PageData } = $props();
	let guilds = $derived(data.guilds);
	let shownGuilds = $derived(guilds.slice(0, 500));
	let lastPage = $state(1);

	const prev = () => {
		lastPage = lastPage - 1;
		if (lastPage < 1) lastPage = 1;
		shownGuilds = guilds.slice(lastPage * 500 - 500, lastPage * 500);
	};

	const next = () => {
		lastPage = lastPage + 1;
		if (lastPage > Math.ceil(guilds.length / 500)) lastPage = Math.ceil(guilds.length / 500);
		shownGuilds = guilds.slice(lastPage * 500 - 500, lastPage * 500);
	};

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
	<div class="w-auto relative flex flex-row justify-between items-center gap-2">
		<div class="mt-5">
			<Button
				emoji={{ animated: false, id: '◀️' }}
				text=""
				style="secondary-outline"
				onclick={() => prev()}
				disabled={lastPage === 1}
			/>
		</div>

		<input
			type="text"
			placeholder="Search"
			bind:value={query}
			class="mt-5 p-2 border-none rounded-xl text-lg w-120"
		/>
		<button
			class="absolute top-7 right-25 hover:bg-main-light p-1 rounded-lg"
			aria-label="Clear query"
			onclick={() => (query = '')}
			onkeydown={(e) => (e.key === 'Enter' ? (query = '') : null)}
		>
			<i class="i-tabler-x w-5 h-5 block color-main-lighter"></i>
		</button>

		<div class="mt-5">
			<Button
				emoji={{ animated: false, id: '▶️' }}
				text=""
				style="secondary-outline"
				onclick={() => next()}
				disabled={lastPage === Math.ceil(guilds.length / 500)}
			/>
		</div>
	</div>

	<div class="flex flex-row justify-center items-center gap-2 w-full flex-wrap mt-5">
		{#each query ? guilds.filter((g) => g.name
						.toLowerCase()
						.includes(query.toLowerCase())) : shownGuilds as guild}
			<a
				class="w-10% flex flex-col justify-center items-center gap-2 relative of-hidden
    hover:scale-105 transition-all duration-100 ease-in-out"
				href={`/guilds/${guild.id}`}
			>
				{#if guild.icon_url}
					<img src={guild.icon_url} alt="" class="rounded-full p-2 w-60px z-2" />
				{:else}
					<div
						class="bg-main-lighter p-1 rounded-full transition-all duration-300 ease-in-out w-50px h-50px flex justify-center items-center color-alt-text hover:color-main-text text-xs of-hidden z-2"
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
