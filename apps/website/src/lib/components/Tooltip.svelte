<script lang="ts">
	const { text, filter }: { text: string | null; filter: string } = $props();
</script>

<div
	class="absolute bg-main-darkest w-fit max-w-[200px]
  whitespace-normal break-words rounded-[5px] border-alt-text border-op-50 border-0.1px
  border-solid px-3 py-1 box-shadow-main font-bold z-11"
	class:hidden={!text || filter !== text}
>
	{text}
</div>
