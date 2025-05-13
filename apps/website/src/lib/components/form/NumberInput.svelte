<script lang="ts">
	import Input from './Input.svelte';

	const {
		required = false,
		type = 'number',
		maxLen,
		minLen,
		maxVal,
		minVal,
		val,
		label,
		id,
		onupdate,
	}: {
		required: boolean;
		type?: 'text' | 'number' | 'email' | 'password';
		maxLen?: number;
		minLen?: number;
		maxVal?: number;
		minVal?: number;
		val?: string;
		label: string;
		id?: string;
		onupdate?: (v: number | null) => void;
	} = $props();
</script>

<Input
	{type}
	{required}
	{label}
	{maxLen}
	{minLen}
	{val}
	{id}
	{maxVal}
	{minVal}
	onupdate={(val) => onupdate?.(val ? Number(val) : null)}
/>
