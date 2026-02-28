import { cn } from "@/lib/utils"
import { CellsSchedule } from "@/pages/admin/pages/Calendar/components/BookingCalendar/components/TableSchedule/components/MainSchedule/components/CellsSchedule"

interface Props {
	times: number[]
	weekDates: Date[]
}

export const GridSchedule = ({ times, weekDates }: Props) => {
	return (
		<>
			{weekDates.map((_, dayIndex) => {
				return (
					<div
						key={`row-${dayIndex}`}
						className={cn(
							"grid grid-rows-[30px_30px] border-r last:border-r-0",
							dayIndex % 2 === 1 && "bg-muted/50",
						)}
					>
						{times.map((time) => (
							<CellsSchedule
								key={`${dayIndex}${time}`}
								dayIndex={dayIndex}
								time={time}
								weekDates={weekDates}
							/>
						))}
					</div>
				)
			})}
		</>
	)
}
