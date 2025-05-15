<script lang="ts">
	import type { APIEmbed } from 'discord-api-types/v10';
	import Video from './video.svelte';
	import InfiniteVideo from './infiniteVideo.svelte';
	import Automoderation from './automoderation.svelte';
	import type { RGuild } from '$lib/scripts/RTypes';

	const { embed, guild }: { embed: APIEmbed; guild?: RGuild } = $props();
</script>

{#if embed.type === 'video'}
	<Video src={embed.video!.url!} />
{:else if embed.type === 'gifv'}
	<InfiniteVideo src={embed.video!.url!} />
{:else if embed.type === 'auto_moderation_message'}
	<Automoderation {embed} {guild} />
{:else}
	<span class="text-danger">
		Unhandled {embed.type} embed
	</span>
{/if}
