"use client"

import { addMinutes, format, parse, set } from "date-fns"
import { es } from "date-fns/locale"
import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import type { BookingsRow, ClubHoursRow, CourtsRow } from "@/models/dbTypes"
import type { UISlot } from "@/models/UI.models"

const hours = Array.from({ length: 15 }, (_, i) => 8 + i)

type DaySchedule = {
	first?: ClubHoursRow
	second?: ClubHoursRow
}

interface BookingDialogProps {
	isOpen: boolean
	onClose: () => void
	onConfirm: (duration: number) => void
	slotInfo: { time: string; courtName: string } | null
	availableDurations: number[]
}

function BookingDialog({
	isOpen,
	onClose,
	onConfirm,
	slotInfo,
	availableDurations,
}: BookingDialogProps) {
	if (!slotInfo) return null
	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Confirmar Reserva</DialogTitle>
					<DialogDescription>
						Vas a reservar la <strong>{slotInfo.courtName}</strong> a las{" "}
						<strong>{slotInfo.time}</strong>. Selecciona la duración:
					</DialogDescription>
				</DialogHeader>
				<div className="grid grid-cols-2 gap-4 py-4">
					{availableDurations.length > 0 ? (
						availableDurations.map((duration) => (
							<Button
								key={duration}
								onClick={() => onConfirm(duration)}
							>{`${duration} minutos`}</Button>
						))
					) : (
						<p className="col-span-2 text-center text-muted-foreground">
							No hay opciones de duración disponibles para este horario.
						</p>
					)}
				</div>
				<DialogFooter>
					<Button variant="outline" onClick={onClose}>
						Cancelar
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}

interface BookingTableProps {
	courts: CourtsRow[]
	bookings: BookingsRow[]
	businessHours: DaySchedule[]
	selectedDate: Date
	onSlotSelected: (slot: UISlot) => void
}

