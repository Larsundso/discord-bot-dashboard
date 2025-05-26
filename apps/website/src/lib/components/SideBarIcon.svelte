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

	let self: HTMLElement | null = $state(null);
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

		if (src?.includes('a_') && img && state && !['@me', 'guilds', 'add'].includes(id)) {
			img.src = `${src.split('.').slice(0, -1).join('.')}.gif?size=64&ver=${Date.now()}`;
		} else if (!state && img && src && !['@me', 'guilds', 'add'].includes(id)) {
			img.src = `${src.split('.').slice(0, -1).join('.')}.webp?size=64`;
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
			(String(page.url?.pathname) === '/guilds' && id === 'guilds');

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
	class="group relative inline-block of-initial"
	class:my-1={!['@me', 'guilds', 'add'].includes(id)}
	onmouseover={() => hovered(true)}
	onmouseleave={() => hovered(false)}
	onfocus={() => hovered(true)}
	onblur={() => hovered(false)}
	bind:this={self}
	role="button"
	tabindex="0"
	data-sveltekit-preload-data={id === 'guilds' ? 'off' : 'tap'}
	href={id === '@me'
		? '/@me'
		: id === 'guilds'
			? '/guilds'
			: id === 'add'
				? `https://discord.com/oauth2/authorize?client_id=${self?.id}&permissions=8&integration_type=0&scope=bot`
				: `/guilds/${id}`}
	target={id === 'add' ? '_blank' : undefined}
>
	<div
		class="hover:rounded-[20px] flex justify-center items-center of-hidden min-w-15 min-h-15 ease-in-out transition-all duration-300 box-shadow-main w-full aspect-square of-hidden transition-all duration-100 ease-in-out"
		class:bg-main={bg || ['@me', 'guilds'].includes(id)}
		class:rounded-[20px]={active}
		class:rounded-[30px]={!active}
		class:bg-blurple={id === 'add'}
		class:hover:bg-success={id === 'add'}
		class:hover:bg-blurple={['@me', 'guilds'].includes(id)}
		class:transition-all={['@me', 'guilds', 'add'].includes(id)}
		class:duration-300={['@me', 'guilds', 'add'].includes(id)}
		class:ease-in-out={['@me', 'guilds', 'add'].includes(id)}
	>
		{#if src}
			<img
				src={id === '@me'
					? '/favicon.webp'
					: id === 'guilds'
						? '/images/search.svg'
						: id === 'add'
							? '/images/add.svg'
							: src}
				width={size}
				height={size}
				{alt}
				loading="lazy"
				decoding="async"
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
