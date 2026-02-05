import { Calendar } from "lucide-react"
import { useMemo, useState } from "react"
import { useNavigate } from "react-router"
import { toast } from "sonner"
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion"
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import type { BookingCalendar } from "@/models/booking.model"
import type { BusinessDay } from "@/models/business.model"
import type { Court } from "@/models/court.model"
import type { SlotStatus, UISlot } from "@/models/slots.model"
import { CalendarLegend } from "./components/CalendarLegend"
import { CalendarNavigator } from "./components/CalendarNavigator"
import { DurationSelectionDialog } from "./components/DurationSelectionDialog"
import { getSlotColor, SlotButton } from "./components/SlotButton"

type Half = "first" | "second"

export type PickedOption = {
	courtId: string
	courtName: string
	startTime: string // ISO
	endTime: string // ISO
}

type Mode = "booking" | "picker"

type CourtCalendarBaseProps =
	| {
			mode: "booking"
			title?: string
			clubId: string
			courts: Court[]
			bookings: BookingCalendar[]
			clubHours: BusinessDay[] | undefined
	  }
	| {
			mode: "picker"
			title?: string
			courts: Court[]
			bookings: BookingCalendar[]
			clubHours: BusinessDay[] | undefined
			durationMinutes: number
			selectedOptions?: PickedOption[]
			onPickOption: (opt: PickedOption) => void
			disabled?: boolean // 👈 NUEVO
			maxDate?: Date
	  }
const startOfDay = (d: Date) => {
	const x = new Date(d)
	x.setHours(0, 0, 0, 0)
	return x
}

