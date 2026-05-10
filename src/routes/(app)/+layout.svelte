<script lang="ts">
	let { children } = $props();
</script>

<div class="grid w-full grid-cols-[auto_1fr] lg:grid-cols-[1fr_2fr_1fr]">
	<div class="col-start-2 flex flex-col items-center gap-3 p-3">
		{@render children()}
	</div>
</div>
