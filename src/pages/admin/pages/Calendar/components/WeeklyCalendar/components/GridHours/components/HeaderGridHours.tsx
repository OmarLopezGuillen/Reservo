import { format, isToday } from "date-fns"
import { es } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { WEEKDAYS } from "@/models/calendar.model"

interface Props {
	weekDates: Date[]
}

export const HeaderGridHours = ({ weekDates }: Props) => {
	return (
		<div
			className="border-b bg-muted/50 rounded-t-lg border-t"
			style={{
				display: "grid",
				gridTemplateColumns: "60px repeat(7, minmax(120px, 200px)",
				minWidth: "900px",
			}}
		>
			<div className="p-2 text-sm font-medium text-muted-foreground border-r flex items-end justify-end">
				Hora
			</div>
			{WEEKDAYS.map((day, index) => {
				const date = weekDates[index]
				const today = isToday(date)
				return (
					<div
						key={day}
						className={cn(
							"p-2 text-center border-r last:border-r-0",
							today && "bg-primary/10",
						)}
					>
						<div
							className={cn("text-sm font-semibold", today && "text-primary")}
						>
							{day}
						</div>
						<div
							className={cn(
								"text-xs text-muted-foreground mt-1",
								today && "text-primary font-medium",
							)}
						>
							{format(date, "d MMM", { locale: es })}
						</div>
					</div>
				)
			})}
		</div>
	)
}
