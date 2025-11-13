import { HeaderCalendar } from "@/pages/admin/pages/Calendar/components/WeeklyCalendar/components/HeaderCalendar"

export function WeeklyCalendar() {
	return (
		<div className="rounded-lg border bg-card shadow-sm">
			<HeaderCalendar />
			{/* 			<div className="relative overflow-x-auto">
				<HeaderGridHours weekDates={weekDates} />

				<GridHours
					weekDates={weekDates}
					selectedTeacher={selectedTeacher}
					franjaData={franjaData}
					profesorTimeTable={profesorTimeTable}
				/>
			</div> */}
		</div>
	)
}
