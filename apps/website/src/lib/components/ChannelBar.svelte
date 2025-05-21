<script lang="ts">
	import { page } from '$app/state';
	import type { RChannel, RGuild } from '$lib/scripts/RTypes';
	import ChannelBarButton from './ChannelBarButton.svelte';
	import SidebarChannel from './SidebarChannel.svelte';

	const { channels, guild }: { channels: RChannel[]; guild: RGuild } = $props();
	let showSettings = $state(false);

	const getBoostProgressWidth = (count: number) => {
		if (count === 0) return '0%';
		if (count >= 16) return '100%';
		return `${(count / 16) * 100}%`;
	};
</script>

<section
	class="bg-main-darkest flex flex-col justify-start items-start h-100vh of-y-auto of-x-hidden max-w-65 min-w-65 relative"
>
	<div
		class="flex flex-row justify-between items-start w-full flex-shrink-0"
		class:h-10={!guild.banner_url}
		class:min-h-12={!guild.banner_url}
		class:min-h-37={guild.banner_url}
		class:max-h-9.25={!guild.banner_url}
		class:max-h-2.5={guild.banner_url}
	>
		<div
			class:invisible={!showSettings}
			class="absolute z-20 bg-main-darker w-[calc(100%-10px)] ml-5px b-solid b-1px b-alt-text h-max mt-10 rounded-md p-2 flex flex-col gap-2"
		>
			<ChannelBarButton text="Roles" icon="roles" href={`/guilds/${guild.id}/settings/roles`} />
			<ChannelBarButton text="Emojis" icon="emojis" href={`/guilds/${guild.id}/settings/emojis`} />
			<ChannelBarButton
				text="Stickers"
				icon="stickers"
				href={`/guilds/${guild.id}/settings/stickers`}
			/>
			<ChannelBarButton text="Sounds" icon="sounds" href={`/guilds/${guild.id}/settings/sounds`} />
			<ChannelBarButton text="Members" icon="members" href={`/guilds/${guild.id}/settings/members`} />
			<ChannelBarButton text="Invites" icon="invites" href={`/guilds/${guild.id}/settings/invites`} />
			<hr class="w-full b-main-lighter" />
			<ChannelBarButton
				text="Audit-Log"
				icon="audit-logs"
				href={`/guilds/${guild.id}/settings/audit-log`}
			/>
			<ChannelBarButton text="Bans" icon="bans" href={`/guilds/${guild.id}/settings/bans`} />
		</div>

		<div
			class="z-10 w-full bg-gradient-to-t from-[rgba(0,0,0,0)] to-[rgba(0,0,0,0.75)] pt-3 pl-3 flex flex-row justify-between items-center gap-5 pr-3"
		>
			<span class="truncate w-full">
				{guild.name}
			</span>
			<button
				aria-label="Open settings"
				onclick={() => (showSettings = !showSettings)}
				onkeydown={(e) => (e.key === 'Enter' ? (showSettings = !showSettings) : null)}
			>
				<i
					class=" block h-5 w-5 top-3 right-3 z-10"
					class:i-tabler-chevron-up={showSettings}
					class:i-tabler-chevron-down={!showSettings}
				></i>
			</button>
		</div>

		{#if guild.banner_url}
			<img
				src={`${guild.banner_url}?size=4096`}
				alt="Guild Banner"
				class="w-100% absolute top-0 h-37 object-cover"
				loading="lazy"
				decoding="async"
			/>
		{/if}
	</div>

	{#if guild.premium_progress_bar_enabled}
		<hr class="content-empty w-full h-0.1 border-0px border-t-1px border-solid border-main-dark" />

		<div class="flex flex-col w-94% m-2">
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
			<SidebarChannel {channel} {guild} selected={page.params.channelId === channel.id} />
		{/each}

		<div class="content-empty w-full h-19"></div>
	</div>
</section>
