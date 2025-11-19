import { cn } from "@/lib/utils"
import { GridSchedule } from "@/pages/admin/pages/Calendar/components/WeeklyCalendar/components/TableSchedule/components/MainSchedule/components/GridSchedule/GridSchedule"
import { useSelectedSlot } from "@/pages/admin/pages/Calendar/components/WeeklyCalendar/components/TableSchedule/components/MainSchedule/hooks/useSelectedSlot"

const formatHour = (hour: string) => {
	return `${hour.padStart(2, "0")}:00`
}

interface Props {
	weekDates: Date[]
}

export const MainSchedule = ({ weekDates }: Props) => {
	const { hourGroups } = useSelectedSlot()
	return (
		<div>
			{Object.entries(hourGroups).map(([hour, times]) => {
				return (
					<div
						key={hour}
						className={cn("border-b last:border-b-0 grid")}
						style={{
							gridTemplateColumns: `60px repeat(${weekDates.length},minmax(250px,1fr))`,
							minWidth: 250 * weekDates.length + 60,
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
	)
}
