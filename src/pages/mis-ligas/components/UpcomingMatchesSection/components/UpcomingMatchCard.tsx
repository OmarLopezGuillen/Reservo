import { Calendar, Clock } from "lucide-react"
import { Link } from "react-router"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ROUTES } from "@/constants/ROUTES"
import {
	formatDateWeekDayMonthShort,
	formatTimeToHourMinute,
} from "@/lib/utils"
import type { UpcomingMatchItem } from "@/pages/mis-ligas/components/UpcomingMatchesSection/types/types"

type UpcomingMatchCardProps = {
	match: UpcomingMatchItem
	showCompetitionName: boolean
}

export const UpcomingMatchCard = ({
	match,
	showCompetitionName,
}: UpcomingMatchCardProps) => {
	return (
		<div className="rounded-lg border p-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
			<div className="space-y-2">
				<div className="flex items-center justify-between sm:justify-start gap-2">
					<Badge
						variant={match.status === "scheduled" ? "default" : "secondary"}
					>
						{match.status === "scheduled" ? "Programado" : "Pendiente"}
					</Badge>
					<span className="text-sm font-medium">Jornada {match.round}</span>
				</div>

				<div className="text-sm font-semibold">
					{match.homeTeamName} vs {match.awayTeamName}
				</div>

				<div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
					{match.startTime ? (
						<>
							<span className="inline-flex items-center gap-1">
								<Calendar className="h-3.5 w-3.5" />
								{formatDateWeekDayMonthShort(match.startTime)}
							</span>
							<span className="inline-flex items-center gap-1">
								<Clock className="h-3.5 w-3.5" />
								{formatTimeToHourMinute(match.startTime)}
							</span>
						</>
					) : (
						<span>Fecha por definir</span>
					)}
				</div>

				{showCompetitionName && (
					<p className="text-xs text-muted-foreground">
						Liga: <span className="font-medium">{match.competitionName}</span>
					</p>
				)}
			</div>

			<Button asChild size="sm" variant="outline">
				<Link to={ROUTES.COMPETITIONS.ID(match.competitionId)}>Ver liga</Link>
			</Button>
		</div>
	)
}