export default function CourtCalendarBase(props: CourtCalendarBaseProps) {
	const navigate = useNavigate()
	const [selectedDate, setSelectedDate] = useState(new Date())

	// Solo booking mode
	const [isDialogOpen, setIsDialogOpen] = useState(false)
	const [selectedSlot, setSelectedSlot] = useState<{
		courtId: string
		courtName: string
		hour: number
		halfHour: Half
	} | null>(null)
	const [availableDurations, setAvailableDurations] = useState<
		{ duration: number; available: boolean }[]
	>([])

	const isPicker = props.mode === "picker"
	const pickerDisabled = isPicker && !!props.disabled
	const pickerMaxDate = isPicker ? props.maxDate : undefined

	const isAfterMaxDay = (d: Date) => {
		if (!pickerMaxDate) return false
		return startOfDay(d).getTime() > startOfDay(pickerMaxDate).getTime()
	}

	const onDateChangeSafe = (d: Date) => {
		if (pickerDisabled) return

		if (isPicker && pickerMaxDate && isAfterMaxDay(d)) {
			toast.error(
				`Solo puedes retrasar el partido hasta ${pickerMaxDate.toLocaleDateString("es-ES")}.`,
			)
			setSelectedDate(pickerMaxDate)
			return
		}

		setSelectedDate(d)
	}

	const { hours, openRanges } = useMemo(() => {
		if (!props.clubHours) return { hours: [], openRanges: [] }

		const dayOfWeek = selectedDate.toLocaleDateString("es-ES", {
			weekday: "long",
		})
		const businessDay = props.clubHours.find(
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

		const allHours: number[] = []
		for (let hour = minHour; hour < maxHour; hour++) allHours.push(hour)

		return { hours: allHours, openRanges: ranges }
	}, [selectedDate, props.clubHours])

	const isHourOpen = (hour: number, halfHour: Half) => {
		const minutes = hour * 60 + (halfHour === "second" ? 30 : 0)
		return openRanges.some((range) => {
			const rangeStart = range.start * 60
			const rangeEnd = range.end * 60
			return minutes >= rangeStart && minutes < rangeEnd
		})
	}

	const isSlotInPast = (hour: number, halfHour: Half) => {
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
		halfHour: Half,
	): SlotStatus => {
		if (!isHourOpen(hour, halfHour)) return "not-available"
		if (isSlotInPast(hour, halfHour)) return "past"

		const dateStr = selectedDate.toISOString().split("T")[0]
		const startMinutes = hour * 60 + (halfHour === "first" ? 0 : 30)
		const endMinutes = startMinutes + 30

		const slotBooking = props.bookings.find((booking) => {
			if (booking.courtId !== courtId || booking.date !== dateStr) return false
			if (booking.status === "cancelled") return false

			const bs = new Date(booking.startTime)
			const be = new Date(booking.endTime)
			const bsMin = bs.getHours() * 60 + bs.getMinutes()
			const beMin = be.getHours() * 60 + be.getMinutes()

			return startMinutes >= bsMin && endMinutes <= beMin
		})

		if (!slotBooking) return "available"
		if (slotBooking.isMine) return "your-booking"
		return "not-available"
	}

	const checkAvailability = (
		courtId: string,
		startHour: number,
		startHalf: Half,
		durationMinutes: number,
	) => {
		const startMinutes = startHour * 60 + (startHalf === "second" ? 30 : 0)
		const endMinutes = startMinutes + durationMinutes

		const maxHour = Math.max(...hours, 0)
		if (endMinutes > (maxHour + 1) * 60) return false

		for (let minutes = startMinutes; minutes < endMinutes; minutes += 30) {
			const hour = Math.floor(minutes / 60)
			const half = minutes % 60 === 0 ? "first" : "second"
			const status = getSlotStatus(courtId, hour, half)

			// En booking no dejamos reservar tu-reserva ni pasado ni no disponible
			if (status !== "available") return false
		}
		return true
	}

	const getTimeRange = (hour: number, halfHour: Half) => {
		const startTime = halfHour === "first" ? `${hour}:00` : `${hour}:30`
		const endTime = halfHour === "first" ? `${hour}:30` : `${hour + 1}:00`
		return `${startTime} - ${endTime}`
	}

	const formatHour = (hour: number) => {
		if (hour === 12) return "12 PM"
		if (hour > 12) return `${hour - 12} PM`
		return `${hour} AM`
	}

	const activeCourts = useMemo(
		() => props.courts.filter((c) => c.isActive),
		[props.courts],
	)

	// ====== PICKER helpers ======
	const selectedKeySet = useMemo(() => {
		if (props.mode !== "picker") return new Set<string>()
		const set = new Set<string>()
		;(props.selectedOptions ?? []).forEach((o) =>
			set.add(`${o.courtId}|${o.startTime}`),
		)
		return set
	}, [props])

	const pickSlot = (court: Court, hour: number, half: Half) => {
		if (props.mode !== "picker") return
		if (pickerDisabled) return

		if (pickerMaxDate) {
			const slotStart = new Date(selectedDate)
			slotStart.setHours(hour, half === "first" ? 0 : 30, 0, 0)
			if (slotStart.getTime() > pickerMaxDate.getTime()) {
				toast.error(
					`Solo puedes retrasar el partido hasta ${pickerMaxDate.toLocaleDateString("es-ES")}.`,
				)
				return
			}
		}

		const ok = checkAvailability(court.id, hour, half, props.durationMinutes)
		if (!ok) {
			toast.error(
				`No hay hueco disponible para ${props.durationMinutes} min desde esa hora.`,
			)
			return
		}

		const startDate = new Date(selectedDate)
		startDate.setHours(hour, half === "first" ? 0 : 30, 0, 0)
		const endDate = new Date(startDate)
		endDate.setMinutes(endDate.getMinutes() + props.durationMinutes)

		const startISO = startDate.toISOString()
		const key = `${court.id}|${startISO}`
		if (selectedKeySet.has(key)) return // ya estaba

		props.onPickOption({
			courtId: court.id,
			courtName: court.name,
			startTime: startISO,
			endTime: endDate.toISOString(),
		})
	}

	// ====== BOOKING helpers ======
	const openBookingDialog = (court: Court, hour: number, half: Half) => {
		const duration90Available = checkAvailability(court.id, hour, half, 90)
		const duration120Available = checkAvailability(court.id, hour, half, 120)

		if (!duration90Available && !duration120Available) return

		setAvailableDurations([
			{ duration: 90, available: duration90Available },
			{ duration: 120, available: duration120Available },
		])
		setSelectedSlot({
			courtId: court.id,
			courtName: court.name,
			hour,
			halfHour: half,
		})
		setIsDialogOpen(true)
	}

	const handleDurationSelect = (duration: number) => {
		if (props.mode !== "booking") return
		if (!selectedSlot) return

		const court = props.courts.find((c) => c.id === selectedSlot.courtId)
		if (!court) return

		const startDate = new Date(selectedDate)
		startDate.setHours(
			selectedSlot.hour,
			selectedSlot.halfHour === "first" ? 0 : 30,
			0,
			0,
		)

		const endDate = new Date(startDate)
		endDate.setMinutes(endDate.getMinutes() + duration)

		const finalSlot: UISlot = {
			clubId: props.clubId,
			courtId: court.id,
			price: court.price,
			date: selectedDate.toISOString().split("T")[0],
			startTime: startDate,
			endTime: endDate,
			duration,
			courtName: court.name,
		}

		const encoded = encodeURIComponent(JSON.stringify(finalSlot))
		navigate(`/crear-reserva?slot=${encoded}`)
		setIsDialogOpen(false)
	}

	const onSlotClick = (court: Court, hour: number, half: Half) => {
		if (props.mode === "picker") pickSlot(court, hour, half)
		else openBookingDialog(court, hour, half)
	}

	// Para móvil: mostramos slot si al menos puede empezar (picker: durationMinutes, booking: 90 o 120)
	const canStart = (courtId: string, hour: number, half: Half) => {
		if (pickerDisabled) return false

		// regla de máximo retraso SOLO en picker
		if (isPicker && pickerMaxDate) {
			const slotStart = new Date(selectedDate)
			slotStart.setHours(hour, half === "first" ? 0 : 30, 0, 0)
			if (slotStart.getTime() > pickerMaxDate.getTime()) return false
		}

		if (props.mode === "picker")
			return checkAvailability(courtId, hour, half, props.durationMinutes)

		return (
			checkAvailability(courtId, hour, half, 90) ||
			checkAvailability(courtId, hour, half, 120)
		)
	}

	const title =
		props.title ??
		(props.mode === "booking"
			? "Reserva tu pista"
			: "Selecciona franjas disponibles")

	return (
		<>
			<div
				className={cn(
					"w-full bg-white rounded-xl shadow-sm border border-border overflow-hidden",
					pickerDisabled && "opacity-60 pointer-events-none",
				)}
			>
				{/* Header: en móvil el título arriba y el navigator centrado */}
				<div className="px-6 py-4 border-b border-border bg-linear-to-r from-slate-50 to-white">
					<div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
						<div className="flex items-center gap-3 min-w-0 md:justify-start justify-center">
							<Calendar className="w-5 h-5 text-slate-600 shrink-0" />
							<h2 className="text-lg font-semibold text-slate-900 truncate">
								{title}
							</h2>
						</div>

						<div className="flex justify-center md:justify-end">
							<CalendarNavigator
								selectedDate={selectedDate}
								onDateChange={onDateChangeSafe}
								maxDate={pickerMaxDate}
								disabled={pickerDisabled}
							/>
						</div>
					</div>
				</div>

				{/* ====== MÓVIL: accordion por pista ====== */}
				<div className="md:hidden p-4">
					{!props.clubHours && (
						<div className="text-sm text-muted-foreground">
							Cargando horarios del club…
						</div>
					)}

					{props.clubHours && hours.length === 0 && (
						<div className="text-sm text-muted-foreground">
							El club está cerrado este día o no hay horas configuradas.
						</div>
					)}

					{props.clubHours && hours.length > 0 && (
						<Accordion type="single" collapsible className="w-full space-y-2">
							{activeCourts.map((court) => {
								// construimos slots 30-min para esa pista
								const slots = hours.flatMap((h) =>
									(["first", "second"] as Half[]).map((half) => ({ h, half })),
								)

								const availableSlots = slots.filter(({ h, half }) => {
									const status = getSlotStatus(court.id, h, half)
									if (status !== "available") return false
									return canStart(court.id, h, half)
								})

								return (
									<AccordionItem
										key={court.id}
										value={court.id}
										className="border rounded-lg px-2"
									>
										<AccordionTrigger className="text-left">
											<div className="flex items-center justify-between w-full pr-2">
												<span className="font-medium">{court.name}</span>
												<span className="text-xs text-muted-foreground">
													{availableSlots.length} disponibles
												</span>
											</div>
										</AccordionTrigger>

										<AccordionContent>
											{availableSlots.length === 0 ? (
												<div className="text-sm text-muted-foreground py-2">
													No hay huecos disponibles este día.
												</div>
											) : (
												<div className="grid grid-cols-3 gap-2 pb-3">
													{availableSlots.map(({ h, half }) => {
														const start = new Date(selectedDate)
														start.setHours(h, half === "first" ? 0 : 30, 0, 0)
														const startISO = start.toISOString()
														const isSelected =
															props.mode === "picker"
																? selectedKeySet.has(`${court.id}|${startISO}`)
																: false

														return (
															<button
																key={`${court.id}-${h}-${half}`}
																className={cn(
																	"h-11 rounded-md border text-sm font-medium transition-all",
																	"flex items-center justify-center",
																	isSelected
																		? "ring-2 ring-blue-500 ring-inset"
																		: "",
																	// Color basado en status (aquí siempre available)
																	getSlotColor("available"),
																)}
																onClick={() => onSlotClick(court, h, half)}
															>
																{start.toLocaleTimeString("es-ES", {
																	hour: "2-digit",
																	minute: "2-digit",
																})}
															</button>
														)
													})}
												</div>
											)}
										</AccordionContent>
									</AccordionItem>
								)
							})}
						</Accordion>
					)}
				</div>

				{/* ====== DESKTOP: grid tradicional ====== */}
				<div className="hidden md:block overflow-x-auto">
					<div className="inline-block min-w-full">
						{/* headers */}
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

						{/* filas */}
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
									if (props.mode === "booking") {
										// Reutilizamos SlotButton para booking (como tu CourtCalendar actual)
										const firstHalfStatus = getSlotStatus(
											court.id,
											hour,
											"first",
										)
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
													onSlotClick={() =>
														openBookingDialog(court, hour, "first")
													}
													getTimeRange={getTimeRange}
												/>
												<SlotButton
													courtId={court.id}
													courtName={court.name}
													hour={hour}
													halfHour="second"
													status={secondHalfStatus}
													isHourOpen={isHourOpen(hour, "second")}
													onSlotClick={() =>
														openBookingDialog(court, hour, "second")
													}
													getTimeRange={getTimeRange}
												/>
											</div>
										)
									}

									// Picker desktop: botones tipo CourtCalendarPicker
									const renderHalf = (half: Half) => {
										const status = getSlotStatus(court.id, hour, half)
										const disabled =
											status !== "available" || !canStart(court.id, hour, half)

										const start = new Date(selectedDate)
										start.setHours(hour, half === "first" ? 0 : 30, 0, 0)
										const startISO = start.toISOString()
										const isSelected = selectedKeySet.has(
											`${court.id}|${startISO}`,
										)

										return (
											<Tooltip key={`${court.id}-${hour}-${half}`}>
												<TooltipTrigger asChild>
													<button
														className={cn(
															"w-1/2 h-16 transition-all duration-200",
															half === "first" ? "border-r border-border" : "",
															getSlotColor(status),
															isSelected
																? "ring-2 ring-blue-500 ring-inset"
																: "",
														)}
														disabled={disabled}
														onClick={() => pickSlot(court, hour, half)}
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
															{getTimeRange(hour, half)}
														</p>
														<p className="text-xs">
															{status === "available"
																? "✓ Disponible"
																: status === "past"
																	? "⌚ Hora pasada"
																	: "✕ No disponible"}
														</p>
													</div>
												</TooltipContent>
											</Tooltip>
										)
									}

									return (
										<div
											key={hour}
											className="flex-1 shrink-0 border-r border-border flex"
										>
											{renderHalf("first")}
											{renderHalf("second")}
										</div>
									)
								})}
							</div>
						))}
					</div>
				</div>

				{/* Legend: oculto en móvil */}
				<div className="hidden md:block">
					<CalendarLegend />
				</div>
			</div>

			{/* Dialog solo en booking mode */}
			{props.mode === "booking" && (
				<DurationSelectionDialog
					isOpen={isDialogOpen}
					onOpenChange={setIsDialogOpen}
					selectedSlot={selectedSlot}
					availableDurations={availableDurations}
					onDurationSelect={handleDurationSelect}
					getTimeRange={getTimeRange}
				/>
			)}
		</>
	)
}
