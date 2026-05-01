<script lang="ts">
	import { cn } from '$lib';
	import { getDate, getTime } from '$lib/date';
	import { curateCalendarEvent, getCalendarEvents } from '$lib/remote/calendar.remote';
	import type { PageProps } from './$types';

	const { params }: PageProps = $props();
</script>

<svelte:boundary>
	{#snippet pending()}
		<span>loading</span>
	{/snippet}

	{@const { calendarId, calendarPid, calendarEvents } = await getCalendarEvents(params.calendarId)}
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

				{#each calendarEvents as calendarEvent}
					<div
						class={cn(
							'grid w-full grid-cols-[1fr_auto] rounded-xl bg-blue-300 p-2',
							calendarEvent.curated && 'bg-green-300'
						)}
					>
						<div class="flex flex-col whitespace-pre-line">
							<span class="font-bold">{calendarEvent.summary}</span>
							<div>
								<span>{getDate(calendarEvent.start)} |</span>
								<span>
									{getTime(calendarEvent.start)}-{calendarEvent.end
										? getTime(calendarEvent.end)
										: ''}
								</span>
							</div>
							<span>{calendarEvent.location}</span>
						</div>
						<div class="flex h-full w-full items-center justify-center pr-5">
							<button
								class="rounded-md bg-white pt-2 pr-4 pb-2 pl-4 hover:bg-gray-200"
								onclick={async () =>
									await curateCalendarEvent({
										calendarId,
										eventUid: calendarEvent.uid,
										becomeCurated: !calendarEvent.curated
									})}
							>
								{calendarEvent.curated ? 'X' : 'Y'}
							</button>
						</div>
					</div>
				{/each}
			{/if}
		</div>
	</div>
</svelte:boundary>
