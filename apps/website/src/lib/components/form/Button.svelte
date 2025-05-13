<script lang="ts">
	import getEffectiveBackgroundColor from '$lib/scripts/util/getEffectiveBackgroundColor';
	import getBrightness from '$lib/scripts/util/getBrightness';
	import { onMount } from 'svelte';

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

		onclick,
	}: {
		text: string;
		style?: Styles;
		disabled?: boolean;
		height?: Height;
		width?: Width;

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

{#if style === 'primary'}
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
		class="hover:text-white! btn-primary"
		class:hover:bg-primary-hover={!disabled}
		style={cssStyle}
		{disabled}
	>
		{text}
	</button>
{:else if style === 'primary-outline'}
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
		class="btn-extra-primary-outlined"
		class:hover:bg-primary-hover={!disabled}
		class:hover:border-transparent={!disabled}
		style={cssStyle}
		{disabled}
	>
		{text}
	</button>
{:else if style === 'inverted-white'}
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
		class="btn-extra-inverted-white hover:color-[--color]!"
		class:cursor-not-allowed={disabled}
		class:hover:bg-primary-hover={!disabled}
		style={cssStyle}
		{disabled}
	>
		{text}
	</button>
{:else if style === 'red'}
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
		class="btn-danger"
		class:hover:bg-danger-hover={!disabled}
		style={cssStyle}
		{disabled}
	>
		{text}
	</button>
{:else if style === 'red-outline'}
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
		class="btn-extra-danger-outlined"
		class:hover:bg-red-hover={!disabled}
		class:hover:border-transparent={!disabled}
		style={cssStyle}
		{disabled}
	>
		{text}
	</button>
{:else if style === 'green'}
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
		class="btn-success"
		class:hover:bg-success-hover={!disabled}
		style={cssStyle}
		{disabled}
	>
		{text}
	</button>
{:else if style === 'green-outline'}
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
		class="btn-extra-success-outlined"
		class:hover:bg-green-hover={!disabled}
		class:hover:border-transparent={!disabled}
		style={cssStyle}
		{disabled}
	>
		{text}
	</button>
{:else if style === 'secondary'}
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
		class="btn-secondary"
		class:hover:bg-secondary-hover={!disabled}
		style={cssStyle}
		{disabled}
	>
		{text}
	</button>
{:else if style === 'secondary-outline'}
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
		class="btn-extra-secondary-outlined"
		class:hover:bg-secondary-hover={!disabled}
		class:hover:border-transparent={!disabled}
		style={cssStyle}
		{disabled}
	>
		{text}
	</button>
{:else if style === 'link'}
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
		class="btn-link"
		class:hover:bg-secondary-hover={!disabled}
		style={cssStyle}
		{disabled}
	>
		{text}
		<span class="i-tabler-external-link block"></span>
	</button>
{:else if style === 'link-outline'}
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
		class="btn-extra-link-outlined"
		class:hover:bg-secondary-hover={!disabled}
		class:hover:border-transparent={!disabled}
		style={cssStyle}
		{disabled}
	>
		{text}
		<span class="i-tabler-external-link block"></span>
	</button>
{/if}
