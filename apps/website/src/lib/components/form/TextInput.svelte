<script lang="ts">
	import Input from './Input.svelte';

	let {
		required = false,
		type = 'text',
		size = 'short',
		maxLen,
		minLen,
		val = $bindable(''),
		label,
		id,
		onupdate,
		onkeydown,
  disabled = false,
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
		onkeydown?: (e: KeyboardEvent) => void;
  disabled?: boolean;
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
	onkeydown={(e) => onkeydown?.(e)}
	{size}
	bind:value={val}
 {disabled}
/>
