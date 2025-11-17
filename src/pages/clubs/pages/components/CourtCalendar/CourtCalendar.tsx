import { Calendar } from "lucide-react"
import { useMemo, useState } from "react"
import { useNavigate } from "react-router"
import type { Booking } from "@/models/booking.model"
import type { BusinessDay } from "@/models/business.model"
import type { Court } from "@/models/court.model"
import type { SlotStatus, UISlot } from "@/models/slots.model"
import { CalendarLegend } from "./components/CalendarLegend"
import { CalendarNavigator } from "./components/CalendarNavigator"
import { DurationSelectionDialog } from "./components/DurationSelectionDialog"
import { SlotButton } from "./components/SlotButton"

interface CourtCalendarProps {
	courts: Court[]
	clubId: string
	bookings: Booking[]
	clubHours: BusinessDay[] | undefined
	currentUserId?: string
}

export default function CourtCalendar({
	courts,
	clubId,
	bookings,
	clubHours,
	currentUserId,
}: CourtCalendarProps) {
	const [selectedDate, setSelectedDate] = useState(new Date())
	const navigate = useNavigate()
	const [isDialogOpen, setIsDialogOpen] = useState(false)
	const [selectedSlot, setSelectedSlot] = useState<{
		courtId: string
		courtName: string
		hour: number
		halfHour: "first" | "second"
	} | null>(null)
	const [availableDurations, setAvailableDurations] = useState<
		{ duration: number; available: boolean }[]
	>([])

	const { hours, openRanges } = useMemo(() => {
		if (!clubHours) {
			return { hours: [], openRanges: [] }
		}

		const dayOfWeek = selectedDate.toLocaleDateString("es-ES", {
			weekday: "long",
		})
		const businessDay = clubHours.find(
			(day) => day.weekday.toLowerCase() === dayOfWeek.toLowerCase(),
		)

		if (!businessDay || businessDay.closed) return { hours: [], openRanges: [] }

		const ranges: { start: number; end: number }[] = []
		let minHour = 24
		let maxHour = 0

		for (const timeRange of businessDay.hours) {
			const [openHour] = timeRange.start.split(":").map(Number)
			const [closeHour] = timeRange.end.split(":").map(Number)
			ranges.push({ start: openHour, end: closeHour })
			minHour = Math.min(minHour, openHour)
			maxHour = Math.max(maxHour, closeHour)
		}

		// Generate all hours from min to max
		const allHours: number[] = []
		for (let hour = minHour; hour < maxHour; hour++) {
			allHours.push(hour)
		}

		return { hours: allHours, openRanges: ranges }
	}, [selectedDate, clubHours])

	const isHourOpen = (hour: number, halfHour: "first" | "second"): boolean => {
		const minutes = hour * 60 + (halfHour === "second" ? 30 : 0)

		return openRanges.some((range) => {
			const rangeStart = range.start * 60
			const rangeEnd = range.end * 60
			return minutes >= rangeStart && minutes < rangeEnd
		})
	}

	const isSlotInPast = (
		hour: number,
		halfHour: "first" | "second",
	): boolean => {
		const now = new Date()
		const slotDate = new Date(selectedDate)

		slotDate.setHours(0, 0, 0, 0)
		const today = new Date()
		today.setHours(0, 0, 0, 0)

		if (slotDate < today) return true
		if (slotDate > today) return false

		const slotMinutes = hour * 60 + (halfHour === "second" ? 30 : 0)
		const currentMinutes = now.getHours() * 60 + now.getMinutes()

		return slotMinutes < currentMinutes
	}

	const getSlotStatus = (
		courtId: string,
		hour: number,
		halfHour: "first" | "second",
	): SlotStatus => {
		if (!isHourOpen(hour, halfHour)) {
			return "not-available"
		}

		if (isSlotInPast(hour, halfHour)) {
			return "past"
		}

		const dateStr = selectedDate.toISOString().split("T")[0]
		const startMinutes = hour * 60 + (halfHour === "first" ? 0 : 30)
		const endMinutes = startMinutes + 30

		const slotBooking = bookings.find((booking) => {
			if (booking.courtId !== courtId || booking.date !== dateStr) return false
			if (booking.status === "cancelled") return false

			// Convertir las fechas ISO a objetos Date
			const bookingStartDate = new Date(booking.startTime)
			const bookingEndDate = new Date(booking.endTime)

			// Obtener los minutos totales desde el inicio del día
			const bookingStartMinutes =
				bookingStartDate.getHours() * 60 + bookingStartDate.getMinutes()
			const bookingEndMinutes =
				bookingEndDate.getHours() * 60 + bookingEndDate.getMinutes()
			return (
				startMinutes >= bookingStartMinutes && endMinutes <= bookingEndMinutes
			)
		})

		if (!slotBooking) return "available"

		if (currentUserId && slotBooking.userId === currentUserId) {
			return "your-booking"
		}

		return "not-available"
	}

	const checkAvailability = (
		courtId: string,
		startHour: number,
		startHalf: "first" | "second",
		durationMinutes: number,
	) => {
		const startMinutes = startHour * 60 + (startHalf === "second" ? 30 : 0)
		const endMinutes = startMinutes + durationMinutes

		const maxHour = Math.max(...hours)
		if (endMinutes > (maxHour + 1) * 60) return false

		for (let minutes = startMinutes; minutes < endMinutes; minutes += 30) {
			const hour = Math.floor(minutes / 60)
			const half = minutes % 60 === 0 ? "first" : "second"

			const status = getSlotStatus(courtId, hour, half)
			if (
				status === "not-available" ||
				status === "your-booking" ||
				status === "past"
			) {
				return false
			}
		}

		return true
	}

	const handleSlotClick = (
		courtId: string,
		courtName: string,
		hour: number,
		halfHour: "first" | "second",
	) => {
		const duration90Available = checkAvailability(courtId, hour, halfHour, 90)
		const duration120Available = checkAvailability(courtId, hour, halfHour, 120)

		setAvailableDurations([
			{ duration: 90, available: duration90Available },
			{ duration: 120, available: duration120Available },
		])

		setSelectedSlot({ courtId, courtName, hour, halfHour })
		setIsDialogOpen(true)
	}

	const handleDurationSelect = (duration: number) => {
		if (!selectedSlot) return

		const { courtId, hour, halfHour } = selectedSlot
		const court = courts.find((c) => c.id === courtId)
		if (!court) return

		const startDate = new Date(selectedDate)
		startDate.setHours(hour, halfHour === "first" ? 0 : 30, 0, 0)

		const endDate = new Date(startDate)
		endDate.setMinutes(endDate.getMinutes() + duration)

		const finalSlot: UISlot = {
			clubId,
			courtId,
			price: court.price,
			date: selectedDate.toISOString().split("T")[0],
			startTime: startDate,
			endTime: endDate,
			duration,
			courtName: court.name,
		}
		// Codificar el objeto finalSlot y navegar
		const encodedSlot = encodeURIComponent(JSON.stringify(finalSlot))
		navigate(`/crear-reserva?slot=${encodedSlot}`)
		setIsDialogOpen(false)
	}

	const getTimeRange = (hour: number, halfHour: "first" | "second") => {
		const startTime = halfHour === "first" ? `${hour}:00` : `${hour}:30`
		const endTime = halfHour === "first" ? `${hour}:30` : `${hour + 1}:00`
		return `${startTime} - ${endTime}`
	}

	const formatHour = (hour: number) => {
		if (hour === 12) return "12 PM"
		if (hour > 12) return `${hour - 12} PM`
		return `${hour} AM`
	}

	const activeCourts = courts.filter((court) => court.isActive)

	return (
		<>
			<div className="w-full bg-white rounded-xl shadow-sm border border-border overflow-hidden">
				{/* Header */}
				<div className="flex items-center justify-between px-6 py-4 border-b border-border bg-linear-to-r from-slate-50 to-white">
					<div className="flex items-center gap-3">
						<Calendar className="w-5 h-5 text-slate-600" />
						<h2 className="text-lg font-semibold text-slate-900">
							Reserva tu pista
						</h2>
					</div>

					<CalendarNavigator
						selectedDate={selectedDate}
						onDateChange={setSelectedDate}
					/>
				</div>

				{/* Calendar Grid */}
				<div className="overflow-x-auto">
					<div className="inline-block min-w-full">
						{/* Time Headers */}
						<div className="flex border-b border-border bg-slate-50/50">
							<div className="w-40 shrink-0 border-r border-border" />
							{hours.map((hour) => (
								<div
									key={hour}
									className="flex-1 shrink-0 border-r border-border text-center py-3 text-xs font-semibold text-slate-700 uppercase tracking-wide"
								>
									{formatHour(hour)}
								</div>
							))}
						</div>

						{/* Court Rows */}
						{activeCourts.map((court, index) => (
							<div
								key={court.id}
								className={`flex border-b border-border ${index % 2 === 0 ? "bg-white" : "bg-slate-50/30"}`}
							>
								<div className="w-40 shrink-0 border-r border-border px-4 py-4 flex items-center">
									<span className="text-sm font-semibold text-slate-900">
										{court.name}
									</span>
								</div>

								{hours.map((hour) => {
									const firstHalfStatus = getSlotStatus(court.id, hour, "first")
									const secondHalfStatus = getSlotStatus(
										court.id,
										hour,
										"second",
									)

									return (
										<div
											key={hour}
											className="flex-1 shrink-0 border-r border-border flex"
										>
											<SlotButton
												courtId={court.id}
												courtName={court.name}
												hour={hour}
												halfHour="first"
												status={firstHalfStatus}
												isHourOpen={isHourOpen(hour, "first")}
												onSlotClick={handleSlotClick}
												getTimeRange={getTimeRange}
											/>
											<SlotButton
												courtId={court.id}
												courtName={court.name}
												hour={hour}
												halfHour="second"
												status={secondHalfStatus}
												isHourOpen={isHourOpen(hour, "second")}
												onSlotClick={handleSlotClick}
												getTimeRange={getTimeRange}
											/>
										</div>
									)
								})}
							</div>
						))}
					</div>
				</div>

				<CalendarLegend />
			</div>

			<DurationSelectionDialog
				isOpen={isDialogOpen}
				onOpenChange={setIsDialogOpen}
				selectedSlot={selectedSlot}
				availableDurations={availableDurations}
				onDurationSelect={handleDurationSelect}
				getTimeRange={getTimeRange}
			/>
		</>
	)
}
