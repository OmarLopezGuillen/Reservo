import { eachDayOfInterval, endOfWeek, startOfWeek } from "date-fns"
import { HeadersSchedule } from "@/pages/admin/pages/Calendar/components/WeeklyCalendar/components/TableSchedule/components/HeadersSchedule/HeadersSchedule"
import { MainSchedule } from "@/pages/admin/pages/Calendar/components/WeeklyCalendar/components/TableSchedule/components/MainSchedule/MainSchedule"
import {
	useCurrentDayQueryState,
	useViewModeQueryState,
} from "@/pages/admin/pages/Calendar/hooks/useCalendarQueryState"

const getWeekDays = (date: Date) => {
	const start = startOfWeek(date, { weekStartsOn: 1 })
	const end = endOfWeek(date, { weekStartsOn: 1 })

	return eachDayOfInterval({ start, end })
}

export const TableSchedule = () => {
	const { currentDate } = useCurrentDayQueryState()
	const { viewMode } = useViewModeQueryState()

	const weekDates =
		viewMode === "day" ? [currentDate] : getWeekDays(currentDate)

	return (
		<div className="rounded-lg border bg-card shadow-sm mb-2">
			<div className="overflow-auto h-[95svh] lg:h-[85svh] relative">
				<HeadersSchedule weekDates={weekDates} />
				<MainSchedule weekDates={weekDates} />
			</div>
		</div>
	)
}
