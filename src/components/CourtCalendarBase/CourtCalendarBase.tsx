import { Calendar, CalendarX } from "lucide-react"
import { useMemo, useState } from "react"
import { useNavigate } from "react-router"
import { cn } from "@/lib/utils"
import type { BookingCalendar } from "@/models/booking.model"
import type { BusinessDay } from "@/models/business.model"
import type { Court } from "@/models/court.model"
import type { UISlot } from "@/models/slots.model"
import { CalendarLegend } from "./components/CalendarLegend"
import { CalendarNavigator } from "./components/CalendarNavigator"

type Mode = "booking" | "picker"

export type PickedOption = {
	courtId: string
	courtName: string
	startTime: string
	endTime: string
}

type Props =
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
			onPickOption: (opt: PickedOption) => void
			disabled?: boolean
			maxDate?: Date
	  }

export default function CourtCalendarBase(props: Props) {
	const navigate = useNavigate()
	const [selectedDate, setSelectedDate] = useState(new Date())

	/* ===============================
     Obtener rangos abiertos
  =============================== */

	const openRanges = useMemo(() => {
		if (!props.clubHours) return []

		const dayOfWeek = selectedDate.toLocaleDateString("es-ES", {
			weekday: "long",
		})

		const businessDay = props.clubHours.find(
			(d) => d.weekday.toLowerCase() === dayOfWeek.toLowerCase(),
		)

		if (!businessDay || businessDay.closed) return []

		return businessDay.hours.map((r) => ({
			start: Number(r.start.split(":")[0]),
			end: Number(r.end.split(":")[0]),
		}))
	}, [selectedDate, props.clubHours])

	/* ===============================
     Generador de slots
  =============================== */

	const generateCourtSlots = (court: Court) => {
		const slots: { start: Date; end: Date }[] = []

		for (const range of openRanges) {
			const rangeStart = range.start * 60
			const rangeEnd = range.end * 60

			let current = rangeStart + (court.slotStartOffsetMinutes ?? 0)

			while (current + (court.slotDurationMinutes ?? 90) <= rangeEnd) {
				const start = new Date(selectedDate)
				start.setHours(0, 0, 0, 0)
				start.setMinutes(current)

				const end = new Date(start)
				end.setMinutes(end.getMinutes() + (court.slotDurationMinutes ?? 90))

				slots.push({ start, end })

				current += court.slotDurationMinutes ?? 90
			}
		}

		// 🔥 ORDENAR SIEMPRE CRONOLÓGICAMENTE
		return slots.sort((a, b) => a.start.getTime() - b.start.getTime())
	}

	/* ===============================
     Estado del slot
  =============================== */

	const isPastSlot = (start: Date) => {
		const now = new Date()

		const today = new Date()
		today.setHours(0, 0, 0, 0)

		const selectedDay = new Date(selectedDate)
		selectedDay.setHours(0, 0, 0, 0)

		if (selectedDay.getTime() < today.getTime()) return true
		if (selectedDay.getTime() > today.getTime()) return false

		return start.getTime() <= now.getTime()
	}

	const getSlotState = (courtId: string, start: Date, end: Date) => {
		if (isPastSlot(start)) return "past"

		const dateStr = start.toISOString().split("T")[0]

		const booking = props.bookings.find((b) => {
			if (b.courtId !== courtId) return false
			if (b.date !== dateStr) return false
			if (b.status === "cancelled") return false

			const bs = new Date(b.startTime)
			const be = new Date(b.endTime)

			return start < be && end > bs
		})

		if (!booking) return "available"
		if (booking.isMine) return "mine"
		return "occupied"
	}

	/* ===============================
     Click
  =============================== */

	const handleSlotClick = (court: Court, start: Date, end: Date) => {
		const state = getSlotState(court.id, start, end)
		if (state !== "available") return

		if (props.mode === "booking") {
			const finalSlot: UISlot = {
				clubId: props.clubId,
				courtId: court.id,
				price: court.price,
				date: start.toISOString().split("T")[0],
				startTime: start,
				endTime: end,
				duration: court.slotDurationMinutes ?? 90,
				courtName: court.name,
			}

			const encoded = encodeURIComponent(JSON.stringify(finalSlot))
			navigate(`/crear-reserva?slot=${encoded}`)
		}

		if (props.mode === "picker" && props.onPickOption) {
			props.onPickOption({
				courtId: court.id,
				courtName: court.name,
				startTime: start.toISOString(),
				endTime: end.toISOString(),
			})
		}
	}

	const activeCourts = props.courts.filter((c) => c.isActive)

	const courtsWithAvailability = activeCourts
		.map((court) => {
			const slots = generateCourtSlots(court)
			const availableSlots = slots.filter(
				(slot) => getSlotState(court.id, slot.start, slot.end) === "available",
			)
			return { court, slots, availableSlots }
		})
		.filter((c) => c.slots.length > 0)

	const noAvailability =
		openRanges.length === 0 ||
		courtsWithAvailability.every((c) => c.availableSlots.length === 0)

	const title =
		props.title ??
		(props.mode === "booking"
			? "Reserva tu pista"
			: "Selecciona franjas disponibles")

	return (
		<div className="w-full max-w-full bg-white rounded-xl shadow-sm border border-border overflow-hidden">
			{/* HEADER RESPONSIVE CORREGIDO */}
			<div className="px-4 md:px-6 py-4 border-b border-border bg-slate-50">
				<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
					<div className="flex items-center gap-2 justify-center md:justify-start">
						<Calendar className="w-5 h-5 text-slate-600 shrink-0" />
						<h2 className="text-lg font-semibold text-slate-900 text-center md:text-left">
							{title}
						</h2>
					</div>

					<div className="flex justify-center md:justify-end w-full md:w-auto">
						<CalendarNavigator
							selectedDate={selectedDate}
							onDateChange={setSelectedDate}
						/>
					</div>
				</div>
			</div>

			{/* ================= MÓVIL ================= */}
			<div className="block md:hidden p-4 space-y-4">
				{noAvailability ? (
					<EmptyState
						selectedDate={selectedDate}
						setSelectedDate={setSelectedDate}
					/>
				) : (
					courtsWithAvailability.map(({ court, availableSlots }) => (
						<details
							key={court.id}
							className="border rounded-lg bg-white shadow-sm"
						>
							<summary className="px-4 py-3 font-semibold text-slate-900 cursor-pointer flex justify-between">
								<span>{court.name}</span>
								<span className="text-xs text-slate-500">
									{availableSlots.length} disponibles
								</span>
							</summary>

							<div className="p-4 grid grid-cols-2 gap-3">
								{availableSlots.map((slot) => (
									<SlotButton
										key={slot.start.toISOString()}
										court={court}
										slot={slot}
										state={getSlotState(court.id, slot.start, slot.end)}
										onClick={handleSlotClick}
									/>
								))}
							</div>
						</details>
					))
				)}
			</div>

			{/* ================= DESKTOP ================= */}
			<div className="hidden md:block p-6">
				{noAvailability ? (
					<EmptyState
						selectedDate={selectedDate}
						setSelectedDate={setSelectedDate}
					/>
				) : (
					activeCourts.map((court) => {
						const slots = generateCourtSlots(court)

						return (
							<div key={court.id} className="mb-10">
								<h3 className="text-sm font-semibold text-slate-900 mb-4">
									{court.name}
								</h3>

								<div className="grid grid-cols-6 gap-4">
									{slots.map((slot) => (
										<SlotButton
											key={slot.start.toISOString()}
											court={court}
											slot={slot}
											state={getSlotState(court.id, slot.start, slot.end)}
											onClick={handleSlotClick}
										/>
									))}
								</div>
							</div>
						)
					})
				)}
			</div>

			<CalendarLegend />
		</div>
	)
}

