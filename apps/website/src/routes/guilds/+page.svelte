<script lang="ts">
	import Button from '$lib/components/form/Button.svelte';
	import type { RGuild } from '$lib/scripts/RTypes';
	import cache from '$lib/scripts/cache';
	import { CacheEvents } from '@discord-bot-dashboard/cache/src/BaseClient/Cluster/Events';
	import type { PageData } from './$types';

	const { data }: { data: PageData } = $props();
	let allGuilds = $state<RGuild[]>([...((data.guilds as RGuild[]) || [])]);
	let currentPage = $state(1);
	let itemsPerPage = 100;
	let loadingMore = $state(false);
	let hasMoreGuilds = $state(true);
	let query = $state('');

	let displayedGuilds = $derived.by(() => {
		let guilds: RGuild[];
		if (query) {
			guilds = allGuilds.filter((g) => g.name.toLowerCase().includes(query.toLowerCase()));
		} else {
			const start = (currentPage - 1) * itemsPerPage;
			const end = start + itemsPerPage;
			guilds = allGuilds.slice(start, end);
		}

		const seen = new Set<string>();
		return guilds.filter((guild) => {
			if (seen.has(guild.id)) {
				return false;
			}
			seen.add(guild.id);
			return true;
		});
	});

	let totalPages = $derived.by(() => Math.ceil(allGuilds.length / itemsPerPage));

	const prev = async () => {
		if (currentPage > 1) {
			currentPage = currentPage - 1;
		}
	};

	const next = async () => {
		if (currentPage < totalPages) {
			currentPage = currentPage + 1;
		} else if (hasMoreGuilds) {
			await loadMoreGuilds();
			if (allGuilds.length > currentPage * itemsPerPage) {
				currentPage = currentPage + 1;
			}
		}
	};

	const loadMoreGuilds = async () => {
		if (loadingMore || !hasMoreGuilds) return;

		loadingMore = true;
		try {
			const response = await fetch(`/api/guilds/load-more?offset=${allGuilds.length}&limit=50`);
			const newGuilds: RGuild[] = await response.json();

			if (newGuilds.length === 0) {
				hasMoreGuilds = false;
			} else {
				allGuilds = [...allGuilds, ...newGuilds];
			}
		} catch (error) {
			console.error('Failed to load more guilds:', error);
		} finally {
			loadingMore = false;
		}
	};

	$effect(() => {
		const postChannel = cache.emitter.get(CacheEvents.guildCreate)!;
		const patchChannel = cache.emitter.get(CacheEvents.guildUpdate)!;
		const deleteChannel = cache.emitter.get(CacheEvents.guildDelete)!;

		const postUnsub = postChannel.subscribe((run) => {
			if (!run) return;

			const parsed = JSON.parse(run) as RGuild;
			$effect.root(() => {
				if (!allGuilds.some((g) => g.id === parsed.id)) {
					allGuilds = [...allGuilds, parsed];
				}
			});
		});

		const patchUnsub = patchChannel.subscribe((run) => {
			if (!run) return;

			const parsed = JSON.parse(run) as RGuild;
			$effect.root(() => {
				allGuilds = allGuilds.map((guild) => (guild.id === parsed.id ? parsed : guild));
			});
		});

		const deleteUnsub = deleteChannel.subscribe((run) => {
			if (!run) return;

			const parsed = JSON.parse(run) as RGuild;
			$effect.root(() => {
				allGuilds = allGuilds.filter((guild) => guild.id !== parsed.id);
			});
		});

		return () => {
			postUnsub();
			patchUnsub();
			deleteUnsub();
		};
	});
</script>

<section class="h-100vh flex flex-col justify-start items-center of-auto">
	<div class="w-auto relative flex flex-row justify-between items-center gap-2">
		<div class="mt-5">
			<Button
				emoji={{ animated: false, id: '◀️' }}
				text=""
				style="secondary-outline"
				onclick={() => prev()}
				disabled={currentPage === 1}
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
				disabled={currentPage === totalPages && !hasMoreGuilds}
			/>
		</div>
	</div>

	<div class="flex flex-row justify-center items-center gap-2 w-full flex-wrap mt-5">
		{#each displayedGuilds as guild (guild.id)}
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
							.map((w: string) => w[0].toUpperCase())
							.join('')
							.slice(0, 5)}
					</div>
				{/if}
				<span class="text-center z-2">{guild.name}</span>
			</a>
		{/each}
	</div>

	<!-- Load More Button -->
	{#if hasMoreGuilds && !query}
		<div class="flex justify-center mt-5">
			<Button
				text={loadingMore ? 'Loading...' : 'Load More Guilds'}
				style="primary"
				onclick={loadMoreGuilds}
				disabled={loadingMore}
			/>
		</div>
	{/if}
</section>
