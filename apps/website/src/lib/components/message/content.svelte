<script lang="ts">
	import Emoji from './emoji.svelte';
	import Mention from '../Mention.svelte';
	import type { RGuild } from '$lib/scripts/RTypes';

	const { content, guild }: { content: string | null; guild?: RGuild } = $props();

	type ContentPart =
		| { type: 'text'; content: string }
		| { type: 'emoji'; id: string; animated: boolean; name: string }
		| { type: 'mention'; mentionType: 'user' | 'role' | 'channel'; id: string }
		| { type: 'newline' };

	const EMOJI_REGEX = /^<(?<animated>a?):(?<name>[^:]+):(?<id>\d+)>$/;
	const USER_MENTION_REGEX = /^<@!?(?<id>\d+)>$/;
	const CHANNEL_MENTION_REGEX = /^<#(?<id>\d+)>$/;
	const ROLE_MENTION_REGEX = /^<@&(?<id>\d+)>$/;

	const SPLIT_REGEX = /(<a?:[^:]+:\d+>|<@!?\d+>|<#\d+>|<@&\d+>)/g;

	const parseContent = (text: string | null): ContentPart[] => {
		if (!text) return [];

		const parts: ContentPart[] = [];
		const segments = text.split(SPLIT_REGEX).filter(Boolean);

		const addTextSegment = (textContent: string) => {
			if (!textContent) return;
			const lines = textContent.split('\n');
			lines.forEach((line, index) => {
				if (line) {
					parts.push({ type: 'text', content: line });
				}
				if (index < lines.length - 1) {
					parts.push({ type: 'newline' });
				}
			});
		};

		segments.forEach((segment) => {
			let match;
			if ((match = segment.match(EMOJI_REGEX))) {
				parts.push({
					type: 'emoji',
					id: match.groups!.id,
					animated: match.groups!.animated === 'a',
					name: match.groups!.name,
				});
			} else if ((match = segment.match(USER_MENTION_REGEX))) {
				parts.push({ type: 'mention', mentionType: 'user', id: match.groups!.id });
			} else if ((match = segment.match(CHANNEL_MENTION_REGEX))) {
				parts.push({ type: 'mention', mentionType: 'channel', id: match.groups!.id });
			} else if ((match = segment.match(ROLE_MENTION_REGEX))) {
				parts.push({ type: 'mention', mentionType: 'role', id: match.groups!.id });
			} else {
				addTextSegment(segment);
			}
		});

		return parts;
	};

	const parsedContent = $derived(parseContent(content));
</script>

<div class="break-words w-full overflow-hidden flex flex-wrap items-baseline">
	{#each parsedContent as part}
		{#if part.type === 'text'}
			<span>{part.content}</span>
		{:else if part.type === 'emoji'}
			<Emoji
				id={part.id}
				animated={part.animated}
				name={part.name}
				small={parsedContent.some((p) => p.type === 'text' || p.type === 'mention')}
			/>
		{:else if part.type === 'mention'}
			<Mention type={part.mentionType} id={part.id} {guild} />
		{:else if part.type === 'newline'}
			<div class="basis-full h-0"></div>
			<!-- Flexbox line break -->
		{/if}
	{/each}
</div>
