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

/**
 * @component CourtCalendar
 * @description Renders a full calendar view for a specific club, allowing users to see court availability and select a time slot to book.
 * It handles business hours, existing bookings, and past slots.
 * @param {Court[]} courts - List of court objects for the club.
 * @param {string} clubId - The ID of the club.
 * @param {Booking[]} bookings - A list of existing bookings for the club.
 * @param {BusinessDay[]} [clubHours] - The opening hours for the club.
 * @param {string} [currentUserId] - The ID of the currently logged-in user, to identify their own bookings.
 */
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

	/**
	 * @description Memoized calculation to determine the operating hours for the selected date.
	 * It finds the business day corresponding to the selected date, extracts the opening and closing times,
	 * and generates an array of hours within the operating range.
	 * @returns {{hours: number[], openRanges: {start: number, end: number}[]}} An object containing an array of operating hours and the time ranges.
	 */
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

	/**
	 * @description Checks if a specific 30-minute slot is within the club's open hours for the selected day.
	 * @param {number} hour - The hour of the slot (0-23).
	 * @param {"first" | "second"} halfHour - Which half of the hour the slot is in.
	 * @returns {boolean} True if the slot is within open hours, false otherwise.
	 */
	const isHourOpen = (hour: number, halfHour: "first" | "second"): boolean => {
		const minutes = hour * 60 + (halfHour === "second" ? 30 : 0)

		return openRanges.some((range) => {
			const rangeStart = range.start * 60
			const rangeEnd = range.end * 60
			return minutes >= rangeStart && minutes < rangeEnd
		})
	}

	/**
	 * @description Determines if a given time slot is in the past relative to the current time.
	 * @param {number} hour - The hour of the slot (0-23).
	 * @param {"first" | "second"} halfHour - Which half of the hour the slot is in.
	 * @returns {boolean} True if the slot is in the past, false otherwise.
	 */
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

	/**
	 * @description Determines the status of a single 30-minute slot.
	 * It checks if the slot is open, in the past, or already booked.
	 * @param {string} courtId - The ID of the court to check.
	 * @param {number} hour - The hour of the slot.
	 * @param {"first" | "second"} halfHour - The half-hour segment of the slot.
	 * @returns {SlotStatus} The calculated status of the slot ('available', 'not-available', 'past', 'your-booking').
	 */
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

	/**
	 * @description Checks if a continuous block of time is available for a given duration, starting from a specific slot.
	 * @param {string} courtId - The ID of the court to check.
	 * @param {number} startHour - The starting hour of the potential booking.
	 * @param {"first" | "second"} startHalf - The starting half-hour of the potential booking.
	 * @param {number} durationMinutes - The total duration in minutes to check for availability (e.g., 90 or 120).
	 * @returns {boolean} True if the entire duration is available, false otherwise.
	 */
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

	/**
	 * @description Handles the click event on a time slot.
	 * It checks for the availability of 90 and 120-minute durations starting from the clicked slot,
	 * sets the state for the duration selection dialog, and opens it.
	 * @param {string} courtId - The ID of the clicked court.
	 * @param {string} courtName - The name of the clicked court.
	 * @param {number} hour - The hour of the clicked slot.
	 * @param {"first" | "second"} halfHour - The half-hour segment of the clicked slot.
	 */
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

	/**
	 * @description Handles the selection of a booking duration from the dialog.
	 * It constructs the final slot object with all necessary details (times, price, etc.)
	 * and navigates the user to the booking creation page, passing the slot data as a URL parameter.
	 * @param {number} duration - The selected duration in minutes.
	 */
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

	/**
	 * @description Generates a string representation of a 30-minute time range.
	 * @param {number} hour - The hour of the slot.
	 * @param {"first" | "second"} halfHour - The half-hour segment.
	 * @returns {string} A formatted time range string (e.g., "9:00 - 9:30").
	 */
	const getTimeRange = (hour: number, halfHour: "first" | "second") => {
		const startTime = halfHour === "first" ? `${hour}:00` : `${hour}:30`
		const endTime = halfHour === "first" ? `${hour}:30` : `${hour + 1}:00`
		return `${startTime} - ${endTime}`
	}

	/**
	 * @description Formats an hour number into a 12-hour AM/PM format for display.
	 * @param {number} hour - The hour to format (0-23).
	 * @returns {string} The formatted hour string (e.g., "9 AM", "12 PM", "3 PM").
	 */
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