const BookingTable = ({
	courts,
	bookings,
	businessHours,
	selectedDate,
	onSlotSelected,
}: BookingTableProps) => {
	const [dialogOpen, setDialogOpen] = useState(false)
	const [selectedCell, setSelectedCell] = useState<{
		time: string
		courtId: string
		courtName: string
	} | null>(null)
	const [availableDurations, setAvailableDurations] = useState<number[]>([])

	const bookingMap = useMemo(() => {
		const map = new Map<string, BookingsRow>()
		for (const booking of bookings) {
			if (booking.status !== "cancelled") {
				const start = new Date(booking.start_time)
				const end = new Date(booking.end_time)
				let current = start
				while (current < end) {
					const timeKey = format(current, "HH:mm")
					map.set(`${booking.court_id}-${timeKey}`, booking)
					current = addMinutes(current, 30) // Avanza al siguiente slot de 30 min
				}
			}
		}
		return map
	}, [bookings])

	const getSlotStatus = (
		time: string,
		courtId: string,
	): "available" | "booked" | "closed" | "past" => {
		const slotDateTime = parse(time, "HH:mm", selectedDate)

		if (bookingMap.has(`${courtId}-${time}`)) return "booked"

		const now = new Date()
		if (slotDateTime < now) return "past"

		const jsDayOfWeek = selectedDate.getDay()
		const scheduleIndex = jsDayOfWeek === 0 ? 6 : jsDayOfWeek - 1
		const daySchedule = businessHours[scheduleIndex]

		if (!daySchedule) return "closed"

		const isInRange = (
			slot: Date,
			timeRange: ClubHoursRow | undefined,
		): boolean => {
			if (
				!timeRange ||
				!timeRange.is_open ||
				!timeRange.open_time ||
				!timeRange.close_time
			)
				return false
			const openTime = parse(timeRange.open_time, "HH:mm:ss", selectedDate)
			const closeTime = parse(timeRange.close_time, "HH:mm:ss", selectedDate)
			return slot >= openTime && slot < closeTime
		}

		const isOpen =
			isInRange(slotDateTime, daySchedule.first) ||
			isInRange(slotDateTime, daySchedule.second)
		if (!isOpen) return "closed"

		return "available"
	}

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (!selectedCell) return

		const { time, courtId } = selectedCell
		const baseTime = parse(time, "HH:mm", selectedDate)
		const possibleDurations = [90, 120]
		const validDurations: number[] = []

		for (const duration of possibleDurations) {
			let isDurationValid = true
			const slotsToCheck = duration / 30 - 1

			for (let i = 1; i <= slotsToCheck; i++) {
				const nextSlotTime = addMinutes(baseTime, i * 30)
				const timeStr = format(nextSlotTime, "HH:mm")
				if (getSlotStatus(timeStr, courtId) !== "available") {
					isDurationValid = false
					break
				}
			}

			if (isDurationValid) {
				validDurations.push(duration)
			}
		}
		setAvailableDurations(validDurations)
	}, [selectedCell, businessHours])

	const handleCellClick = (
		time: string,
		courtId: string,
		courtName: string,
	) => {
		setSelectedCell({ time, courtId, courtName })
		setDialogOpen(true)
	}

	const handleConfirmBooking = (duration: number) => {
		if (!selectedCell) return
		const court = courts.find((c) => c.id === selectedCell.courtId)
		if (!court) return

		const startDate = parse(selectedCell.time, "HH:mm", selectedDate)
		const endDate = addMinutes(startDate, duration)

		const newSlot: UISlot = {
			id: `${selectedCell.courtId}-${startDate.toISOString()}`,
			date: format(selectedDate, "yyyy-MM-dd"),
			courtId: selectedCell.courtId,
			courtName: selectedCell.courtName,
			courtType: court.type,
			price: court.price,
			startTime: format(startDate, "HH:mm"),
			endTime: format(endDate, "HH:mm"),
			startTstz: startDate.toISOString(),
			endTstz: endDate.toISOString(),
			duration: duration,
		}
		onSlotSelected(newSlot)
		setDialogOpen(false)
	}

	const renderSubCell = (time: string, court: CourtsRow) => {
		const status = getSlotStatus(time, court.id)
		const commonClasses = "h-8 flex items-center justify-center text-xs"

		if (status === "booked") {
			const booking = bookingMap.get(`${court.id}-${time}`)!
			const slotDateTime = parse(time, "HH:mm", selectedDate)
			const isStart =
				new Date(booking.start_time).getTime() === slotDateTime.getTime()
			const isEnd =
				addMinutes(slotDateTime, 30).getTime() >=
				new Date(booking.end_time).getTime()

			return (
				<div
					className={cn(
						commonClasses,
						"bg-red-400 text-white cursor-not-allowed",
						{
							"rounded-t-md": isStart,
							"rounded-b-md": isEnd,
							"border-t-2 border-white":
								isStart &&
								bookingMap.get(
									`${court.id}-${format(addMinutes(slotDateTime, -30), "HH:mm")}`,
								),
						},
						isStart && isEnd ? "rounded-md" : "",
					)}
				>
					{isStart && (
						<span className="font-bold">{`${format(new Date(booking.start_time), "HH:mm")} - ${format(new Date(booking.end_time), "HH:mm")}`}</span>
					)}
				</div>
			)
		}

		if (status === "available") {
			return (
				// biome-ignore lint/a11y/useSemanticElements: <explanation>
				<div
					className={cn(
						commonClasses,
						"cursor-pointer hover:bg-green-200 bg-green-50 border-t border-gray-200",
					)}
					role="button"
					tabIndex={0}
					onClick={() => handleCellClick(time, court.id, court.name)}
					onKeyDown={(e) =>
						(e.key === "Enter" || e.key === " ") &&
						handleCellClick(time, court.id, court.name)
					}
				>
					{time.split(":")[1]}
				</div>
			)
		}

		return (
			<div
				className={cn(
					commonClasses,
					"text-gray-400 bg-gray-50 cursor-not-allowed border-t border-gray-200",
				)}
			>
				{time.split(":")[1]}
			</div>
		)
	}

	return (
		<>
			<div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-200">
				<table className="min-w-full">
					<thead className="bg-gray-100">
						<tr>
							<th className="px-2 py-2 text-left text-xs font-semibold text-gray-600 sticky left-0 bg-gray-100 z-20 w-16">
								Hora
							</th>
							{courts.map((court) => (
								<th
									key={court.id}
									className="px-4 py-2 text-center text-xs font-semibold text-gray-600 border-l border-gray-300"
								>
									{court.name}
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{hours.map((hour) => (
							<tr key={hour} className="h-16">
								<td className="px-2 py-2 align-top whitespace-nowrap text-xs font-bold text-gray-700 sticky left-0 bg-white z-20 w-16">{`${String(hour).padStart(2, "0")}:00`}</td>
								{courts.map((court) => (
									<td
										key={court.id}
										className="p-0 align-top border-l border-gray-300 relative"
									>
										{renderSubCell(
											`${String(hour).padStart(2, "0")}:00`,
											court,
										)}
										{renderSubCell(
											`${String(hour).padStart(2, "0")}:30`,
											court,
										)}
									</td>
								))}
							</tr>
						))}
					</tbody>
				</table>
			</div>
			<BookingDialog
				isOpen={dialogOpen}
				onClose={() => setDialogOpen(false)}
				onConfirm={handleConfirmBooking}
				slotInfo={selectedCell}
				availableDurations={availableDurations}
			/>
		</>
	)
}

export default BookingTable
