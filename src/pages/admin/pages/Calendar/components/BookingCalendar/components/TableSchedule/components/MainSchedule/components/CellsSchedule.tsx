import { addMinutes, format, isEqual, isWithinInterval } from "date-fns"
import { useMemo, useState } from "react"
import { useAuthUser } from "@/auth/hooks/useAuthUser"
import { Button } from "@/components/ui/button"
import { useBookings } from "@/hooks/useBookingsQuery"
import { useCourtBlocksMutations } from "@/hooks/useCourtBlocksMutations"
import { useCourtBlocksByCourtIds } from "@/hooks/useCourtBlocksQuery"
import { useCourts } from "@/hooks/useCourtsQuery"
import type { Booking } from "@/models/booking.model"
import {
	CourtBlockCard,
	type CourtBlockVisual,
} from "@/pages/admin/pages/Calendar/components/BookingCalendar/components/TableSchedule/components/MainSchedule/components/CourtBlockCard"
import {
	CourtBlockInfoDialog,
	type PaymentParticipant,
} from "@/pages/admin/pages/Calendar/components/BookingCalendar/components/TableSchedule/components/MainSchedule/components/CourtBlockInfoDialog"
import { EventCard } from "@/pages/admin/pages/Calendar/components/BookingCalendar/components/TableSchedule/components/MainSchedule/components/EventCard"
import { useCourtsStore } from "@/pages/admin/pages/Calendar/components/BookingCalendar/store/courtsSelectedStore"
import { BookingDialog } from "./BookingDialog/BookingDialog"

const isEventStart = (event: { startTime: Date }, time: Date) => {
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

type CalendarBusyEvent = {
	courtId: string
	startTime: Date
	endTime: Date
}

type CalendarCourtBlock = CalendarBusyEvent & CourtBlockVisual

type CourtBlockReasonPayload = {
	reason: string
	payments?: PaymentParticipant[]
}

const parseCourtBlockReason = (
	reasonValue: string,
): { reason: string; payments: PaymentParticipant[] | null } => {
	try {
		const parsed = JSON.parse(reasonValue) as CourtBlockReasonPayload
		const parsedPayments = Array.isArray(parsed.payments)
			? parsed.payments.filter(
					(payment): payment is PaymentParticipant =>
						typeof payment?.name === "string" && typeof payment?.paid === "boolean",
				)
			: null

		return {
			reason:
				typeof parsed.reason === "string" && parsed.reason.trim().length > 0
					? parsed.reason
					: reasonValue,
			payments: parsedPayments,
		}
	} catch {
		return { reason: reasonValue, payments: null }
	}
}

const buildCourtBlockReason = (
	reason: string,
	payments: PaymentParticipant[],
): string => {
	return JSON.stringify({ reason, payments })
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
	const courtIds = useMemo(
		() => courtsQuery.data?.map((court) => court.id) ?? [],
		[courtsQuery.data],
	)
	const { courtBlocksQuery } = useCourtBlocksByCourtIds(courtIds)
	const { updateCourtBlock } = useCourtBlocksMutations()
	const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false)
	const [selectedSlot, setSelectedSlot] = useState<{
		date: Date
		courtId: string
	} | null>(null)
	const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
	const [selectedCourtBlock, setSelectedCourtBlock] =
		useState<CalendarCourtBlock | null>(null)
	const [isCourtBlockDialogOpen, setIsCourtBlockDialogOpen] = useState(false)

	const handleSlotClick = (date: Date, courtId: string) => {
		setSelectedSlot({ date, courtId })
		setSelectedBooking(null)
		setIsBookingDialogOpen(true)
	}

	const handleEventClick = (booking: Booking) => {
		setSelectedBooking(booking)
		setIsBookingDialogOpen(true)
	}

	const handleCourtBlockClick = (courtBlock: CalendarCourtBlock) => {
		setSelectedCourtBlock(courtBlock)
		setIsCourtBlockDialogOpen(true)
	}

	const courtsSelected = useCourtsStore((state) => state.courtsSelected)

	const courts = courtsQuery.data?.filter((court) =>
		courtsSelected.includes(court.id),
	)

	const blockedSlots = useMemo<CalendarCourtBlock[]>(() => {
		return (courtBlocksQuery.data ?? []).map((courtBlock) => ({
			...parseCourtBlockReason(courtBlock.reason),
			awayTeamName: courtBlock.match?.away_team?.name ?? null,
			competitionName: courtBlock.match?.competition?.name ?? null,
			id: courtBlock.id,
			courtId: courtBlock.court_id,
			homeTeamName: courtBlock.match?.home_team?.name ?? null,
			matchday: courtBlock.match?.matchday ?? null,
			round: courtBlock.match?.round ?? null,
			startTime: new Date(courtBlock.start_time),
			endTime: new Date(courtBlock.end_time),
		}))
	}, [courtBlocksQuery.data])

	const busyEvents = useMemo<CalendarBusyEvent[]>(() => {
		const bookingEvents = bookings.map((booking) => ({
			courtId: booking.courtId,
			startTime: booking.startTime,
			endTime: booking.endTime,
		}))
		return [...bookingEvents, ...blockedSlots]
	}, [bookings, blockedSlots])

	const eventAtCell = (courtId: string) =>
		bookings.find(
			(event) => isEventStart(event, timeDate) && event.courtId === courtId,
		)

	const blockedAtCell = (courtId: string) =>
		blockedSlots.find(
			(blocked) =>
				isEventStart(blocked, timeDate) && blocked.courtId === courtId,
		)

	const isInsideEvent = (courtId: string) =>
		busyEvents.some(
			(event) =>
				betweenDates(timeDate, event.startTime, event.endTime) &&
				event.courtId === courtId,
		)

	const hasAnyEvent = (timeDate: Date) => {
		return busyEvents.some(
			(event) =>
				(isEventStart(event, timeDate) &&
					courtsSelected.includes(event.courtId)) ||
				(betweenDates(timeDate, event.startTime, event.endTime) &&
					courtsSelected.includes(event.courtId)),
		)
	}

	const selectedCourtName =
		courtsQuery.data?.find((court) => court.id === selectedCourtBlock?.courtId)
			?.name ?? "Pista"

	const handleSaveCourtBlockPayments = async (
		courtBlockId: string,
		payments: PaymentParticipant[],
	) => {
		const currentCourtBlock = blockedSlots.find((block) => block.id === courtBlockId)
		if (!currentCourtBlock) return

		await updateCourtBlock.mutateAsync({
			id: courtBlockId,
			courtBlockData: {
				reason: buildCourtBlockReason(currentCourtBlock.reason, payments),
			},
		})
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
						const blockedCourt = blockedAtCell(court.id)
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
								) : blockedCourt ? (
									<CourtBlockCard
										court={court}
										courtBlock={blockedCourt}
										onClick={() => handleCourtBlockClick(blockedCourt)}
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
			<BookingDialog
				isOpen={isBookingDialogOpen}
				onOpenChange={setIsBookingDialogOpen}
				slot={selectedSlot}
				clubId={user.clubId!}
				booking={selectedBooking}
			/>
			<CourtBlockInfoDialog
				isOpen={isCourtBlockDialogOpen}
				onOpenChange={setIsCourtBlockDialogOpen}
				courtBlock={selectedCourtBlock}
				courtName={selectedCourtName}
				onSavePayments={handleSaveCourtBlockPayments}
				isSaving={updateCourtBlock.isPending}
			/>
		</>
	)
}
