<script lang="ts">
	import type { APIAttachment } from 'discord-api-types/v10';
	import Video from './video.svelte';
	import Button from '../form/Button.svelte';

	const { attachment }: { attachment: APIAttachment } = $props();
</script>

<div class="block max-h-inherit w-323px">
	<a tabindex="-1" aria-hidden="true" href={attachment.url} data-role="img"></a>
	<div tabindex="0" aria-label="Image" role="button">
		{#if attachment.content_type === 'video/quicktime'}
			<Video src={attachment.url} />
		{:else if ['image/jpeg', 'image/png', 'image/webp'].includes(attachment.content_type || '')}
			<img
				class="block object-cover min-w-full min-h-full max-w-[calc(100%+1px)] my-2"
				alt=""
				src={attachment.url}
			/>
		{:else if attachment.content_type?.startsWith('text/plain')}
			<a href={attachment.url} target="_blank" rel="noreferrer nofollow ugc">
				<Button style="link-outline" text={attachment.filename} />
			</a>
		{:else if attachment.content_type?.startsWith('audio/')}
			<audio controls class="w-full">
				<source src={attachment.url} type={attachment.content_type} />
				Your browser does not support the audio tag.
			</audio>
		{:else}
			<span class="color-danger"> Unhandled {attachment.content_type} attachment </span>
		{/if}
	</div>
</div>
