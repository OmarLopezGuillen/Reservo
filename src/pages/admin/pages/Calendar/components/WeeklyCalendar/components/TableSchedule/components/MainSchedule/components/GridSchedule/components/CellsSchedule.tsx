import { addMinutes, format, isEqual, isWithinInterval } from "date-fns"
import { useMemo, useState } from "react"
import { useAuthUser } from "@/auth/hooks/useAuthUser"
import { Button } from "@/components/ui/button"
import { useBookings } from "@/hooks/useBookingsQuery"
import { useCourts } from "@/hooks/useCourtsQuery"
import type { Booking } from "@/models/booking.model"
import { EventCard } from "@/pages/admin/pages/Calendar/components/WeeklyCalendar/components/TableSchedule/components/MainSchedule/components/GridSchedule/components/EventCard"
import { useCourtsStore } from "@/pages/admin/pages/Calendar/components/WeeklyCalendar/store/courtsSelectedStore"
import { EditBookingDialog } from "./EditBookingDialog"
import { NewBookingDialog } from "./NewBookingDialog"

const isEventStart = (event: Booking, time: Date) => {
	return isEqual(event.startTime, time)
}

function betweenDates(date: Date, start: Date, end: Date) {
	return isWithinInterval(date, { start, end: addMinutes(end, -1) })
}

interface Props {
	dayIndex: number
	time: number
	weekDates: Date[]
}

export const CellsSchedule = ({ weekDates, dayIndex, time }: Props) => {
	const user = useAuthUser()
	const date = weekDates[dayIndex]
	const timeDate = addMinutes(date, time)

	//TODO: O. Crear un useQuery que traiga los bookings por semana?
	const { bookingsQuery } = useBookings(user.clubId!)

	const bookings = useMemo(() => {
		return (bookingsQuery.data ?? [])
			.filter((booking) => booking.status !== "cancelled")
			.map((booking) => ({
				...booking,
				startTime: new Date(booking.startTime),
				endTime: new Date(booking.endTime),
			}))
	}, [bookingsQuery.data])

	const { courtsQuery } = useCourts(user.clubId!)
	const [isNewBookingDialogOpen, setIsNewBookingDialogOpen] = useState(false)
	const [isEditBookingDialogOpen, setIsEditBookingDialogOpen] = useState(false)
	const [selectedSlot, setSelectedSlot] = useState<{
		date: Date
		courtId: string
	} | null>(null)
	const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)

	const handleSlotClick = (date: Date, courtId: string) => {
		setSelectedSlot({ date, courtId })
		setIsNewBookingDialogOpen(true)
	}

	const handleEventClick = (booking: Booking) => {
		setSelectedBooking(booking)
		setIsEditBookingDialogOpen(true)
	}

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
		<>
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
							onClick={() =>
								handleSlotClick(timeDate, "multiple-courts-selected")
							}
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
										onClick={() => handleEventClick(eventCourt)}
									/>
								) : isInsideEventCourt ? null : (
									<Button
										variant="ghost"
										key={`btn-${timeDate.getTime()}-${dayIndex}`}
										onClick={() => handleSlotClick(timeDate, court.id)}
										className="text-muted-foreground/50 text-center w-full rounded-none h-[30px]"
									>
										{format(timeDate, "HH:mm")}
									</Button>
								)}
							</span>
						)
					})}
			</div>
			<NewBookingDialog
				isOpen={isNewBookingDialogOpen}
				onOpenChange={setIsNewBookingDialogOpen}
				slot={selectedSlot}
				clubId={user.clubId!}
			/>
			<EditBookingDialog
				booking={selectedBooking}
				isOpen={isEditBookingDialogOpen}
				onOpenChange={setIsEditBookingDialogOpen}
			/>
		</>
	)
}
