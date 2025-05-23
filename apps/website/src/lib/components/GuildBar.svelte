<script lang="ts">
	import SideBarIcon from '$lib/components/SideBarIcon.svelte';
	import type { RGuild } from '$lib/scripts/RTypes';
	import { hideDot, setMouse, showName } from './GuildBar';

	const { guilds }: { guilds: RGuild[] } = $props();

	let nameContainer: HTMLDivElement | null = $state(null);
	let dotContainer: HTMLDivElement | null = $state(null);

	let currentName: string | null = $state(null);
	let mouseY = $state(0);

	let guildBarSection: HTMLElement | null = $state(null);
</script>

<svelte:body onmousemove={(e) => setMouse(e.clientY, mouseY)} />

<section
	class="bg-main-darker flex flex-col justify-start items-center gap-2 p-2 h-98lvh box-shadow-main z-10
 of-y-scroll of-auto hide-scrollbar w-auto min-w-20"
	onmouseleave={() => hideDot(dotContainer!)}
	onscroll={() => scroll()}
	role="navigation"
	bind:this={guildBarSection}
>
	<div
		class="w-16 fixed z-5
  before:content-empty before:bg-main-darker before:w-20 before:-left-2 before:h-20 before:absolute
  before:-top-2 after:relative"
	>
		<hr
			class="border-t-2 border-main rounded-full w-full m-auto z-5 absolute -bottom-2 left-50% -translate-x-50%"
		/>

		<SideBarIcon
			src="search.svg"
			name="Browse Guilds"
			size={40}
			bg
			id="guilds"
			onHover={(e) => {
				showName(e, dotContainer!, nameContainer!);
				currentName = e.name;
			}}
			onUnhover={() => (currentName = null)}
		/>
	</div>
	<div class="h-100lvh mt-10 w-full">
		<div class="content-empty h-8 min-w-12 sm:min-w-14 md:min-w-16"></div>
		{#each guilds as guild, i}
			{#if i !== 0}
				<br class="mt-2.5 content-empty block" />
			{/if}
			<SideBarIcon
				src={guild.icon_url || undefined}
				id={guild.id}
				bg={!guild.icon_url}
				name={guild.name}
				onHover={(e) => {
					showName(e, dotContainer!, nameContainer!);
					currentName = e.name;
				}}
				onUnhover={() => (currentName = null)}
			/>
		{/each}

		<div class="mt-3">
			<SideBarIcon
				src="add.svg"
				name="Add Guild"
				size={40}
				bg
				id="add"
				onHover={(e) => {
					showName(e, dotContainer!, nameContainer!);
					currentName = e.name;
				}}
				onUnhover={() => (currentName = null)}
			/>
		</div>

		<div class="content-empty h-19"></div>
	</div>
</section>

<div
	bind:this={nameContainer}
	class="absolute bg-main-darkest left-16 sm:left-18 md:left-20 top-50% -translate-y-50% w-fit max-w-[140px] sm:max-w-[170px] md:max-w-[200px]
  whitespace-normal break-words rounded-[5px] border-alt-text border-op-50 border-0.1px
  border-solid px-2 sm:px-3 py-1 box-shadow-main font-bold z-20 text-xs sm:text-sm md:text-base"
	class:hidden={!currentName}
>
	{currentName}
</div>

<div
	class="absolute w-1.5 sm:w-2 h-6 sm:h-8 bg-main-text/80 -left-1.5 sm:-left-2 top-0 content-empty rounded-full z-10 -translate-y-3"
	bind:this={dotContainer}
></div>
