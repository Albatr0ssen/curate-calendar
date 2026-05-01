<script lang="ts">
	import { cn } from '$lib';
	import { createCalendar, getCalendars } from '$lib/remote/calendar.remote';
</script>

<svelte:boundary>
	{#snippet pending()}
		<span>loading</span>
	{/snippet}

	{@const calendars = await getCalendars()}
	<div class="grid w-full sm:grid-cols-[auto_1fr] lg:grid-cols-[1fr_2fr_1fr]">
		<div class="col-start-2 flex flex-col items-center gap-3 p-8">
			<form
				class="flex w-full items-center justify-evenly rounded-xl bg-green-300 p-3"
				{...createCalendar}
			>
				<input
					class={cn(
						'rounded-md bg-white p-1',
						(createCalendar.fields.calendarName.issues() ?? []).length != 0 && 'bg-red-100'
					)}
					{...createCalendar.fields.calendarName.as('text')}
				/>
				<input
					class={cn(
						'rounded-md bg-white p-1',
						(createCalendar.fields.calendarUrl.issues() ?? []).length != 0 && 'bg-red-100'
					)}
					{...createCalendar.fields.calendarUrl.as('text')}
				/>
				<button class="size-10 rounded-lg bg-white text-2xl hover:bg-gray-200" onclick={() => {}}>
					+
				</button>
			</form>

			{#each calendars as calendar}
				<a
					class="flex w-full flex-col rounded-xl bg-green-200 p-2 text-left whitespace-pre-line hover:bg-green-300 lg:w-200"
					href={`/${calendar.id}`}
				>
					<span class="font-bold">{calendar.name}</span>
					<span class="max-w-full overflow-x-scroll text-nowrap">{calendar.url}</span>
				</a>
			{/each}
		</div>
	</div>
</svelte:boundary>
