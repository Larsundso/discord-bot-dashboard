<script lang="ts">
	import type { APIEmbed, EmbedType } from 'discord-api-types/v10';
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
{:else if embed.type === 'image'}
	<div class="block max-h-inherit w-323px">
		<a tabindex="-1" aria-hidden="true" href={embed.thumbnail!.url} data-role="img"></a>
		<div tabindex="0" aria-label="Image" role="button">
			<img
				class="block object-cover min-w-full min-h-full max-w-[calc(100%+1px)] my-2"
				alt=""
				src={embed.thumbnail!.url}
			/>
		</div>
	</div>
{:else if embed.type === ('auto_moderation_notification' as EmbedType)}
	<Automoderation {embed} {guild} />
{:else}
	<span class="text-danger">
		Unhandled {embed.type} embed
	</span>
{/if}
