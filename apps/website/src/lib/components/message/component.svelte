<script lang="ts">
	import {
		ButtonStyle,
		ComponentType,
		type APIButtonComponent,
		type APIButtonComponentWithCustomId,
		type APIButtonComponentWithURL,
		type APIComponentInMessageActionRow,
		type APIMessageTopLevelComponent,
	} from 'discord-api-types/v10';
	import Component from './component.svelte';
	import Button from '../form/Button.svelte';

	const { component }: { component: APIMessageTopLevelComponent | APIComponentInMessageActionRow } =
		$props();
</script>

{#if component.type === ComponentType.ActionRow}
	<div class="flex flex-row gap-2 justify-start items-center">
		{#each component.components as subComponent}
			<Component component={subComponent} />
		{/each}
	</div>
{:else if component.type === ComponentType.Button}
	{@const button = component as APIButtonComponent}

	{#if button.style === ButtonStyle.Link}
		{@const labelButton = button as APIButtonComponentWithURL}
		<a href={labelButton.url} target="_blank" rel="noopener noreferrer">
			<Button
				disabled={labelButton.disabled}
				text={labelButton.label || ''}
				style="link"
				emoji={labelButton.emoji}
			/>
		</a>
	{:else}
		{@const labelButton = button as APIButtonComponentWithCustomId}

		<div class="flex flex-col">
			<Button
				disabled={labelButton.disabled}
				text={labelButton.label || ''}
				emoji={labelButton.emoji}
				style={labelButton.style === ButtonStyle.Primary
					? 'primary'
					: labelButton.style === ButtonStyle.Danger
						? 'red'
						: labelButton.style === ButtonStyle.Secondary
							? 'secondary'
							: labelButton.style === ButtonStyle.Success
								? 'green'
								: 'inverted-white'}
			/>
			<span class="text-2">{labelButton.custom_id}</span>
		</div>
	{/if}
{:else}
	<span class="text-danger">
		Unhandled {ComponentType[component.type]} component
	</span>
{/if}
