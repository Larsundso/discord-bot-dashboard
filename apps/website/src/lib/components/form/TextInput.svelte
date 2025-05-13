<script lang="ts">
	import Input from './Input.svelte';

	const {
		required = false,
		type = 'text',
		size = 'short',
		maxLen,
		minLen,
		val,
		label,
		id,
		onupdate,
	}: {
		required: boolean;
		type?: 'text' | 'number' | 'email' | 'password';
		size?: 'short' | 'paragraph';
		maxLen?: number;
		minLen?: number;
		val?: string;
		label: string;
		id?: string;
		onupdate?: (v: string | null) => void;
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
	onupdate={(val) => onupdate?.(val ? String(val) : null)}
	{size}
/>
