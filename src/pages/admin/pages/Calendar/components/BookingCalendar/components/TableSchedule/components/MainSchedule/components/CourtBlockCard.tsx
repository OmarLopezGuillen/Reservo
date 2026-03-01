import { differenceInMinutes, format } from "date-fns"
import { CalendarDays, Clock, Trophy } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import type { Court } from "@/models/court.model"

export interface CourtBlockVisual {
	awayTeamName: string | null
	competitionName: string | null
	courtId: string
	endTime: Date
	homeTeamName: string | null
	id: string
	matchday: number | null
	payments: Array<{ name: string; paid: boolean }> | null
	reason: string
	round: number | null
	startTime: Date
}

const getBlockHeight = (courtBlock: CourtBlockVisual) =>
	differenceInMinutes(courtBlock.endTime, courtBlock.startTime)

export function CourtBlockCard({
	court,
	courtBlock,
	onClick,
}: {
	court: Court
	courtBlock: CourtBlockVisual
	onClick: () => void
}) {
	const height = getBlockHeight(courtBlock)

	return (
		<button
			type="button"
			className="@container w-full overflow-hidden text-left absolute top-0 left-0 right-0 z-10"
			onClick={onClick}
		>
			<div
				style={{ height, borderColor: court?.color ?? "" }}
				className="@[150px]:hidden flex flex-col items-center justify-center gap-1.5 p-2 rounded-lg bg-sky-100/70 border-2 relative mx-0.5"
			>
				<Trophy className="h-3 w-3 text-sky-700" />
				{courtBlock.competitionName && (
					<div className="text-[10px] text-center leading-tight text-sky-700 line-clamp-1">
						{courtBlock.competitionName}
					</div>
				)}
			</div>

			<Card
				className="hidden @[150px]:block py-0 border-2 mx-0.5 bg-sky-50 cursor-pointer"
				style={{ height, borderColor: court?.color ?? "" }}
			>
				<CardContent className="p-2 h-full">
					<div className="flex items-center justify-between h-full gap-2">
						<div className="flex flex-col justify-center text-xs leading-tight">
							<div className="font-semibold text-center text-sky-800 flex items-center justify-center gap-1">
								<Trophy className="h-3.5 w-3.5" />
								Partido de competición
							</div>
							<div className="text-xs text-center leading-tight mt-1 text-muted-foreground">
								{format(courtBlock.startTime, "HH:mm")} -{" "}
								{format(courtBlock.endTime, "HH:mm")}
							</div>
						</div>

						<div className="flex items-center gap-1 text-muted-foreground">
							<Clock className="h-3 w-3" />
							<span className="text-xs">{height} min</span>
						</div>
					</div>
					<div className="text-[11px] text-center mt-1 text-muted-foreground line-clamp-1">
						{courtBlock.reason}
					</div>
					{courtBlock.competitionName && (
						<div className="text-[11px] text-center mt-1 text-sky-700 line-clamp-1 flex items-center justify-center gap-1">
							<CalendarDays className="h-3 w-3" />
							{courtBlock.competitionName}
						</div>
					)}
					{courtBlock.round && (
						<div className="text-[11px] text-center mt-1 text-sky-700">
							Jornada {courtBlock.matchday ?? courtBlock.round}
						</div>
					)}
					{courtBlock.homeTeamName && courtBlock.awayTeamName && (
						<div className="text-[11px] text-center mt-1 text-muted-foreground line-clamp-1">
							{courtBlock.homeTeamName} vs {courtBlock.awayTeamName}
						</div>
					)}
				</CardContent>
			</Card>
		</button>
	)
}
