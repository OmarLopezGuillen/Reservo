import { addDays, format, subDays } from "date-fns"
import { es } from "date-fns/locale"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useState } from "react"
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
}

export function CalendarNavigator({
	selectedDate,
	onDateChange,
}: CalendarNavigatorProps) {
	const [isPopoverOpen, setIsPopoverOpen] = useState(false)

	const formatDateWeekDayMonthShort = (date: Date) => {
		return format(date, "E, d MMM", { locale: es })
	}

	const handlePrevDay = () => {
		onDateChange(subDays(selectedDate, 1))
	}

	const handleNextDay = () => {
		onDateChange(addDays(selectedDate, 1))
	}

	const handleDateSelect = (day: Date) => {
		onDateChange(day)
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
							{formatDateWeekDayMonthShort(selectedDate)}
						</span>
					</button>
				</PopoverTrigger>
				<PopoverContent className="w-80 p-0" align="center">
					<CalendarPicker
						selectedDate={selectedDate}
						onSelectDate={handleDateSelect}
						onCancel={() => setIsPopoverOpen(false)}
					/>
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
