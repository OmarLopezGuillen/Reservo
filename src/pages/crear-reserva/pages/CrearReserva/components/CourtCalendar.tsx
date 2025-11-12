import { AlertCircle, Calendar, ChevronLeft, ChevronRight } from "lucide-react"
import { useMemo, useState } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog"
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover"
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip"
import type { Booking } from "@/models/booking.model"
import type { BusinessDay } from "@/models/business.model"
import type { Court } from "@/models/court.model"

type SlotStatus = "available" | "not-available" | "your-booking" | "past"

interface CourtCalendarProps {
	courts: Court[]
	bookings: Booking[]
	clubHours: BusinessDay[] | undefined
	currentUserId?: string
}

export default function CourtCalendar({
	courts,
	bookings,
	clubHours,
	currentUserId,
}: CourtCalendarProps) {
	const [selectedDate, setSelectedDate] = useState(new Date())
	const [isPopoverOpen, setIsPopoverOpen] = useState(false)
	const [calendarMonth, setCalendarMonth] = useState(new Date())
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

		businessDay.hours.forEach((timeRange) => {
			const [openHour] = timeRange.start.split(":").map(Number)
			const [closeHour] = timeRange.end.split(":").map(Number)
			ranges.push({ start: openHour, end: closeHour })
			minHour = Math.min(minHour, openHour)
			maxHour = Math.max(maxHour, closeHour)
		})

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

	const formatHour = (hour: number) => {
		if (hour === 12) return "12 PM"
		if (hour > 12) return `${hour - 12} PM`
		return `${hour} AM`
	}

	const formatDate = (date: Date) => {
		return date.toLocaleDateString("es-ES", {
			weekday: "short",
			month: "short",
			day: "numeric",
		})
	}

	const handlePrevDay = () => {
		const newDate = new Date(selectedDate)
		newDate.setDate(newDate.getDate() - 1)
		setSelectedDate(newDate)
	}
	const getDaysInMonth = (date: Date) => {
		const year = date.getFullYear()
		const month = date.getMonth()
		const firstDay = new Date(year, month, 1)
		const lastDay = new Date(year, month + 1, 0)
		const daysInMonth = lastDay.getDate()
		const startingDayOfWeek = firstDay.getDay()

		return { daysInMonth, startingDayOfWeek, year, month }
	}
	const isSelectedDay = (day: number) => {
		return (
			day === selectedDate.getDate() &&
			calendarMonth.getMonth() === selectedDate.getMonth() &&
			calendarMonth.getFullYear() === selectedDate.getFullYear()
		)
	}
	const isToday = (day: number) => {
		const today = new Date()
		return (
			day === today.getDate() &&
			calendarMonth.getMonth() === today.getMonth() &&
			calendarMonth.getFullYear() === today.getFullYear()
		)
	}
	const handlePrevMonth = () => {
		const newMonth = new Date(calendarMonth)
		newMonth.setMonth(newMonth.getMonth() - 1)
		setCalendarMonth(newMonth)
	}
	const handleNextMonth = () => {
		const newMonth = new Date(calendarMonth)
		newMonth.setMonth(newMonth.getMonth() + 1)
		setCalendarMonth(newMonth)
	}
	const handleNextDay = () => {
		const newDate = new Date(selectedDate)
		newDate.setDate(newDate.getDate() + 1)
		setSelectedDate(newDate)
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

			const [bookingStartHour, bookingStartMinute] = booking.startTime
				.split(":")
				.map(Number)
			const [bookingEndHour, bookingEndMinute] = booking.endTime
				.split(":")
				.map(Number)

			const bookingStartMinutes = bookingStartHour * 60 + bookingStartMinute
			const bookingEndMinutes = bookingEndHour * 60 + bookingEndMinute

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

	const handleDateSelect = (day: number) => {
		const newDate = new Date(
			calendarMonth.getFullYear(),
			calendarMonth.getMonth(),
			day,
		)
		setSelectedDate(newDate)
		setIsPopoverOpen(false)
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
		const startTime = halfHour === "first" ? `${hour}:00` : `${hour}:30`
		const endTime = halfHour === "first" ? `${hour}:30` : `${hour + 1}:00`
		console.log(`Clicked: ${courtName} - ${startTime} to ${endTime}`)

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

		const isAvailable = checkAvailability(
			selectedSlot.courtId,
			selectedSlot.hour,
			selectedSlot.halfHour,
			duration,
		)

		if (isAvailable) {
			console.log(`Reserva confirmada: ${duration} minutos`)
			setIsDialogOpen(false)
		}
	}

	const getSlotColor = (status: SlotStatus) => {
		switch (status) {
			case "available":
				return "bg-white hover:bg-blue-50 cursor-pointer border-border"
			case "not-available":
				return "bg-slate-100 cursor-not-allowed"
			case "your-booking":
				return "bg-blue-500 hover:bg-blue-600 cursor-pointer"
			case "past":
				return "bg-gradient-to-br from-slate-50 to-slate-100 cursor-not-allowed opacity-50 relative overflow-hidden after:absolute after:inset-0 after:bg-[linear-gradient(45deg,transparent_48%,rgba(148,163,184,0.15)_48%,rgba(148,163,184,0.15)_52%,transparent_52%)] after:bg-[length:8px_8px]"
		}
	}

	const getTimeRange = (hour: number, halfHour: "first" | "second") => {
		const startTime = halfHour === "first" ? `${hour}:00` : `${hour}:30`
		const endTime = halfHour === "first" ? `${hour}:30` : `${hour + 1}:00`
		return `${startTime} - ${endTime}`
	}

	const activeCourts = courts.filter((court) => court.isActive)

	return (
		<TooltipProvider>
			<div className="w-full bg-white rounded-xl shadow-sm border border-border overflow-hidden">
				{/* Header */}
				<div className="flex items-center justify-between px-6 py-4 border-b border-border bg-gradient-to-r from-slate-50 to-white">
					<div className="flex items-center gap-3">
						<Calendar className="w-5 h-5 text-slate-600" />
						<h2 className="text-lg font-semibold text-slate-900">
							Reserva tu pista
						</h2>
					</div>

					<div className="flex items-center gap-2">
						<Button
							variant="outline"
							size="icon"
							onClick={handlePrevDay}
							className="h-9 w-9 rounded-lg hover:bg-slate-100 border-slate-200 bg-transparent"
						>
							<ChevronLeft className="w-4 h-4" />
						</Button>

						<Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
							<PopoverTrigger asChild>
								<button className="min-w-40 text-center px-4 py-2 bg-white rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all cursor-pointer">
									<span className="text-sm font-medium text-slate-900">
										{formatDate(selectedDate)}
									</span>
								</button>
							</PopoverTrigger>
							<PopoverContent className="w-80 p-0" align="center">
								<div className="p-4 space-y-4">
									{/* Calendar Header */}
									<div className="flex items-center justify-between">
										<Button
											variant="ghost"
											size="icon"
											onClick={handlePrevMonth}
											className="h-8 w-8"
										>
											<ChevronLeft className="w-4 h-4" />
										</Button>
										<h3 className="text-sm font-semibold text-slate-900">
											{calendarMonth.toLocaleDateString("es-ES", {
												month: "long",
												year: "numeric",
											})}
										</h3>
										<Button
											variant="ghost"
											size="icon"
											onClick={handleNextMonth}
											className="h-8 w-8"
										>
											<ChevronRight className="w-4 h-4" />
										</Button>
									</div>

									{/* Days of week */}
									<div className="grid grid-cols-7 gap-1 text-center">
										{["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map(
											(day) => (
												<div
													key={day}
													className="text-xs font-medium text-slate-500 py-2"
												>
													{day}
												</div>
											),
										)}
									</div>

									{/* Calendar Days */}
									<div className="grid grid-cols-7 gap-1">
										{(() => {
											const { daysInMonth, startingDayOfWeek } =
												getDaysInMonth(calendarMonth)
											const days = []

											// Empty cells for days before month starts
											for (let i = 0; i < startingDayOfWeek; i++) {
												days.push(<div key={`empty-${i}`} className="h-9" />)
											}

											// Actual days of the month
											for (let day = 1; day <= daysInMonth; day++) {
												const dayNum = day
												const selected = isSelectedDay(dayNum)
												const today = isToday(dayNum)

												days.push(
													<button
														key={day}
														onClick={() => handleDateSelect(dayNum)}
														className={`h-9 rounded-lg text-sm font-medium transition-all ${
															selected
																? "bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
																: today
																	? "bg-blue-50 text-blue-600 hover:bg-blue-100 font-semibold"
																	: "text-slate-700 hover:bg-slate-100"
														}`}
													>
														{dayNum}
													</button>,
												)
											}

											return days
										})()}
									</div>

									{/* Quick actions */}
									<div className="pt-3 border-t border-slate-200 flex justify-between">
										<Button
											variant="ghost"
											size="sm"
											onClick={() => {
												const today = new Date()
												setSelectedDate(today)
												setCalendarMonth(today)
												setIsPopoverOpen(false)
											}}
											className="text-xs hover:bg-blue-50 hover:text-blue-600"
										>
											Hoy
										</Button>
										<Button
											variant="ghost"
											size="sm"
											onClick={() => setIsPopoverOpen(false)}
											className="text-xs hover:bg-slate-100"
										>
											Cerrar
										</Button>
									</div>
								</div>
							</PopoverContent>
						</Popover>

						<Button
							variant="outline"
							size="icon"
							onClick={handleNextDay}
							className="h-9 w-9 rounded-lg hover:bg-slate-100 border-slate-200 bg-transparent"
						>
							<ChevronRight className="w-4 h-4" />
						</Button>
					</div>
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
											<Tooltip>
												<TooltipTrigger asChild>
													<button
														className={`w-1/2 h-16 border-r border-border transition-all duration-200 ${getSlotColor(firstHalfStatus)}`}
														onClick={() =>
															handleSlotClick(
																court.id,
																court.name,
																hour,
																"first",
															)
														}
														disabled={
															firstHalfStatus === "not-available" ||
															firstHalfStatus === "past"
														}
													/>
												</TooltipTrigger>
												<TooltipContent
													side="top"
													className="bg-slate-900 text-white border-slate-800"
												>
													<div className="space-y-1">
														<p className="font-semibold text-sm">
															{court.name}
														</p>
														<p className="text-xs text-slate-300">
															{getTimeRange(hour, "first")}
														</p>
														<p className="text-xs">
															{firstHalfStatus === "available" &&
																"✓ Disponible"}
															{firstHalfStatus === "not-available" &&
																!isHourOpen(hour, "first") &&
																"✕ Cerrado"}
															{firstHalfStatus === "not-available" &&
																isHourOpen(hour, "first") &&
																"✕ No disponible"}
															{firstHalfStatus === "your-booking" &&
																"★ Tu reserva"}
															{firstHalfStatus === "past" && "⌚ Hora pasada"}
														</p>
													</div>
												</TooltipContent>
											</Tooltip>

											<Tooltip>
												<TooltipTrigger asChild>
													<button
														className={`w-1/2 h-16 transition-all duration-200 ${getSlotColor(secondHalfStatus)}`}
														onClick={() =>
															handleSlotClick(
																court.id,
																court.name,
																hour,
																"second",
															)
														}
														disabled={
															secondHalfStatus === "not-available" ||
															secondHalfStatus === "past"
														}
													/>
												</TooltipTrigger>
												<TooltipContent
													side="top"
													className="bg-slate-900 text-white border-slate-800"
												>
													<div className="space-y-1">
														<p className="font-semibold text-sm">
															{court.name}
														</p>
														<p className="text-xs text-slate-300">
															{getTimeRange(hour, "second")}
														</p>
														<p className="text-xs">
															{secondHalfStatus === "available" &&
																"✓ Disponible"}
															{secondHalfStatus === "not-available" &&
																!isHourOpen(hour, "second") &&
																"✕ Cerrado"}
															{secondHalfStatus === "not-available" &&
																isHourOpen(hour, "second") &&
																"✕ No disponible"}
															{secondHalfStatus === "your-booking" &&
																"★ Tu reserva"}
															{secondHalfStatus === "past" && "⌚ Hora pasada"}
														</p>
													</div>
												</TooltipContent>
											</Tooltip>
										</div>
									)
								})}
							</div>
						))}
					</div>
				</div>

				{/* Legend */}
				<div className="flex items-center justify-end gap-6 px-6 py-4 border-t border-border bg-slate-50/50">
					<div className="flex items-center gap-2">
						<div className="w-4 h-4 rounded border border-slate-300 bg-white shadow-sm" />
						<span className="text-xs font-medium text-slate-600">
							Disponible
						</span>
					</div>
					<div className="flex items-center gap-2">
						<div className="w-4 h-4 rounded bg-slate-100 shadow-sm" />
						<span className="text-xs font-medium text-slate-600">
							No disponible
						</span>
					</div>
					<div className="flex items-center gap-2">
						<div className="w-4 h-4 rounded bg-blue-500 shadow-sm" />
						<span className="text-xs font-medium text-slate-600">
							Tu reserva
						</span>
					</div>
					<div className="flex items-center gap-2">
						<div className="w-4 h-4 rounded bg-gradient-to-br from-slate-50 to-slate-100 opacity-50 shadow-sm" />
						<span className="text-xs font-medium text-slate-600">
							Hora pasada
						</span>
					</div>
				</div>
			</div>

			<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
				<DialogContent className="sm:max-w-md">
					<DialogHeader className="space-y-3">
						<DialogTitle className="text-xl font-semibold">
							Duración de la reserva
						</DialogTitle>
						<DialogDescription className="text-base">
							{selectedSlot && (
								<div className="space-y-1">
									<div className="font-semibold text-slate-900">
										{selectedSlot.courtName}
									</div>
									<div className="text-sm text-slate-600">
										{getTimeRange(selectedSlot.hour, selectedSlot.halfHour)}
									</div>
								</div>
							)}
						</DialogDescription>
					</DialogHeader>

					<div className="grid gap-3 py-4">
						<Button
							variant="outline"
							className="h-14 text-base font-semibold transition-all bg-transparent disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700"
							onClick={() => handleDurationSelect(90)}
							disabled={
								!availableDurations.find((d) => d.duration === 90)?.available
							}
						>
							90 minutos
							<span className="text-sm font-normal text-slate-500 ml-2">
								(1h 30min)
							</span>
						</Button>
						{!availableDurations.find((d) => d.duration === 90)?.available && (
							<Alert className="border-amber-200 bg-amber-50">
								<AlertCircle className="h-4 w-4 text-amber-600" />
								<AlertDescription className="text-xs text-amber-800">
									No hay disponibilidad para 90 minutos desde esta hora (hay
									reservas que se solaparían)
								</AlertDescription>
							</Alert>
						)}

						<Button
							variant="outline"
							className="h-14 text-base font-semibold transition-all bg-transparent disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700"
							onClick={() => handleDurationSelect(120)}
							disabled={
								!availableDurations.find((d) => d.duration === 120)?.available
							}
						>
							120 minutos
							<span className="text-sm font-normal text-slate-500 ml-2">
								(2h)
							</span>
						</Button>
						{!availableDurations.find((d) => d.duration === 120)?.available && (
							<Alert className="border-amber-200 bg-amber-50">
								<AlertCircle className="h-4 w-4 text-amber-600" />
								<AlertDescription className="text-xs text-amber-800">
									No hay disponibilidad para 120 minutos desde esta hora (hay
									reservas que se solaparían)
								</AlertDescription>
							</Alert>
						)}
					</div>
				</DialogContent>
			</Dialog>
		</TooltipProvider>
	)
}
