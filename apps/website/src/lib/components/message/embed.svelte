<script lang="ts">
	import type { RGuild } from '$lib/scripts/RTypes';
	import type { APIEmbed, APIEmbedField } from 'discord-api-types/v10';
	import Content from './content.svelte';

	const { embed, guild }: { embed: APIEmbed; guild?: RGuild | undefined } = $props();

	const getEmbedColor = (color?: number) => {
		if (color === undefined || color === null || color === 0) return undefined;
		return `#${color.toString(16).padStart(6, '0')}`;
	};

	const formatEmbedTimestamp = (isoString?: string) => {
		if (!isoString) return '';
		const date = new Date(isoString);
		const day = String(date.getDate()).padStart(2, '0');
		const month = String(date.getMonth() + 1).padStart(2, '0');
		const year = date.getFullYear();
		let hours = date.getHours();
		const minutes = String(date.getMinutes()).padStart(2, '0');
		const ampm = hours >= 12 ? 'PM' : 'AM';
		hours = hours % 12;
		hours = hours ? hours : 12;
		const strHours = String(hours);

		return `${day}/${month}/${year} ${strHours}:${minutes} ${ampm}`;
	};

	type FieldRow = APIEmbedField[];
	let fieldRows: FieldRow[] = $state([]);

	$effect(() => {
		const newFieldRows: FieldRow[] = [];
		if (embed.fields && embed.fields.length > 0) {
			let currentRow: APIEmbedField[] = [];
			for (let i = 0; i < embed.fields.length; i++) {
				const field = embed.fields[i];
				if (field.inline) {
					currentRow.push(field);
					if (
						currentRow.length === 3 ||
						i === embed.fields.length - 1 ||
						(i + 1 < embed.fields.length && !embed.fields[i + 1]?.inline)
					) {
						newFieldRows.push(currentRow);
						currentRow = [];
					}
				} else {
					if (currentRow.length > 0) {
						newFieldRows.push(currentRow);
						currentRow = [];
					}
					newFieldRows.push([field]);
				}
			}
			if (currentRow.length > 0) {
				newFieldRows.push(currentRow);
			}
		}
		fieldRows = newFieldRows;
	});

	const embedBorderColor = $derived(getEmbedColor(embed.color));
	const timestampFormatted = $derived(formatEmbedTimestamp(embed.timestamp));
</script>

{#if Object.keys(embed).length > 0}
	<div
		class="border-l-solid rounded dark:text-gray-100 grid pr-4 pb-4 pl-3 bg-main-darker border border-l-4 pt-[2px] m-1 max-w-520px"
		style={`border-color: ${embedBorderColor};`}
	>
		<!-- Author -->
		{#if embed.author}
			<div class="min-w-0 flex mt-2 items-center col-start-1 col-end-2 row-auto">
				{#if embed.author.icon_url}
					<img
						class="h-6 w-6 mr-2 object-contain rounded-full"
						src={embed.author.icon_url}
						alt="Author icon"
					/>
				{/if}
				{#if embed.author.name}
					<p class="font-medium text-sm whitespace-normal [overflow-wrap:anywhere] inline-block my-auto">
						{#if embed.author.url}
							<a
								href={embed.author.url}
								target="_blank"
								rel="noreferrer nofollow ugc"
								class="hover:underline"
							>
								<span>{embed.author.name}</span>
							</a>
						{:else}
							<span>{embed.author.name}</span>
						{/if}
					</p>
				{/if}
			</div>
		{/if}

		<!-- Title -->
		{#if embed.title}
			<div
				class="text-base leading-[1.375] font-semibold mt-2 block w-full [overflow-wrap:anywhere] break-words max-w-100% of-hidden col-start-1 col-end-2 row-auto"
			>
				{#if embed.url}
					<a
						href={embed.url}
						class="text-blue hover:underline underline-offset-1 break-words"
						target="_blank"
						rel="noreferrer nofollow ugc"
					>
						<div class="break-words [overflow-wrap:anywhere]">
							<Content content={embed.title} />
						</div>
					</a>
				{:else}
					<div class="break-words [overflow-wrap:anywhere]">
						<Content content={embed.title} />
					</div>
				{/if}
			</div>
		{/if}

		<!-- Description -->
		{#if embed.description}
			<div
				class="text-sm font-normal mt-2 block w-full break-words [overflow-wrap:anywhere] of-hidden whitespace-normal col-start-1 col-end-2 row-auto"
			>
				<Content content={embed.description ?? null} {guild} inEmbed={true} />
			</div>
		{/if}

		<!-- Fields -->
		{#if fieldRows.length > 0}
			<div
				class="text-sm leading-[1.125rem] grid col-start-1 col-end-2 gap-2 mt-2 w-full flex flex-col justify-center items-between"
			>
				{#each fieldRows as row, rowIndex (`fr-${rowIndex}`)}
					<div class="flex flex-row gap-2 w-full">
						{#each row as field, fieldIndexInRow (`f-${rowIndex}-${fieldIndexInRow}`)}
							<div class="min-w-33% overflow-hidden">
								{#if field.name}
									<div class="font-semibold mb-[2px] text-ellipsis overflow-hidden">
										<div class="break-words [overflow-wrap:anywhere]">
											{field.name}
										</div>
									</div>
								{/if}
								{#if field.value}
									<div class="font-normal whitespace-pre-line text-ellipsis overflow-hidden">
										<Content content={field.value} />
									</div>
								{/if}
							</div>
						{/each}
					</div>
				{/each}
			</div>
		{/if}

		<!-- Image -->
		{#if embed.image?.url}
			<div class="mt-2 w-full col-start-1 col-end-3">
				<div class="w-full">
					<img
						src={embed.image.url}
						class="block object-contain rounded-lg max-w-full max-h-[350px]"
						alt={embed.title || 'Embed image'}
					/>
				</div>
			</div>
		{/if}

		<!-- Thumbnail -->
		{#if embed.thumbnail?.url}
			<div class="flex mt-2 ml-4 justify-self-end h-fit max-h-80px [grid-area:1/2/2/3]">
				<img
					src={embed.thumbnail.url}
					class="rounded max-w-[80px] max-h-20 object-contain"
					alt="Thumbnail"
				/>
			</div>
		{/if}

		<!-- Footer -->
		{#if embed.footer || timestampFormatted}
			<div class="min-w-0 flex mt-2 font-medium text-xs items-center">
				{#if embed.footer?.icon_url}
					<img
						class="h-5 w-5 mr-2 object-contain rounded-full"
						src={embed.footer.icon_url}
						alt="Footer icon"
					/>
				{/if}
				{#if embed.footer?.text}
					<div class="whitespace-normal [overflow-wrap:anywhere] inline-block my-auto">
						<Content content={embed.footer.text} />
					</div>
				{/if}
				{#if embed.footer?.text && timestampFormatted}
					<p class="mx-1 my-auto">•</p>
				{/if}
				{#if timestampFormatted}
					<p class="whitespace-normal [overflow-wrap:anywhere] inline-block my-auto">
						{timestampFormatted}
					</p>
				{/if}
			</div>
		{/if}
	</div>
{/if}
