<script lang="ts">
	import { page } from '$app/state';
	import Button from '$lib/components/form/Button.svelte';
	import TextInput from '$lib/components/form/TextInput.svelte';
	import Timestamp from '$lib/components/form/Timestamp.svelte';
	import rgbaFromHex from '$lib/scripts/util/rgbaFromHex';
	import type { PageData, PageParentData } from './$types';

	const { data }: { data: PageData & PageParentData } = $props();
	const role = $derived(data.roles.find((r) => r.id === page.params.roleId)!);
	const rgba = $derived(rgbaFromHex(role.color.toString(16).padStart(6, '0')));
</script>

<div class="ml-4 text-xl p-2 flex flex-row justify-between items-center">
	<span>Edit role - {role.name}</span>
	<code class="text-xs">{role.id}</code>
</div>

<div class="flex flex-row">
	<form
		class="flex flex-col justify-start items-start bg-main-light h-[calc(100vh-45px)] ml-2 p-4 rounded-tl-xl of-auto w-50% gap-1"
	>
		<h2 class="text-xl color-alt-text">Display</h2>

		<label for="name">Role Name</label>
		<div class="w-full">
			<TextInput
				label="Role Name"
				required={true}
				id="name"
				maxLen={100}
				minLen={2}
				size="short"
				type="text"
				val={role.name}
				disabled={role.name === '@everyone'}
			/>
		</div>

		<label for="name">Role Colour</label>
		<div class="w-full">
			<TextInput
				label="Role Name"
				required={false}
				id="name"
				maxLen={100}
				minLen={2}
				size="short"
				type="text"
				val="#{role.color.toString(16).padStart(6, '0')}"
			/>
		</div>

		<label for="name">Role Icon</label>
		<div class="flex flex-row justify-start items-center gap-2">
			{#if role.icon_url}
				<div class="bg-main-dark rounded-lg p-2">
					<img src="{role.icon_url}?size=4096" alt="" class="w-20 h-auto max-w-20 max-h-20" />
				</div>
			{:else}
				<div class="bg-main-dark rounded-lg p-2">
					<i class="i-tabler-question-mark block w-20 h-20"></i>
				</div>
			{/if}

			<Button disabled={true} text="Choose Image" style="primary-outline" />
			<Button disabled={true} text="Remove Icon" style="red-outline" />
		</div>

		<h2 class="text-xl color-alt-text mt-4">Permissions</h2>
	</form>

	<div class="flex flex-col justify-start items-start bg-main-light h-[calc(100vh-45px)] w-50% p-2">
		{#each new Array(8).fill(null) as _, i}
			<div
				class="flex flex-row justify-start items-start gap-3 p-2 w-full"
				class:rounded-t-xl={i === 0}
				class:bg-main-darkest={i === 0}
				class:bg-main-pre-darkest={i === 1}
				class:bg-main-darker={i === 1}
				class:bg-main-dark={i === 2}
				class:bg-main-dark-hover={i === 3}
				class:bg-main={i === 4}
				class:bg-main-light={i === 5}
				class:bg-main-lighter={i === 6}
				class:bg-fake-white={i === 7}
				class:rounded-b-xl={i === 7}
			>
				<img src={data.self?.avatar_url} class="rounded-full h-15 w-15" alt="" />
				<div class="flex flex-col justify-start items-start gap-2">
					<div class="flex flex-row justify-start items-center gap-2">
						<span
							class:color-black!={i === 7 && (!role.color || role.color === 0)}
							class="color-[rgb(var(--bg-color-r),var(--bg-color-g),var(--bg-color-b))]"
							style="--bg-color-r: {rgba[0]}; --bg-color-g: {rgba[1]}; --bg-color-b: {rgba[2]};"
						>
							{data.self?.global_name || data.self?.username}
						</span>
						{#if role.icon_url}
							<img src={role.icon_url} alt="" class="w-6 h-6" />
						{:else if role.unicode_emoji}
							<span class="w-6 h-6">{role.unicode_emoji}</span>
						{/if}

						<span class="text-xs color-alt-text" class:text-black!={i === 7}>
							<Timestamp time={Date.now()} type="f" />
						</span>
					</div>

					<span class:text-black={i === 7}>rocks are really old</span>
				</div>
			</div>
		{/each}
	</div>
</div>
