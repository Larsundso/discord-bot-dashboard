<script lang="ts">
	import { page } from '$app/state';
	import type { RChannel, RGuild } from '$lib/scripts/RTypes';
	import ChannelBarButton from './ChannelBarButton.svelte';
	import Channel from './mentions/Channel.svelte';

	const { guild, channel }: { guild: RGuild; channel: RChannel } = $props();
</script>

<section
	class="bg-main-darkest flex flex-col justify-start items-center h-100vh of-y-auto of-x-hidden max-w-65 min-w-65 relative px-1 gap-2"
>
	<div class="flex flex-row justify-center w-full items-center gap-2 p-2 color-alt-text">
		{#if guild.icon_url}
			<img src={guild.icon_url} class="w-8 h-8 rounded-full" alt="" />
		{/if}

		<span>{guild.name}</span>
	</div>
	<Channel id={channel.id} {guild} />

	<hr class="w-full b-main-lighter" />
	<ChannelBarButton
		text="Permissions"
		icon="members"
		href={`/guilds/${guild.id}/${channel.id}/settings/perms`}
		active={page.url.pathname.includes('perms')}
	/>
	<hr class="w-full b-main-lighter" />
	<a
		href="/guilds/{guild.id}"
		class="w-full flex flex-row items-center justify-center gap-2 color-alt-text hover:bg-main-light rounded-lg p-1"
	>
		<i class="i-tabler-arrow-big-left-filled block w-5 h-5"></i> Go back
	</a>
</section>
