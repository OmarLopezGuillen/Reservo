import { HeaderCourts } from "@/pages/admin/pages/Calendar/components/WeeklyCalendar/components/TableSchedule/components/HeadersSchedule/components/HeaderCourts"
import { MainHeader } from "@/pages/admin/pages/Calendar/components/WeeklyCalendar/components/TableSchedule/components/HeadersSchedule/components/MainHeader"

interface Props {
	weekDates: Date[]
}

export const HeadersSchedule = ({ weekDates }: Props) => {
	return (
		<div className="sticky top-0 z-2">
			<MainHeader weekDates={weekDates} />
			<HeaderCourts weekDates={weekDates} />
		</div>
	)
}
