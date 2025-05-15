<script lang="ts">
	import type { RGuild } from '$lib/scripts/RTypes';
	import getReadableDuration from '$lib/scripts/util/getReadableDuration';
	import { EmbedType, type APIEmbed } from 'discord-api-types/v10';
	import Channel from '../mentions/Channel.svelte';
	import Content from './content.svelte';
	import Timestamp from '../form/Timestamp.svelte';

	const { embed, guild }: { embed: APIEmbed; guild?: RGuild } = $props();
</script>

<div class="color-main-text">
	{embed.type === EmbedType.AutoModerationMessage ? 'Message blocked by Automod' : 'Raid detected'}
</div>

<div class="bg-main-darker p-1 w-full rounded-md flex flex-col justify-between">
	{#if embed.description}
		<span class="mx-2 mt-2"> Message Content </span>
		<div class="b-solid b-1px b-danger p-2 m-2 rounded-lg">
			<Content content={embed.description!} {guild} inEmbed={true} />
		</div>
	{/if}

	<div
		class="flex flex-wrap flex-row gap-2 justify-start items-center gap-2 text-xs text-alt-text mx-2 mb-2"
		class:mt-2={!embed.description}
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
			{:else if field.name === 'notification_type'}
				Notification type: <span class="bg-main-dark px-1 rounded-md">
					{field.value.replace('_', ' ')}
				</span>
			{:else if field.name === 'raid_datetime'}
				<span class="bg-main-lighter px-1 rounded-md flex flex-row justify-center items-center">
					Detected at <Timestamp time={new Date(field.value).getTime()} type="F" />
				</span>
			{:else if field.name === 'suspicious_mention_activity_until'}
				<span class="bg-main-lighter px-1 rounded-md flex flex-row justify-center items-center">
					Active until: <Timestamp time={new Date(field.value).getTime()} type="t" />
				</span>
			{:else if field.name === 'flagged_message_id'}{:else}
				<span class="text-danger"> Unhandled {field.name} field </span>
			{/if}
		{/each}
	</div>
</div>
