<script lang="ts">
	const { src, thumbnail = true }: { src: string; thumbnail?: boolean } = $props();
</script>

<video
	poster={thumbnail
		? `${src.replace('cdn.', 'media.').replace('.com', '.net')}format=webp`
		: undefined}
	playsinline={true}
	height="300"
	preload="none"
	width="169"
	{src}
	loop={false}
	muted={false}
	autoplay={false}
	controls={true}
	class="max-w-169px max-h-300px w-full h-full mb-2"
>
	<track kind="captions" srclang="en" />
</video>
