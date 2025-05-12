<script lang="ts">
	import type { RChannel, RGuild } from '$lib/scripts/RTypes';
	import SidebarChannel from './SidebarChannel.svelte';

	const { channels, guild }: { channels: RChannel[]; guild: RGuild } = $props();

	// Calculate boost progress bar width
	function getBoostProgressWidth(count: number): string {
		if (count === 0) return '0%';
		if (count >= 16) return '100%';
		return `${(count / 16) * 100}%`;
	}
</script>

<section
	class="bg-main-darkest flex flex-col justify-start items-start h-100vh of-y-auto of-x-hidden w-70 relative"
>
	<div
		class="flex flex-row justify-between items-start w-full flex-shrink-0"
		class:h-10={!guild.banner_url}
		style="min-height: {guild.banner_url ? '9.25rem' : '2.5rem'}; max-height: {guild.banner_url
			? '9.25rem'
			: '2.5rem'}"
	>
		<span class="z-10 w-65 bg-gradient-to-t from-[rgba(0,0,0,0)] to-[rgba(0,0,0,0.75)] pt-3 pl-5">
			{guild.name.slice(0, 20)}{guild.name.length > 20 ? '...' : ''}
		</span>
		<i class="absolute i-tabler-chevron-up block h-5 w-5 top-3 right-3 z-10"></i>

		{#if guild.banner_url}
			<img
				src={`${guild.banner_url}?size=4096`}
				alt="Guild Banner"
				class="w-100% absolute top-0 h-37 object-cover"
			/>
		{/if}
	</div>

	{#if guild.premium_progress_bar_enabled}
		<hr class="content-empty w-full h-0.1 border-0px border-t-1px border-solid border-main-dark" />

		<div class="flex flex-col w-66 m-2">
			<div class="flex flex-row justify-between">
				<span class="color-alt-text text-xs">Lvl {guild.premium_tier}</span>
				<span class="color-alt-text text-xs">{guild.premium_subscription_count} Boosts</span>
			</div>

			<div
				class="rounded-full bg-gradient-to-r from-main-dark to-main-dark content-empty w-full h-1 mt-1 relative"
			>
				<div
					class="rounded-full bg-gradient-to-r from-[#5573d9] to-[#a37dec] content-empty h-1 mt-1 absolute -top-1 left-0"
					style={`width: ${getBoostProgressWidth(guild.premium_subscription_count || 0)}`}
				></div>
			</div>
		</div>

		<hr class="content-empty w-full h-0.1 border-0px border-t-1px border-solid border-main-dark" />
	{/if}

	<div class="w-full overflow-y-auto ml-3.5">
		{#each channels as channel}
			<SidebarChannel {channel} {guild} />
		{/each}

		<div class="content-empty w-full h-19"></div>
	</div>
</section>
