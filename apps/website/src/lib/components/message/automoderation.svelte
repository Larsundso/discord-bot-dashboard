<script lang="ts">
	import type { APIEmbed } from 'discord-api-types/v10';
	import Channel from '../mentions/Channel.svelte';
	import getReadableDuration from '$lib/scripts/util/getReadableDuration';
	import Content from './content.svelte';
	import type { RGuild } from '$lib/scripts/RTypes';

	const { embed, guild }: { embed: APIEmbed; guild?: RGuild } = $props();
</script>

<div class="color-main-text">Message blocked by Automod</div>
<div class="bg-main-darker p-1 w-full h-full rounded-md flex flex-col justify-between">
	<span class="mx-2 mt-2"> Message Content </span>
	<div class="b-solid b-1px b-danger p-2 m-2 rounded-lg">
		<Content content={embed.description!} {guild} inEmbed={true} />
	</div>

	<div
		class="flex flex-wrap flex-row gap-2 justify-start items-center gap-2 text-xs text-alt-text mx-2 mb-2"
	>
		{#each embed.fields || [] as field}
			{#if field.name === 'rule_name'}
				<span>Rule: {field.value} </span>
			{:else if field.name === 'channel_id'}
				<span class="flex flex-row justify-center items-center gap-1">
					Channel: <Channel id={field.value} />
				</span>
			{:else if field.name === 'decision_id'}{:else if field.name === 'decision_outcome'}
				<span>Action: {field.value}</span>
			{:else if field.name === 'keyword'}
				<div>
					Matching keyword:
					<span class="bg-main-dark px-1 rounded-md">
						{field.value}
					</span>
				</div>
			{:else if field.name === 'timeout_duration'}
				<div>Timeout: {getReadableDuration(Number(field.value))}</div>
			{:else if field.name === 'keyword_matched_content'}
				<div>Matched content: <span class="bg-main-dark px-1 rounded-md"> {field.value} </span></div>
			{:else if field.name === 'flagged_message_id'}{:else}
				<span class="text-danger"> Unhandled {field.name} field </span>
			{/if}
		{/each}
	</div>
</div>
