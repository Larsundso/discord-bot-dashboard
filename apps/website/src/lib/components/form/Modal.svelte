<script lang="ts">
	import { type Snippet } from 'svelte';

	const {
		children,
		authorImg = '/favicon.webp',
		author,
		close,
	}: {
		children: Snippet;
		authorImg?: string;
		author: string;
		submitText?: string;
		close: Function;
	} = $props();
</script>

<div
	class="absolute z-99999 bg-black/90 left-0 top-0 w-full h-full
flex flex-row items-center justify-center"
	onclick={() => close()}
	onkeydown={() => {}}
	role="button"
	tabindex="0"
>
	<div
		class="w-[min(40rem,100%)] h-[min(40rem,100%)] of-auto z-99999999
p-5 bg-main-dark rounded-lg cursor-default relative"
		onclick={(e) => e.stopPropagation()}
		onkeydown={(e) => e.stopPropagation()}
		role="menu"
		tabindex="0"
	>
		<div class="flex flex-row justify-between items-center mb-2">
			<div class="flex flex-row justify-start items-center gap-2">
				<img src={authorImg} width="32" height="32" alt="" />
				<div class="text-2xl">{author}</div>
			</div>

			<button
				aria-label="close"
				class="content-empty h-5 w-5 color-alt-text hover:color-main-text"
				onclick={() => close()}
				onkeydown={(e) => e.key === 'Enter' && close()}
			>
				<span class="i-tabler-x block"></span>
			</button>
		</div>
		{@render children()}
	</div>
</div>
