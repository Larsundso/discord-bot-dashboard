<script lang="ts">
	const { src }: { src: string } = $props();
</script>

<video
	playsinline={true}
	height="300"
	preload="none"
	width="169"
	{src}
	loop={true}
	muted={true}
	autoplay={true}
	controls={false}
	class="max-w-169px max-h-300px w-full h-full"
>
	<track kind="captions" srclang="en" />
</video>
