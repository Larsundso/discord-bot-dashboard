<script lang="ts">
	import { page } from '$app/state';
	const { text, href, active = false }: { text: string; href: string; active?: boolean } = $props();
</script>

<a
	{href}
	data-sveltekit-preload-data
	data-sveltekit-keepfocus
	data-sveltekit-replacestate
	class:bg-main-lighter={page.url?.pathname.startsWith(href) || active}
	class="hover:bg-main-light transition-all duration-50 ease-in-out
 w-full my-0.2 rounded-sm px-2 py-0.5"
>
	{text}
</a>
