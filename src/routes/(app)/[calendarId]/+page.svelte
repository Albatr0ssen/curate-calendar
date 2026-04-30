<script lang="ts">
	import { getCalendarEvents } from '$lib/remote/calendar.remote';

	function getDate(date: Date) {
		const year = date.getFullYear();
		const month = (date.getMonth() + 1).toString().padStart(2, '0');
		const day = date.getDate().toString().padStart(2, '0');
		return `${year}-${month}-${day}`;
	}

	function getTime(date: Date) {
		const hours = date.getHours().toString().padStart(2, '0');
		const minutes = date.getMinutes().toString().padStart(2, '0');
		return `${hours}:${minutes}`;
	}
</script>

<svelte:boundary>
	{#snippet pending()}
		<span>loading</span>
	{/snippet}

	{@const calendarEvents = await getCalendarEvents()}
	<div class="grid w-full sm:grid-cols-[auto_1fr] lg:grid-cols-[1fr_2fr_1fr]">
		<div class="col-start-2 flex flex-col items-center gap-3 p-8">
			<div class="flex w-full justify-between rounded-xl bg-green-300 p-3">
				<div></div>
				<div>
					<button class="size-10 rounded-lg bg-white text-2xl hover:bg-gray-200">+</button>
				</div>
			</div>

			{#each calendarEvents as icsEvent}
				<div class="flex w-full flex-col rounded-xl bg-green-200 p-2 whitespace-pre-line">
					<span class="font-bold">{icsEvent.summary}</span>
					<div>
						<span>{getDate(icsEvent.start.date)} | </span>
						<span>
							{getTime(icsEvent.start.date)} - {icsEvent.end ? getTime(icsEvent.end.date) : ''}
						</span>
					</div>
					<span>{icsEvent.location}</span>
					<!-- <span class="text-sm">{calEvent.description}</span> -->
				</div>
			{/each}
		</div>
	</div>
</svelte:boundary>
