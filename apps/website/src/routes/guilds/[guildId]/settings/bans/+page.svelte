<script lang="ts">
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import type { GETResponse } from '../../../../api/guilds/[guildId]/bans/+server';
	import Button from '$lib/components/form/Button.svelte';

	// const { data }: { data: PageServerData } = $props();
	let bans: GETResponse = $state([]);
	let fetchRun = $state(0);
	let firstBan: GETResponse[number] | null = $state(null);

	const getBans = async (n: boolean) => {
		const res = await fetch(
			`/api/guilds/${page.params.guildId}/bans?${n ? 'after' : 'before'}=${bans.length ? bans.at(n ? 0 : -1)?.user.id || '' : ''}`,
		);
		if (!res.ok) return;

		fetchRun += 1;
		bans = (await res.json()) as GETResponse;
		if (fetchRun === 1) firstBan = bans.at(0) || null;
	};

	const next = () => {
		getBans(true);
	};

	const prev = () => {
		getBans(false);
	};

	onMount(() => {
		getBans(false);
	});
</script>

<div class="flex flex-row gap-2 justify-center items-center flex-wrap p-5">
	{#each bans as ban}
		<div class="flex flex-col justify-center items-start gap-2 bg-main-darker w-20% p-2 rounded-xl">
			<div class="mention flex flex-row justify-center items-center gap-1 w-max mx-1 mt-2">
				<span class="text-alt-text">@</span>
				<img
					src={ban.user.avatar_url}
					alt=""
					class="w-5 h-5 rounded-full"
					loading="lazy"
					decoding="async"
				/>
				{ban.user.global_name || ban.user.username}
			</div>

			<span class="color-alt-text text-3 flex flex-row justify-end items-end ml-1">
				{ban.user.id}
			</span>

			<span class="bg-main-dark px-2 rounded-lg line-clamp-2 mb-1 py-1">
				{ban.reason || 'No reason given'}
			</span>
		</div>
	{/each}
</div>

<div class="w-full flex flex-row justify-center items-center gap-5 mb-5">
	<Button
		emoji={{ animated: false, id: '◀️' }}
		text=""
		style="secondary-outline"
		onclick={() => prev()}
		disabled={!!bans.find((b) => b.user.id === firstBan?.user.id)}
	/>
	<Button
		emoji={{ animated: false, id: '▶️' }}
		text=""
		style="secondary-outline"
		onclick={() => next()}
		disabled={bans.length < 100}
	/>
</div>
