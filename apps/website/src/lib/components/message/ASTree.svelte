<script lang="ts">
	import type { RGuild } from '$lib/scripts/RTypes';
	import Channel from '../mentions/Channel.svelte';
	import Role from '../mentions/Role.svelte';
	import User from '../mentions/User.svelte';
	import ASTTree from './ASTree.svelte';

	const {
		parse,
		guild,
		useLargeEmojis = false,
	}: {
		parse: { type: string } & Record<string, unknown>;
		guild?: RGuild;
		useLargeEmojis?: boolean;
	} = $props();
</script>

{#if parse.type === 'text'}
	{parse.content}
{:else if parse.type === 'blockQuote'}
	<blockquote class="border-l-3px border-solid border-alt-text pl-1">
		{#each parse.content as (typeof parse)[] as p}
			{@const subParse = p as typeof parse}
			<ASTTree parse={subParse} {guild} {useLargeEmojis} />
		{/each}
	</blockquote>
{:else if parse.type === 'inlineCode'}
	<code class="bg-main-darkest text-alt-text rounded-md p-1 b-solid">
		{parse.content}
	</code>
{:else if parse.type === 'br'}
	<br />
{:else if parse.type === 'subtext'}
	<span class="text-alt-text text-sm">
		{#each parse.content as (typeof parse)[] as p}
			{@const subParse = p as typeof parse}
			<ASTTree parse={subParse} {guild} {useLargeEmojis} />
		{/each}
		<br />
	</span>
{:else if parse.type === 'heading'}
	{#if parse.level === 1}
		<h1 class="text-2xl font-bold">
			{#each parse.content as (typeof parse)[] as p}
				{@const subParse = p as typeof parse}
				<ASTTree parse={subParse} {guild} {useLargeEmojis} />
			{/each}
		</h1>
	{:else if parse.level === 2}
		<h2 class="text-xl font-bold">
			{#each parse.content as (typeof parse)[] as p}
				{@const subParse = p as typeof parse}
				<ASTTree parse={subParse} {guild} {useLargeEmojis} />
			{/each}
		</h2>
	{:else if parse.level === 3}
		<h3 class="text-lg font-bold">
			{#each parse.content as (typeof parse)[] as p}
				{@const subParse = p as typeof parse}
				<ASTTree parse={subParse} {guild} {useLargeEmojis} />
			{/each}
		</h3>
	{/if}
{:else if parse.type === 'codeBlock'}
	<pre
		class="bg-main-darkest text-alt-text rounded-md p-1 border-alt-text border-solid overflow-x-auto w-full"
		class:border-l-3px={parse.inQuote}
		style="max-width: 100%; display: block;"><code class="whitespace-pre break-normal w-full block"
			>{parse.content}</code
		></pre>
{:else if parse.type === 'strong'}
	<strong>
		{#each parse.content as (typeof parse)[] as p}
			{@const subParse = p as typeof parse}
			<ASTTree parse={subParse} {guild} {useLargeEmojis} />
		{/each}
	</strong>
{:else if parse.type === 'em'}
	<em class="italic">
		{#each parse.content as (typeof parse)[] as p}
			{@const subParse = p as typeof parse}
			<ASTTree parse={subParse} {guild} {useLargeEmojis} />
		{/each}
	</em>
{:else if parse.type === 'underline'}
	<u>
		{#each parse.content as (typeof parse)[] as p}
			{@const subParse = p as typeof parse}
			<ASTTree parse={subParse} {guild} {useLargeEmojis} />
		{/each}
	</u>
{:else if parse.type === 'strikethrough'}
	<s>
		{#each parse.content as (typeof parse)[] as p}
			{@const subParse = p as typeof parse}
			<ASTTree parse={subParse} {guild} {useLargeEmojis} />
		{/each}
	</s>
{:else if parse.type === 'spoiler'}
	<span
		class="bg-main-darkest text-alt-text rounded-md p-1 b-solid blur-4 hover:blur-0 transition-all duration-100 ease-in-out"
	>
		{#each parse.content as (typeof parse)[] as p}
			{@const subParse = p as typeof parse}
			<ASTTree parse={subParse} {guild} {useLargeEmojis} />
		{/each}
	</span>
{:else if parse.type === 'link'}
	{@const nestedContent = (parse.content as (typeof parse)[])[0]}
	<a href={parse.target as string} title={parse.title as string} class="text-blue">
		{'content' in nestedContent
			? (nestedContent.content as (typeof parse)[])[0].content
			: nestedContent}
	</a>
{:else if parse.type === 'user'}
	<span class="whitespace-nowrap inline-block"><User id={parse.id as string} /></span>
{:else if parse.type === 'channel'}
	<span class="whitespace-nowrap inline-block"><Channel id={parse.id as string} {guild} /></span>
{:else if parse.type === 'role'}
	<span class="whitespace-nowrap inline-block"><Role id={parse.id as string} /></span>
{:else if parse.type === 'everyone'}
	<span class="whitespace-nowrap inline-block mention mx-1 px-1">@everyone</span>
{:else if parse.type === 'here'}
	<span class="whitespace-nowrap inline-block mention mx-1 px-1">@here</span>
{:else if parse.type === 'emoji'}
	<span class="whitespace-nowrap inline-block align-middle">
		<img
			src={`https://cdn.discordapp.com/emojis/${parse.id}.${parse.animated ? 'gif' : 'webp'}`}
			alt={(parse.name as string) || 'Emoji'}
			class="align-middle relative"
			class:w-12={useLargeEmojis}
			class:h-12={useLargeEmojis}
			class:w-7={!useLargeEmojis}
			class:h-7={!useLargeEmojis}
			style="vertical-align: middle; top: -0.1em;"
		/>
	</span>
{:else}
	<span class="text-danger">Unhandled {parse.type}</span>
{/if}
