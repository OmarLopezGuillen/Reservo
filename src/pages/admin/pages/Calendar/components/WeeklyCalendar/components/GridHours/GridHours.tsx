import { eachDayOfInterval, endOfWeek, startOfWeek } from "date-fns"
import { GridSchedule } from "@/pages/admin/pages/Calendar/components/WeeklyCalendar/components/GridHours/components/GridSchedule/GridSchedule"
import { HeaderGridHours } from "@/pages/admin/pages/Calendar/components/WeeklyCalendar/components/GridHours/components/HeaderGridHours"
import { useSelectedSlot } from "@/pages/admin/pages/Calendar/components/WeeklyCalendar/components/GridHours/components/hooks/useSelectedSlot"
import { useCurrentDayQueryState } from "@/pages/admin/pages/Calendar/hooks/useCalendarQueryState"

const formatHour = (hour: string) => {
	return `${hour.padStart(2, "0")}:00`
}

const getWeekDays = (date: Date) => {
	// weekStartsOn: 1 -> lunes, 0 -> domingo
	const start = startOfWeek(date, { weekStartsOn: 1 })
	const end = endOfWeek(date, { weekStartsOn: 1 })

	return eachDayOfInterval({ start, end })
}

export const GridHours = () => {
	const { currentDate } = useCurrentDayQueryState()

	const {
		isDialogOpen,
		handleCloseDialog,
		selectedSlot,
		hourGroups,
		handleSlotClick,
	} = useSelectedSlot()

	const weekDates = getWeekDays(currentDate)

	/* 	const { getWorkShiftsForSlot } = useGetShiftsEvents({
		franjaData,
		profesorTimeTable,
	}) */

	return (
		<div className="overflow-x-auto">
			<HeaderGridHours weekDates={weekDates} />
			<div className="inline-block">
				{Object.entries(hourGroups).map(([hour, times]) => {
					return (
						<div
							key={hour}
							className=" border-b last:border-b-0"
							style={{
								display: "grid",
								gridTemplateColumns: "60px repeat(7, minmax(120px, 200px)",
								minWidth: "900px",
							}}
						>
							<div className="p-2 text-xs text-muted-foreground border-r flex items-start justify-end">
								{formatHour(hour)}
							</div>

							<GridSchedule times={times} weekDates={weekDates} />
						</div>
					)
				})}
			</div>

			{/* 			<CreateEventDialog
				selectedTeacher={selectedTeacher}
				open={isDialogOpen}
				onClose={handleCloseDialog}
				selectedSlot={selectedSlot}
			/> */}
		</div>
	)
}
