import { addMinutes, format, isEqual, isWithinInterval } from "date-fns"
import { Button } from "@/components/ui/button"
import { useCourts } from "@/hooks/useCourtsQuery"
import type { Booking } from "@/models/booking.model"
import { EventCard } from "@/pages/admin/pages/Calendar/components/WeeklyCalendar/components/TableSchedule/components/MainSchedule/components/GridSchedule/components/EventCard"
import { useCourtsStore } from "@/pages/admin/pages/Calendar/components/WeeklyCalendar/store/courtsSelectedStore"

const isEventStart = (event: Booking, time: Date) => {
	return isEqual(event.startTime, time)
}

function betweenDates(date: Date, start: Date, end: Date) {
	return isWithinInterval(date, { start, end: addMinutes(end, -1) })
}

const bookings: Booking[] = [
	{
		id: "98058bb4-de7a-4f69-853b-b9b21dba70f2",
		clubId: "a32a865d-3ecc-448b-a38d-9da8a10cca59",
		courtId: "4d939657-5a94-4cd7-b2f8-d463421b225b",
		userId: "57f413b8-f532-49c2-97e5-b2f26c945ab6",
		price: 20,
		date: "2025-11-14",
		startTime: new Date("2025-11-14T16:30:00.000Z"),
		endTime: new Date("2025-11-14T17:30:00.000Z"),
		status: "confirmed",
		paymentStatus: "paid",
		paymentMode: "none",
		depositPercentage: 0,
		acceptsMaketing: false,
		acceptsWhatsup: false,
		checkInCode: "53FTNE",
		note: null,
		createdAt: "2025-11-14T12:17:49.714592+00:00",
		updatedAt: null,
	},
	{
		id: "98058bb4-de7a-4f69-853b-b9b21dba70f1",
		clubId: "a32a865d-3ecc-448b-a38d-9da8a10cca59",
		courtId: "ae632488-63dd-4892-a0f9-134447f7cebd",
		userId: "57f413b8-f532-49c2-97e5-b2f26c945ab6",
		price: 20,
		date: "2025-11-14",
		startTime: new Date("2025-11-14T15:30:00.000Z"),
		endTime: new Date("2025-11-14T17:00:00.000Z"),
		status: "confirmed",
		paymentStatus: "pending",
		paymentMode: "none",
		depositPercentage: 0,
		acceptsMaketing: false,
		acceptsWhatsup: false,
		checkInCode: "53FTNE",
		note: null,
		createdAt: "2025-11-14T12:17:49.714592+00:00",
		updatedAt: null,
	},
]

interface Props {
	dayIndex: number
	time: number
	weekDates: Date[]
}

export const CellsSchedule = ({ weekDates, dayIndex, time }: Props) => {
	const date = weekDates[dayIndex]
	const timeDate = addMinutes(date, time)

	const { courtsQuery } = useCourts("a32a865d-3ecc-448b-a38d-9da8a10cca59")
	const courtsSelected = useCourtsStore((state) => state.courtsSelected)

	const courts = courtsQuery.data?.filter((court) =>
		courtsSelected.includes(court.id),
	)

	const eventAtCell = (courtId: string) =>
		bookings.find(
			(event) => isEventStart(event, timeDate) && event.courtId === courtId,
		)

	const isInsideEvent = (courtId: string) =>
		bookings.some(
			(event) =>
				betweenDates(timeDate, event.startTime, event.endTime) &&
				event.courtId === courtId,
		)

	const hasAnyEvent = (timeDate: Date) => {
		return bookings.some(
			(event) =>
				(isEventStart(event, timeDate) &&
					courtsSelected.includes(event.courtId)) ||
				(betweenDates(timeDate, event.startTime, event.endTime) &&
					courtsSelected.includes(event.courtId)),
		)
	}

	return (
		<div
			className=" grid border-b last:border-b-0 "
			style={{
				gridTemplateColumns: `repeat(${courts?.length}, minmax(0, 1fr))`,
			}}
			key={`cell-${timeDate.getTime()}-${dayIndex}}`}
		>
			{!hasAnyEvent(timeDate) && (
				<span
					key={`cell-${timeDate.getTime()}-${dayIndex}`}
					className="relative"
					style={{
						gridColumn: `span ${courts?.length}`,
					}}
				>
					<Button
						variant="ghost"
						key={`btn-${timeDate.getTime()}-${dayIndex}`}
						onClick={() => window.alert(`${format(timeDate, "dd-MM HH:mm")}`)}
						className="text-muted-foreground/50 text-center w-full rounded-none h-[30px]"
					>
						{format(timeDate, "HH:mm")}
					</Button>
				</span>
			)}

			{hasAnyEvent(timeDate) &&
				courts?.map((court) => {
					const eventCourt = eventAtCell(court.id)
					const isInsideEventCourt = isInsideEvent(court.id)

					return (
						<span
							key={`cell-${timeDate.getTime()}-${dayIndex}-${court.id}`}
							className="relative border-r"
						>
							{eventCourt ? (
								<EventCard
									key={eventCourt.id}
									booking={eventCourt}
									court={court}
								/>
							) : isInsideEventCourt ? null : (
								<Button
									variant="ghost"
									key={`btn-${timeDate.getTime()}-${dayIndex}`}
									onClick={() =>
										window.alert(
											`${format(timeDate, "dd-MM HH:mm")} ${court.id}`,
										)
									}
									className="text-muted-foreground/50 text-center w-full rounded-none h-[30px]"
								>
									{format(timeDate, "HH:mm")}
								</Button>
							)}
						</span>
					)
				})}
		</div>
	)
}
