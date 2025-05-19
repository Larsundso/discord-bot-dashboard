<script lang="ts">
	import TextInput from '$lib/components/form/TextInput.svelte';
	import Emoji from '$lib/components/message/emoji.svelte';
	import Sticker from '$lib/components/message/sticker.svelte';
	import { parse } from 'discord-markdown-parser';
	import type { PageServerData } from './$types';
	import User from '$lib/components/mentions/User.svelte';

	const { data }: { data: PageServerData } = $props();
	let query = $state('');
</script>

<div class="w-50% m-auto py-2">
	<TextInput id="query" required={false} label="Search Stickers" bind:val={query} />
</div>

<div class="flex w-full flex-row justify-evenly flex-wrap items-center gap-2 mb-5">
	{#each data.stickers
		.filter((e) => e.name?.toLowerCase().includes(query.toLowerCase()))
		.sort((a, b) => a.name!.localeCompare(b.name!)) as sticker, i}
		{@const parsed = parse(sticker.tags, 'extended')}
		<div
			class="w-20% flex flex-col justify-center items-center gap-2 hover:bg-main-light duration-100 transition-all ease-in-out rounded-xl p-2"
			class:op-50={!sticker.available}
		>
			<div class="flex flex-row justify-center items-center gap-2">
				<Sticker {sticker} />

				<TextInput
					disabled={true}
					label="Emoji Name"
					id={sticker.id}
					maxLen={30}
					minLen={2}
					required={true}
					size="short"
					val={sticker.name!}
				/>
			</div>

			<TextInput
				disabled={true}
				label="Emoji Description"
				id={String(i)}
				maxLen={100}
				minLen={2}
				required={true}
				size="paragraph"
				val={sticker.description || 'None'}
			/>

			<div class="flex flex-row justify-center items-center gap-2">
				{#if (parsed.length > 1 || parsed[0].type === 'text') && !(parsed[0].content as string).match(/^\d+$/)}
					{@const parsedTwemoji = `:${parsed.map((e) => e.content).join('')}:`}
					<span>
						{parsedTwemoji}
					</span>
				{:else}
					{#each parsed as possibleEmoji}
						{#if possibleEmoji.type === 'emoji'}
							<Emoji
								animated={possibleEmoji.animated}
								name={possibleEmoji.name}
								id={possibleEmoji.id}
								small={false}
							/>
						{:else if possibleEmoji.type === 'text'}
							{@const emoji = data.emojis.find((e) => e.id === possibleEmoji.content)}
							{#if emoji}
								<Emoji
									animated={emoji.animated || false}
									name={emoji.name || 'Unknown'}
									id={emoji.id}
									small={false}
								/>
							{:else}
								{JSON.stringify(possibleEmoji)}
							{/if}
						{:else if possibleEmoji.type === 'twemoji'}
							<span class="text-4xl">
								{possibleEmoji.name}
							</span>
						{:else}
							<span class="color-danger">
								Unhandled {possibleEmoji.type}
								{JSON.stringify(possibleEmoji)}
							</span>
						{/if}
					{/each}
				{/if}

				{#if sticker.user_id}
					<User id={sticker.user_id} />
				{/if}
			</div>
		</div>
	{/each}
</div>
