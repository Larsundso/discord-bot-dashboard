<script lang="ts">
	import type { RChannel, RGuild } from '$lib/scripts/RTypes';
	import { ChannelType } from 'discord-api-types/v10';
	import ChannelIcon from './ChannelIcon.svelte';

	const { channel, guild, selected }: { channel: RChannel; guild: RGuild; selected: boolean } =
		$props();
</script>

<div
	class="flex flex-row justify-start items-center gap-1 color-alt-text py-0.5 rounded-lg px-0.5 mr-2 relative
 transition-all duration-100 ease-in-out hover:bg-main-dark group"
	class:bg-main-dark={selected}
	class:mt-4={channel.type === ChannelType.GuildCategory}
	class:pointer-events-none={channel.type === ChannelType.GuildCategory}
>
	<a
		href={`/guilds/${guild.id}/${channel.id}`}
		class="flex flex-row justify-start items-center gap-1 w-full"
	>
		<ChannelIcon {channel} {guild} />
		<span
			class="text-xs sm:text-sm md:text-base truncate"
			class:text-2xs={channel.type === ChannelType.GuildCategory}
		>
			{channel.name}
		</span>
	</a>

	<a
		class="absolute right-1 op-0 group-hover:op-100 top-1 transition-all duration-100 ease-in-out"
		href="/guilds/{guild.id}/{channel.id}/settings"
		aria-label="Channel settings"
	>
		<i class="i-tabler-settings-filled inline-block w-4 h-4"></i>
	</a>
</div>
