<script lang="ts">
	import type { RChannel, RGuild } from '$lib/scripts/RTypes';
	import { ChannelType } from 'discord-api-types/v10';
	import ChannelIcon from './ChannelIcon.svelte';

	const { channel, guild }: { channel: RChannel; guild: RGuild } = $props();
</script>

<a
	class="flex flex-row justify-start items-center gap-1 color-alt-text py-0.5 rounded-lg px-0.5 mr-2
 transition-all duration-100 ease-in-out hover:bg-main-dark"
	class:mt-4={channel.type === ChannelType.GuildCategory}
	href={`/guilds/${guild.id}/${channel.id}`}
>
	<ChannelIcon {channel} {guild} />
	<span class="text-xs sm:text-sm md:text-base" class:text-2xs={channel.type === ChannelType.GuildCategory}>
		{channel.name.slice(0, 15)}{channel.name.length > 15 ? '...' : ''}
	</span>
</a>
