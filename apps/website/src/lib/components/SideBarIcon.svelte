<script lang="ts">
	import { page } from '$app/state';

	const {
		src,
		size = 60,
		alt = '',
		bg = false,
		name,
		id,
		onHover,
		onUnhover,
	}: {
		id: string;
		bg?: boolean;
		name: string;
		src?: string;
		size?: number;
		alt?: string;
		onHover: (v: { y: number; name: string }) => void;
		onUnhover: (v: string) => void;
	} = $props();

	let self: HTMLElement | null = null;
	let barContainer: HTMLDivElement | null = $state(null);
	let img: HTMLImageElement | null = $state(null);
	let oldActive = false;
	let active = $state(false);

	const keyFrames = $derived(
		active
			? [
					{ height: '32px', left: '-10px' },
					{ height: '48px', left: '-10px' },
				]
			: [
					{ height: '48px', left: '-10px' },
					{ height: '32px', left: '-16px' },
				],
	);

	const hovered = (state: boolean) => {
		if (!self) return;

		if (src?.startsWith('a_') && img && state && id !== '@me' && id !== 'guilds') {
			img.src = `https://cdn.discordapp.com/icons/${id}/${src}.gif?size=64&ver=${Date.now()}`;
		} else if (!state && img && src && id !== 'guilds' && id !== '@me') {
			img.src = `https://cdn.discordapp.com/icons/${id}/${src}.webp?size=64`;
		}

		if (state) onHover({ y: self.getBoundingClientRect().y, name });
		else onUnhover(name);
	};

	$effect(() => {
		const returnFN = () => {
			if (!barContainer) return;
			if (!oldActive) return;
			if (active) return;

			barContainer.animate(keyFrames, {
				fill: 'forwards',
				duration: 100,
				easing: 'ease-in-out',
			});

			oldActive = active;
		};

		active =
			page.params?.guildId === id ||
			(String(page.url?.pathname).startsWith('/@me') && id === '@me') ||
			(String(page.url?.pathname).startsWith('/guilds') && id === 'guilds');

		if (!barContainer) return returnFN;
		if (!active) return returnFN;

		barContainer.animate(keyFrames, {
			fill: 'forwards',
			duration: 100,
			easing: 'ease-in-out',
		});

		oldActive = active;

		return returnFN;
	});
</script>

<a
	class="group relative"
	onmouseover={() => hovered(true)}
	onmouseleave={() => hovered(false)}
	onfocus={() => hovered(true)}
	onblur={() => hovered(false)}
	bind:this={self}
	role="button"
	tabindex="0"
	data-sveltekit-preload-data="hover"
	href={id === '@me' ? '/@me' : id === 'guilds' ? '/guilds' : `/guilds/${id}`}
>
	<div
		class="hover:rounded-[20px] flex justify-center items-center of-hidden min-w-15 min-h-15 ease-in-out transition-all duration-300 box-shadow-main w-full aspect-square of-hidden transition-all duration-100 ease-in-out"
		class:bg-main={bg || id === '@me' || id === 'guilds'}
		class:rounded-[20px]={active}
		class:rounded-[30px]={!active}
		class:hover:bg-blurple={id === '@me' || id === 'guilds'}
		class:transition-all={id === '@me' || id === 'guilds'}
		class:duration-300={id === '@me' || id === 'guilds'}
		class:ease-in-out={id === '@me' || id === 'guilds'}
	>
		{#if src}
			<img
				src={id === '@me'
					? '/favicon.webp'
					: id === 'guilds'
						? '/images/search.svg'
						: `https://cdn.discordapp.com/icons/${id}/${src}.webp?size=128`}
				width={size}
				height={size}
				{alt}
				loading="lazy"
				bind:this={img}
			/>
		{:else}
			<div
				class="bg-main hover:bg-blurple transition-all duration-300 ease-in-out w-full h-full flex justify-center items-center color-alt-text hover:color-main-text text-lg of-hidden"
			>
				{name
					.split(/\s+/g)
					.map((w) => w[0].toUpperCase())
					.join('')
					.slice(0, 5)}
			</div>
		{/if}
	</div>

	<div
		class="absolute w-2 h-8 bg-main-text -left-4 top-50% -translate-y-50% content-empty rounded-full z-10 -translate-y-5"
		bind:this={barContainer}
	></div>
</a>
