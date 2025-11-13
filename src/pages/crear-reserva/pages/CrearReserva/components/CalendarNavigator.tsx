import {
	addDays,
	addMonths,
	format,
	isSameDay,
	isToday as isTodayFns,
	subDays,
	subMonths,
} from "date-fns"
import { es } from "date-fns/locale"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover"
import { getDaysInMonth } from "@/lib/utils"

interface CalendarNavigatorProps {
	selectedDate: Date
	onDateChange: (date: Date) => void
}

export function CalendarNavigator({
	selectedDate,
	onDateChange,
}: CalendarNavigatorProps) {
	const [isPopoverOpen, setIsPopoverOpen] = useState(false)
	const [calendarMonth, setCalendarMonth] = useState(selectedDate)

	useEffect(() => {
		setCalendarMonth(selectedDate)
	}, [selectedDate])

	const formatDate = (date: Date) => {
		return format(date, "E, d MMM", { locale: es })
	}

	const handlePrevDay = () => {
		onDateChange(subDays(selectedDate, 1))
	}

	const handleNextDay = () => {
		onDateChange(addDays(selectedDate, 1))
	}

	const isSelectedDay = (day: number) => {
		const dateToCheck = new Date(
			calendarMonth.getFullYear(),
			calendarMonth.getMonth(),
			day,
		)
		return isSameDay(dateToCheck, selectedDate)
	}

	const handlePrevMonth = () => {
		setCalendarMonth(subMonths(calendarMonth, 1))
	}

	const handleNextMonth = () => {
		setCalendarMonth(addMonths(calendarMonth, 1))
	}

	const handleDateSelect = (day: number) => {
		const newDate = new Date(
			calendarMonth.getFullYear(),
			calendarMonth.getMonth(),
			day,
		)
		onDateChange(newDate)
		setIsPopoverOpen(false)
	}

	return (
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
									month: "long", // Mantenemos esto para capitalizar el mes
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
							{["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map((day) => (
								<div
									key={day}
									className="text-xs font-medium text-slate-500 py-2"
								>
									{day}
								</div>
							))}
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
									const today = isTodayFns(
										new Date(
											calendarMonth.getFullYear(),
											calendarMonth.getMonth(),
											dayNum,
										),
									)

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
									onDateChange(today)
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
	)
}