/* ================= COMPONENTES AUX ================= */

function SlotButton({ court, slot, state, onClick }: any) {
	return (
		<button
			disabled={state !== "available"}
			onClick={() => onClick(court, slot.start, slot.end)}
			className={cn(
				"h-14 rounded-lg text-sm font-semibold transition-all shadow-sm border",
				state === "available" &&
					"bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100",
				state === "occupied" &&
					"bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed",
				state === "mine" &&
					"bg-blue-600 border-blue-600 text-white hover:bg-blue-700",
				state === "past" &&
					"bg-slate-50 border-slate-200 text-slate-300 cursor-not-allowed",
			)}
		>
			{slot.start.toLocaleTimeString("es-ES", {
				hour: "2-digit",
				minute: "2-digit",
			})}
		</button>
	)
}

function EmptyState({ selectedDate, setSelectedDate }: any) {
	return (
		<div className="flex flex-col items-center justify-center text-center py-16 px-6">
			<div className="w-16 h-16 flex items-center justify-center rounded-full bg-slate-100 mb-6 shadow-sm">
				<CalendarX className="w-8 h-8 text-slate-400" />
			</div>

			<h3 className="text-base font-semibold text-slate-900 mb-2">
				No hay pistas disponibles
			</h3>

			<p className="text-sm text-slate-500 max-w-xs mb-6">
				No quedan pistas libres para esta fecha. Prueba seleccionando otro día.
			</p>

			<button
				onClick={() => {
					const tomorrow = new Date(selectedDate)
					tomorrow.setDate(tomorrow.getDate() + 1)
					setSelectedDate(tomorrow)
				}}
				className="px-5 py-2.5 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-sm"
			>
				Ver otro día
			</button>
		</div>
	)
}
