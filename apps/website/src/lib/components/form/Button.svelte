<script lang="ts">
	import getEffectiveBackgroundColor from '$lib/scripts/util/getEffectiveBackgroundColor';
	import getBrightness from '$lib/scripts/util/getBrightness';
	import { onMount } from 'svelte';
	import type { APIMessageComponentEmoji } from 'discord-api-types/v10';

	type EventVar = MouseEvent & {
		currentTarget: EventTarget & HTMLButtonElement;
	};

	type Styles =
		| 'primary'
		| 'primary-outline'
		| 'inverted-white'
		| 'red'
		| 'red-outline'
		| 'green'
		| 'green-outline'
		| 'secondary'
		| 'secondary-outline'
		| 'link'
		| 'link-outline';

	type Height = 'tiny' | 'small' | 'medium' | 'large' | 'min' | 'max' | 'icon';
	type Width = 'fit' | 'full';

	const {
		text,
		style = 'primary',
		disabled = false,
		height = 'small',
		width = 'fit',
		emoji,
		onclick,
	}: {
		text: string;
		style?: Styles;
		disabled?: boolean;
		height?: Height;
		width?: Width;
		emoji?: APIMessageComponentEmoji;
		onclick?: (e: EventVar) => void;
	} = $props();

	let element: HTMLButtonElement | null = $state(null);
	const backgroundColor = $derived(getEffectiveBackgroundColor(element));
	let cssStyle = $state('');

	onMount(() => {
		setTimeout(() => {
			cssStyle = `--color: ${getBrightness(backgroundColor) > 255 / 2 ? 'black' : 'white'}; color: var(--color); --un-bg-opacity: ${disabled ? 0.5 : 1};`;
		}, 1);
	});
</script>

<button
	{onclick}
	bind:this={element}
	class:w-full={width === 'full'}
	class:p-1={height === 'tiny' || height === 'icon'}
	class:min-w-15={height === 'tiny'}
	class:p-2={height === 'small'}
	class:min-w-20={height === 'small'}
	class:p-3={height === 'medium'}
	class:min-w-30={height === 'medium'}
	class:p-4={height === 'large'}
	class:min-w-40={height === 'large'}
	class:p-0={height === 'min'}
	class:p-5={height === 'max'}
	class:btn-extra-link-outlined={style === 'link-outline'}
	class:btn-link={style === 'link'}
	class:btn-extra-secondary-outlined={style === 'secondary-outline'}
	class:btn-secondary={style === 'secondary'}
	class:btn-extra-success-outlined={style === 'green-outline'}
	class:btn-success={style === 'green'}
	class:btn-extra-danger-outlined={style === 'red-outline'}
	class:btn-danger={style === 'red'}
	class:btn-extra-inverted-white={style === 'inverted-white'}
	class:btn-extra-primary-outlined={style === 'primary-outline'}
	class:hover:text-white!={style === 'primary'}
	class:btn-primary={style === 'primary'}
	class="hover:color-[--color]!"
	class:hover:bg-secondary-hover={!disabled}
	class:hover:border-transparent={!disabled}
	style={cssStyle}
	{disabled}
>
	{#if emoji}
		<span class="whitespace-nowrap inline-block align-middle">
			{#if emoji.name && emoji.id}
				<img
					src={`https://cdn.discordapp.com/emojis/${emoji.id}.${emoji.animated ? 'gif' : 'webp'}`}
					alt={(emoji.name as string) || 'Emoji'}
					class="align-middle relative [vertical-align:middle] w-7 h-7"
				/>
			{:else}
				{emoji.name || emoji.id}
			{/if}
		</span>
	{/if}

	{text}

	{#if style === 'link' || style === 'link-outline'}
		<span class="i-tabler-external-link block"></span>
	{/if}
</button>
