<script lang="ts">
	import { getCalendarEvents } from '$lib/remote/calendar.remote';
	import type { PageProps } from './$types';

	const { params }: PageProps = $props();

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

	{@const { calendarPid, calendarEvents } = await getCalendarEvents(params.calendarId)}
	<div class="grid w-full sm:grid-cols-[auto_1fr] lg:grid-cols-[1fr_2fr_1fr]">
		<div class="col-start-2 flex flex-col items-center gap-3 p-8">
			{#if calendarEvents == undefined || calendarEvents.length == 0}
				<div class="flex w-full flex-col rounded-xl bg-red-200 p-3 whitespace-pre-line">
					<span class="font-bold">No events</span>
				</div>
			{:else}
				<div class="flex w-full flex-col rounded-xl bg-green-200 p-2 whitespace-pre-line">
					<button
						class="w-min rounded-md bg-white pt-2 pr-4 pb-2 pl-4 hover:bg-gray-200"
						onclick={async () => {
							const publicLink = `${window.location.origin}/public/${calendarPid}`;
							await navigator.clipboard.writeText(publicLink);
						}}>link</button
					>
				</div>

				{#each calendarEvents as icsEvent}
					<div class="grid w-full grid-cols-[1fr_auto] rounded-xl bg-green-200 p-2">
						<div class="flex flex-col whitespace-pre-line">
							<span class="font-bold">{icsEvent.summary}</span>
							<div>
								<span>{getDate(icsEvent.start.date)} | </span>
								<span>
									{getTime(icsEvent.start.date)} - {icsEvent.end ? getTime(icsEvent.end.date) : ''}
								</span>
							</div>
							<span>{icsEvent.location}</span>
						</div>
						<div class="flex h-full w-full items-center justify-center pr-5">
							<button
								class="rounded-md bg-white pt-2 pr-4 pb-2 pl-4 hover:bg-gray-200"
								onclick={() => {}}>Y</button
							>
						</div>
					</div>
				{/each}
			{/if}
		</div>
	</div>
</svelte:boundary>
