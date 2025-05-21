<script lang="ts">
	import { page } from '$app/state';
	import type { RChannel, RGuild } from '$lib/scripts/RTypes';
	import ChannelBarButton from './ChannelBarButton.svelte';

	const { guild }: { guild: RGuild } = $props();
</script>

<section
	class="bg-main-darkest flex flex-col justify-start items-start h-100vh of-y-auto of-x-hidden max-w-65 min-w-65 relative px-1 gap-2"
>
	<div class="flex flex-row justify-center w-full items-center gap-2 p-2 color-alt-text">
		{#if guild.icon_url}
			<img src={guild.icon_url} class="w-8 h-8 rounded-full" alt="" />
		{/if}

		<span>{guild.name}</span>
	</div>

	<hr class="w-full b-main-lighter" />
	<ChannelBarButton
		text="Roles"
		icon="roles"
		href={`/guilds/${guild.id}/settings/roles`}
		active={page.url.pathname.includes('roles')}
	/>
	<ChannelBarButton
		text="Emojis"
		icon="emojis"
		href={`/guilds/${guild.id}/settings/emojis`}
		active={page.url.pathname.includes('emojis')}
	/>
	<ChannelBarButton
		text="Stickers"
		icon="stickers"
		href={`/guilds/${guild.id}/settings/stickers`}
		active={page.url.pathname.includes('stickers')}
	/>
	<ChannelBarButton
		text="Sounds"
		icon="sounds"
		href={`/guilds/${guild.id}/settings/sounds`}
		active={page.url.pathname.includes('sounds')}
	/>
	<ChannelBarButton
		text="Members"
		icon="members"
		href={`/guilds/${guild.id}/settings/members`}
		active={page.url.pathname.includes('members')}
	/>
	<ChannelBarButton
		text="Invites"
		icon="invites"
		href={`/guilds/${guild.id}/settings/invites`}
		active={page.url.pathname.includes('invites')}
	/>
	<hr class="w-full b-main-lighter" />
	<ChannelBarButton
		text="Audit-Log"
		icon="audit-logs"
		href={`/guilds/${guild.id}/settings/audit-logs`}
		active={page.url.pathname.includes('audit-logs')}
	/>
	<ChannelBarButton
		text="Bans"
		icon="bans"
		href={`/guilds/${guild.id}/settings/bans`}
		active={page.url.pathname.includes('bans')}
	/>
	<hr class="w-full b-main-lighter" />
	<a
		href="/guilds/{guild.id}"
		class="w-full flex flex-row items-center justify-center gap-2 color-alt-text hover:bg-main-light rounded-lg p-1"
	>
		<i class="i-tabler-arrow-big-left-filled block w-5 h-5"></i> Go back
	</a>
</section>
