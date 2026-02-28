import { Skeleton } from "@/components/ui/skeleton"
import { UpcomingMatchCard } from "@/pages/mis-ligas/components/UpcomingMatchesSection/components/UpcomingMatchCard"
import type { UpcomingMatchItem } from "@/pages/mis-ligas/components/UpcomingMatchesSection/types/types"

type UpcomingMatchesListProps = {
	isLoading: boolean
	matches: UpcomingMatchItem[]
	showCompetitionName: boolean
}

export const UpcomingMatchesList = ({
	isLoading,
	matches,
	showCompetitionName,
}: UpcomingMatchesListProps) => {
	if (isLoading) {
		return (
			<div className="space-y-3">
				<Skeleton className="h-20 w-full" />
				<Skeleton className="h-20 w-full" />
			</div>
		)
	}

	if (matches.length === 0) {
		return (
			<div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
				No hay próximos partidos.
			</div>
		)
	}

	return (
		<>
			{matches.map((match) => (
				<UpcomingMatchCard
					key={match.id}
					match={match}
					showCompetitionName={showCompetitionName}
				/>
			))}
		</>
	)
}
