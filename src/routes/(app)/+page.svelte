<script lang="ts">
	import { cn } from '$lib';
	import { createCalendar, deleteCalendar, getCalendars } from '$lib/remote/calendar.remote';

	export const defaultCalendarBehaviorEnum = ['exclude', 'include'] as const;
</script>

<svelte:boundary>
	{#snippet pending()}
		<span>loading</span>
	{/snippet}

	{@const calendars = await getCalendars()}
	<form
		class="grid w-full grid-cols-[min-content_1fr] gap-2 rounded-xl bg-green-300 p-3 text-right lg:flex-row"
		{...createCalendar}
	>
		<label for={createCalendar.fields.calendarName.as('text').name}>Name</label>
		<input
			class={cn(
				'rounded-md bg-white p-1',
				(createCalendar.fields.calendarName.issues() ?? []).length != 0 && 'bg-red-100'
			)}
			{...createCalendar.fields.calendarName.as('text')}
		/>
		<label for={createCalendar.fields.calendarUrl.as('text').name}>Url</label>
		<input
			class={cn(
				'rounded-md bg-white p-1',
				(createCalendar.fields.calendarUrl.issues() ?? []).length != 0 && 'bg-red-100'
			)}
			{...createCalendar.fields.calendarUrl.as('text')}
		/>
		<label for={createCalendar.fields.calendarUrl.as('select').name}> Default </label>
		<select
			class={cn('w-min rounded-md bg-white p-1')}
			{...createCalendar.fields.calendarBehavior.as('select')}
			value={'include' satisfies (typeof defaultCalendarBehaviorEnum)[number]}
		>
			{#each defaultCalendarBehaviorEnum as defaultBehavior}
				<option>{defaultBehavior}</option>
			{/each}
		</select>
		<div class="col-span-full flex w-full items-center justify-center">
			<button class="rounded-lg bg-white p-2 pr-3 pl-3 hover:bg-gray-200" onclick={() => {}}>
				Create +
			</button>
		</div>
	</form>

	{#each calendars as calendar}
		<div
			class="grid w-full min-w-0 grid-cols-[1fr_min-content] rounded-xl bg-green-200 p-2 hover:bg-green-300"
		>
			<a class="flex w-full min-w-0 flex-col text-left" href={`/${calendar.id}`}>
				<span class="font-bold">{calendar.name}</span>
				<span class="overflow-x-auto overflow-y-hidden whitespace-nowrap">{calendar.url}</span>
			</a>
			<div class="flex h-full items-center justify-center pr-2 pl-2">
				<button
					class="rounded-md bg-white pt-1.5 pr-3 pb-1.5 pl-3 hover:bg-gray-200"
					onclick={() => {
						deleteCalendar(calendar.id);
					}}
				>
					X
				</button>
			</div>
		</div>
	{/each}
</svelte:boundary>
