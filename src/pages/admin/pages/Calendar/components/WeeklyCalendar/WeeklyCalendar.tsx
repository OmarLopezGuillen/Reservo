import { GridHours } from "@/pages/admin/pages/Calendar/components/WeeklyCalendar/components/GridHours/GridHours"
import { HeaderCalendar } from "@/pages/admin/pages/Calendar/components/WeeklyCalendar/components/HeaderCalendar"

export function WeeklyCalendar() {
	return (
		<div className="rounded-lg border bg-card shadow-sm mb-2 max-w-[1460px]">
			<HeaderCalendar />
			<GridHours />
		</div>
	)
}
