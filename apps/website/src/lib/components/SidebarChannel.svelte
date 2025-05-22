<script lang="ts">
	import type { RChannel, RGuild } from '$lib/scripts/RTypes';
	import { ChannelType } from 'discord-api-types/v10';
	import ChannelIcon from './ChannelIcon.svelte';

	const { channel, guild, selected }: { channel: RChannel; guild: RGuild; selected: boolean } =
		$props();
</script>

<a
	class="flex flex-row justify-start items-center gap-1 color-alt-text py-0.5 rounded-lg px-0.5 mr-2
 transition-all duration-100 ease-in-out hover:bg-main-dark"
	class:bg-main-dark={selected}
	class:mt-4={channel.type === ChannelType.GuildCategory}
 class:pointer-events-none={channel.type === ChannelType.GuildCategory}
	href={`/guilds/${guild.id}/${channel.id}`}
>
	<ChannelIcon {channel} {guild} />
	<span
		class="text-xs sm:text-sm md:text-base truncate"
		class:text-2xs={channel.type === ChannelType.GuildCategory}
	>
		{channel.name}
	</span>
</a>
