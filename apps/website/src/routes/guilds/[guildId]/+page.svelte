<script lang="ts">
	import Timestamp from '$lib/components/form/Timestamp.svelte';
	import Mention from '$lib/components/Mention.svelte';
	import getTimestampFromID from '$lib/scripts/util/getTimestampFromID';
	import splitByThousand from '$lib/scripts/util/splitByThousands';
	import { onMount } from 'svelte';
	import type { LayoutParentData, LayoutServerData, PageData } from './$types';
	import { afterNavigate, invalidate, invalidateAll } from '$app/navigation';

	const { data }: { data: LayoutServerData & LayoutParentData & PageData } = $props();

	let presences: number | undefined = $derived(data.guild.approximate_presence_count);
	let members: number | undefined = $derived(data.guild.approximate_member_count);
	let interval: null | NodeJS.Timeout = null;

	onMount(() => {
		if (members && presences) return;

		interval = setInterval(async () => {
			if (members && presences) {
				clearInterval(interval!);
				return;
			}

			const res = await fetch(`/api/guilds/${data.guild.id}/counts`)
				.then((r) =>
					r.status === 200 ? (r.json() as Promise<{ members: number; presences: number }>) : null,
				)
				.catch(() => Promise.resolve(null));
			if (!res) return;

			members = res.members;
			presences = res.presences;
		}, 1000);

		return () => {
			if (interval) clearInterval(interval);
		};
	});
</script>

<section class="flex flex-row justify-evenly items-start p-5 gap-5 w-80% mx-auto">
	<div class="bg-main-light rounded-xl relative">
		{#if data.guild.discovery_splash_url}
			<img
				src={`${data.guild.discovery_splash_url}?size=4096`}
				alt=""
				class="w-full rounded-t-xl h-100 object-cover"
			/>
		{/if}

		{#if data.guild.icon_url}
			<div class="z-10 ml-5 -mt-15 bg-main-dark p-1 rounded-3xl position-inherit w-max">
				<img src={data.guild.icon_url} alt="" class="rounded-3xl" />
			</div>
		{/if}

		<div class="w-full flex flex-row justify-between items-start pb-5 pt-2">
			<div class="w-50%">
				<div class="flex flex-col justify-center items-start px-5">
					<span>{data.guild.name}</span>

					<div class="flex flex-row justify-start items-center gap-5 -ml-1 text-alt-text">
						<span>🟢 {presences ? splitByThousand(presences) : '??.???'} Online</span>
						<span>⚫ {members ? splitByThousand(members) : '??.???'} Members</span>
					</div>

					<div class="flex flex-row text-alt-text">
						<Timestamp time={getTimestampFromID(data.guild.id)} type="f" />&nbsp; ( <Timestamp
							time={getTimestampFromID(data.guild.id)}
							type="R"
						/> )
					</div>

					<p class="text-alt-text mt-4">{data.guild.description}</p>
				</div>
			</div>
			<div class="w-50%">
				<br />
				<div class="flex flex-row justify-start items-center gap-2">
					Owner: <Mention type="user" id={data.guild.owner_id} />
				</div>
			</div>
		</div>
	</div>
</section>

<!-- 
				{#if data.guild.afk_channel_id}
					<div class="flex flex-row items-center gap-2">
						AFK Channel:
						<Mention type="channel" id={data.guild.afk_channel_id} guild={data.guild} />
					</div>
				{/if} -->
