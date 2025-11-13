/* const getEventHeight = (event: Schedule) => event.endTime - event.startTime

const isEventStart = (event: Schedule, time: number) => event.startTime === time */

import { addMinutes, format } from "date-fns"
import { WEEKDAYS } from "@/models/calendar.model"

interface Props {
	times: number[]
	weekDates: Date[]
}

export const GridSchedule = ({ times, weekDates }: Props) => {
	return (
		<div className="col-span-7 grid grid-rows-2">
			{times.map((time) => (
				<div key={time} className="grid grid-cols-7">
					{WEEKDAYS.map((_, dayIndex) => {
						const date = weekDates[dayIndex]
						const timeDate = addMinutes(date, time)

						return <span key={date.getDate()}>{format(timeDate, "HH:mm")}</span>
					})}
				</div>
			))}
		</div>
	)
}
