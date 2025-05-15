<script lang="ts">
	import User from '$lib/components/mentions/User.svelte';
	import type { RGuild, RMember, RMessage, RRole, RUser } from '$lib/scripts/RTypes';
	import getHighestRoleWithColor from '$lib/scripts/util/getHighestRoleWithColor';
	import getTimestampFromID from '$lib/scripts/util/getTimestampFromID';
	import Timestamp from '../../form/Timestamp.svelte';
	import Attachment from '../attachment.svelte';
	import Component from '../component.svelte';
	import Content from '../content.svelte';
	import Embed from '../embed.svelte';
	import SpecialEmbeds from '../specialEmbeds.svelte';
	import Sticker from '../sticker.svelte';

	const {
		message,
		guild,
		roles,
	}: { message: RMessage & { member?: RMember; author?: RUser }; guild: RGuild; roles: RRole[] } =
		$props();

	const replyAuthor = $derived(message.referenced_message?.author);
</script>

<div class="w-full">
	{#if message.interaction_metadata}
		<div class="flex flex-row text-xs color-alt-text items-center">
			<i class="i-tabler-border-corner-rounded block w-4 h-4 color-alt-text ml-4 mt-2"></i>

			{#if 'name' in message.interaction_metadata}
				<span class="mention p-0.5">/{message.interaction_metadata.name}</span>
			{:else}
				<span class="mention">Unknown Command</span>
			{/if}

			<User id={message.interaction_metadata.user.id} />
		</div>
	{/if}

	{#if message.referenced_message}
		<div class="flex flex-row text-xs color-alt-text items-center">
			<i class="i-tabler-border-corner-rounded block w-4 h-4 color-alt-text ml-4 mt-2"></i>

			<User id={replyAuthor?.id!} />
			{#if message.referenced_message.content}
				<span class="max-w-50% truncate">{message.referenced_message.content}</span>
			{/if}
		</div>
	{/if}

	<div class="flex flex-row gap-2 w-full max-w-full">
		<img
			src={message.member?.avatar_url || message.author?.avatar_url}
			alt=""
			class="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex-shrink-0"
		/>
		<div
			class="flex flex-col justify-start items-start max-w-[calc(100%-3rem)] sm:max-w-[calc(100%-3.5rem)] overflow-hidden w-full"
		>
			<div
				class="font-medium max-w-full flex flex-row items-center gap-2 whitespace-nowrap"
				style={`color: #${
					message.member
						? getHighestRoleWithColor(message.member, guild, roles).color.toString(16).padStart(6, '0')
						: 'fff'
				}`}
			>
				{message.member?.nick || message.author?.global_name || message.author?.username}
				<div class="text-alt-text text-xs inline-block">
					<Timestamp time={getTimestampFromID(message.id)} type="R" />
				</div>
			</div>
			<Content content={message.content} />

			{#each message.sticker_items || [] as sticker}
				<Sticker {sticker} />
			{/each}

			{#each message.embeds.filter((r) => r.type === 'rich') as embed}
				<Embed {embed} {guild} />
			{/each}

			{#each message.embeds.filter((r) => r.type !== 'rich') as embed}
				<SpecialEmbeds {embed} {guild} />
			{/each}

			{#each message.attachments as attachment}
				<Attachment {attachment} />
			{/each}

			{#each message.components || [] as component}
				<Component {component} />
			{/each}
		</div>
	</div>
</div>
