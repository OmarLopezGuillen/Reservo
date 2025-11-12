import { addDays, format, startOfDay, subDays } from "date-fns"
import { es } from "date-fns/locale"
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover"

interface DateNavigatorProps {
	selectedDate: Date
	onSelectDate: (date: Date) => void
}

const DateNavigator = ({ selectedDate, onSelectDate }: DateNavigatorProps) => {
	const handleDateSelect = (date: Date | undefined) => {
		if (date) {
			onSelectDate(date)
		}
	}

	const minDate = startOfDay(new Date(Date.now() - 24 * 60 * 60 * 1000))
	const maxDate = startOfDay(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000))

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<CalendarDays className="h-5 w-5" />
					Selecciona la fecha
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="flex items-center gap-2">
					<Button
						variant="outline"
						size="sm"
						onClick={() => onSelectDate(subDays(selectedDate, 1))}
						disabled={startOfDay(subDays(selectedDate, 1)) < minDate}
					>
						<ChevronLeft className="h-4 w-4" />
					</Button>
					<Popover>
						<PopoverTrigger asChild>
							<Button variant="outline" className="flex-1 bg-transparent">
								{format(selectedDate, "PPP", { locale: es })}
							</Button>
						</PopoverTrigger>
						<PopoverContent className="w-auto p-0" align="start">
							<Calendar
								mode="single"
								selected={selectedDate}
								onSelect={handleDateSelect}
								disabled={(date) => date < minDate || date > maxDate}
							/>
						</PopoverContent>
					</Popover>
					<Button
						variant="outline"
						size="sm"
						onClick={() => onSelectDate(addDays(selectedDate, 1))}
						disabled={startOfDay(addDays(selectedDate, 1)) > maxDate}
					>
						<ChevronRight className="h-4 w-4" />
					</Button>
				</div>
			</CardContent>
		</Card>
	)
}

export default DateNavigator
