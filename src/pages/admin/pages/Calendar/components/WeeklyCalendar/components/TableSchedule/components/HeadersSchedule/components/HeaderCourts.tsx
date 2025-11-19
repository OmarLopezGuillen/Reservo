import { useCourts } from "@/hooks/useCourtsQuery"
import { cn } from "@/lib/utils"
import { useCourtsStore } from "@/pages/admin/pages/Calendar/components/WeeklyCalendar/store/courtsSelectedStore"

interface Props {
	weekDates: Date[]
}

export const HeaderCourts = ({ weekDates }: Props) => {
	const { courtsQuery } = useCourts("a32a865d-3ecc-448b-a38d-9da8a10cca59")
	const courtsSelected = useCourtsStore((state) => state.courtsSelected)

	const courts = courtsQuery.data?.filter((court) =>
		courtsSelected.includes(court.id),
	)
	if (!courts) return

	return (
		<div
			className={cn(
				"border-b bg-muted border-t grid grid-cols-[60px_repeat(7,minmax(250px,1fr))] min-w-[1810px]",
			)}
			style={{
				gridTemplateColumns: `60px repeat(${weekDates.length},minmax(250px,1fr))`,
				minWidth: 250 * weekDates.length + 60,
			}}
		>
			<span className="p-1 text-sm font-medium text-muted-foreground border-r flex items-end justify-end">
				Pistas
			</span>
			{weekDates.map((date) => (
				<div
					key={`${date.getDate()}-header`}
					className="grid text-center border-r last:border-r-0"
					style={{
						gridTemplateColumns: `repeat(${courts.length}, minmax(0, 1fr))`,
					}}
				>
					{courts.map((court) => (
						<span
							key={`${court.id} ${date.getDate()}`}
							className="border-r last:border-0 text-xs text-muted-foreground flex items-center justify-center"
						>
							{court.name}
						</span>
					))}
				</div>
			))}
		</div>
	)
}
