<script lang="ts">
	const { text, filter }: { text: string | null; filter: string } = $props();
</script>

<div
	class="absolute bg-main-darkest w-fit max-w-[140px] sm:max-w-[170px] md:max-w-[200px]
  whitespace-normal break-words rounded-[5px] border-alt-text border-op-50 border-0.1px
  border-solid px-2 sm:px-3 py-1 box-shadow-main font-bold z-11 text-xs sm:text-sm md:text-base"
	class:hidden={!text || filter !== text}
>
	{text}
</div>
