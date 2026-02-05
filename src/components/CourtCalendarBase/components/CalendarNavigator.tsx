import { addDays, format, subDays } from "date-fns"
import { es } from "date-fns/locale"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useMemo, useState } from "react"
import { CalendarPicker } from "@/components/CalendarPicker/CalendarPicker"
import { Button } from "@/components/ui/button"
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover"

interface CalendarNavigatorProps {
	selectedDate: Date
	onDateChange: (date: Date) => void
	maxDate?: Date
	disabled?: boolean
}

const startOfDay = (d: Date) => {
	const x = new Date(d)
	x.setHours(0, 0, 0, 0)
	return x
}

export function CalendarNavigator({
	selectedDate,
	onDateChange,
	maxDate,
	disabled,
}: CalendarNavigatorProps) {
	const [isPopoverOpen, setIsPopoverOpen] = useState(false)

	const formatDateWeekDayMonthShort = (date: Date) => {
		return format(date, "E, d MMM", { locale: es })
	}

	const nextDisabled = useMemo(() => {
		if (disabled) return true
		if (!maxDate) return false
		return (
			startOfDay(addDays(selectedDate, 1)).getTime() >
			startOfDay(maxDate).getTime()
		)
	}, [disabled, maxDate, selectedDate])

	const prevDisabled = !!disabled

	const handlePrevDay = () => {
		if (prevDisabled) return
		onDateChange(subDays(selectedDate, 1))
	}

	const handleNextDay = () => {
		if (nextDisabled) return
		onDateChange(addDays(selectedDate, 1))
	}

	const handleDateSelect = (day: Date) => {
		if (disabled) return
		onDateChange(day)
		setIsPopoverOpen(false)
	}

	return (
		<div className="flex items-center gap-2">
			<Button
				variant="outline"
				size="icon"
				onClick={handlePrevDay}
				disabled={prevDisabled}
				className="h-9 w-9 rounded-lg hover:bg-slate-100 border-slate-200 bg-transparent"
			>
				<ChevronLeft className="w-4 h-4" />
			</Button>

			<Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
				<PopoverTrigger asChild>
					<button
						disabled={!!disabled}
						className="min-w-40 text-center px-4 py-2 bg-white rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
					>
						<span className="text-sm font-medium text-slate-900">
							{formatDateWeekDayMonthShort(selectedDate)}
						</span>
					</button>
				</PopoverTrigger>

				<PopoverContent className="w-80 p-0" align="center">
					<CalendarPicker
						selectedDate={selectedDate}
						onSelectDate={handleDateSelect}
						onCancel={() => setIsPopoverOpen(false)}
						// (opcional) si tu CalendarPicker soporta maxDate, pásalo:
						// maxDate={maxDate}
					/>
				</PopoverContent>
			</Popover>

			<Button
				variant="outline"
				size="icon"
				onClick={handleNextDay}
				disabled={nextDisabled}
				className="h-9 w-9 rounded-lg hover:bg-slate-100 border-slate-200 bg-transparent"
			>
				<ChevronRight className="w-4 h-4" />
			</Button>
		</div>
	)
}
