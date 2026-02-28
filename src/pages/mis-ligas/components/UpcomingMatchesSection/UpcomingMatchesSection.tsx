import { Alert, AlertDescription } from "@/components/ui/alert"
import { UpcomingMatchesList } from "@/pages/mis-ligas/components/UpcomingMatchesSection/components/UpcomingMatchesList"
import { useUpcomingMatches } from "@/pages/mis-ligas/components/UpcomingMatchesSection/hooks/useUpcomingMatches"
import { UpcomingMatchesHeader } from "./components/UpcomingMatchesHeader"
import type { UpcomingMatchesSectionProps } from "./types/types"

export const UpcomingMatchesSection = ({
	competitionIds,
	title = "Próximos partidos",
	maxItems = 3,
	showCompetitionName = true,
}: UpcomingMatchesSectionProps) => {
	const { hasError, isLoading, upcomingMatches } = useUpcomingMatches({
		competitionIds,
		maxItems,
	})

	if (hasError) {
		return (
			<Alert variant="destructive">
				<AlertDescription>
					No se pudieron cargar los próximos partidos. Inténtalo de nuevo.
				</AlertDescription>
			</Alert>
		)
	}

	return (
		<section className="space-y-4">
			<UpcomingMatchesHeader title={title} />
			<div className="space-y-3">
				<UpcomingMatchesList
					isLoading={isLoading}
					matches={upcomingMatches}
					showCompetitionName={showCompetitionName}
				/>
			</div>
		</section>
	)
}
