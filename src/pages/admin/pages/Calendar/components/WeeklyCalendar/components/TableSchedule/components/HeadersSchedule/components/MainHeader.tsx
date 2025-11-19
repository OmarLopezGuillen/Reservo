import { format, isToday } from "date-fns"
import { es } from "date-fns/locale"
import { cn } from "@/lib/utils"

interface Props {
	weekDates: Date[]
}

export const MainHeader = ({ weekDates }: Props) => {
	return (
		<div
			className={cn(
				"border-b bg-muted rounded-t-lg border-t grid grid-cols-[60px_repeat(7,minmax(250px,1fr))] min-w-[1810px]",
			)}
			style={{
				gridTemplateColumns: `60px repeat(${weekDates.length},minmax(250px,1fr))`,
				minWidth: 250 * weekDates.length + 60,
			}}
		>
			<div className="p-2 text-sm font-medium text-muted-foreground border-r flex items-end justify-end">
				Hora
			</div>
			{weekDates.map((day) => {
				const today = isToday(day)
				return (
					<div
						key={day.getDay()}
						className={cn(
							"p-2 text-center border-r last:border-r-0",
							today && "bg-primary/10",
						)}
					>
						<div
							className={cn(
								"text-sm font-semibold capitalize",
								today && "text-primary",
							)}
						>
							{format(day, "EEEE", { locale: es })}
						</div>
						<div
							className={cn(
								"text-xs text-muted-foreground mt-1",
								today && "text-primary font-medium",
							)}
						>
							{format(day, "MMM d", { locale: es })}
						</div>
					</div>
				)
			})}
		</div>
	)
}
