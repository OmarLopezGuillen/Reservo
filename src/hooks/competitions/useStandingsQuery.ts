import { useQuery } from "@tanstack/react-query"
import { getCompetitionStandings } from "@/services/databaseService/competitions/standings.service"

export const STANDINGS_QUERY_KEY = "standings"

export const useCompetitionStandings = (
	competitionId?: string,
	categoryId?: string,
) => {
	const standingsQuery = useQuery({
		queryKey: [STANDINGS_QUERY_KEY, competitionId, categoryId],
		queryFn: () => getCompetitionStandings(competitionId!, categoryId!),
		enabled: !!competitionId && !!categoryId,
	})

	return { standingsQuery }
}
