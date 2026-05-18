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

	{@const { calendarId, calendarPid, calendarEvents, incomingCalendarUrl } =
		await getCalendarEvents(params.calendarId)}
	{#if calendarEvents == undefined || calendarEvents.length == 0}
		<div class="flex w-full flex-col rounded-xl bg-red-200 p-3 whitespace-pre-line">
			<span class="font-bold">No events</span>
		</div>
	{:else}
		<div
			class="flex w-full justify-evenly gap-3 rounded-xl bg-green-200 p-2 whitespace-pre-line lg:justify-start"
		>
			<a href="/" class="w-min rounded-md bg-white pt-2 pr-4 pb-2 pl-4 hover:bg-gray-200"> back </a>
			<button
				class="w-min rounded-md bg-white pt-2 pr-4 pb-2 pl-4 hover:bg-gray-200"
				onclick={async () => {
					const publicLink = `${window.location.origin}/public/${calendarPid}`;
					await navigator.clipboard.writeText(publicLink);
				}}
			>
				link
			</button>
			<button
				class="w-min rounded-md bg-white pt-2 pr-4 pb-2 pl-4 whitespace-nowrap hover:bg-gray-200"
				onclick={async () => {
					await navigator.clipboard.writeText(incomingCalendarUrl);
				}}
			>
				incoming calendar
			</button>
		</div>

		{#each calendarEvents as calendarEvent}
			<button
				class={cn(
					'grid w-full grid-cols-[1fr_auto] rounded-xl bg-red-200 p-2',
					calendarEvent.curated && 'bg-green-300'
				)}
				onclick={async () =>
					await curateCalendarEvent({
						calendarId,
						eventUid: calendarEvent.uid,
						becomeCurated: !calendarEvent.curated
					})}
			>
				<div class="flex flex-col text-left whitespace-pre-line">
					<span class="font-bold">{calendarEvent.summary}</span>
					<div>
						<span>{getDate(calendarEvent.start)} |</span>
						<span>
							{getTime(calendarEvent.start)}-{calendarEvent.end ? getTime(calendarEvent.end) : ''}
						</span>
					</div>
					<span>{calendarEvent.location}</span>
				</div>
				<!-- <div class="flex h-full w-full items-center justify-center pr-2"> -->
				<!-- 	<button class="rounded-md bg-white pt-1.5 pr-3 pb-1.5 pl-3 hover:bg-gray-200"> -->
				<!-- 		{calendarEvent.curated ? 'X' : 'Y'} -->
				<!-- 	</button> -->
				<!-- </div> -->
			</button>
		{/each}
	{/if}
</svelte:boundary>
