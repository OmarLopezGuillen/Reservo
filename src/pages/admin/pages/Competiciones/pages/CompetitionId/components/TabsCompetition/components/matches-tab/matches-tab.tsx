import { useMemo } from "react"
import { useParams } from "react-router"
import { useCompetitionCategoriesByCompetitionId } from "@/hooks/competitions/useCompetitionCategoriesQuery"
import { useMatchesByCompetitionId } from "@/hooks/competitions/useMatchesQuery"
import type { Match } from "@/models/competition.model"
import { MatchCard } from "@/pages/admin/pages/Competiciones/pages/CompetitionId/components/TabsCompetition/components/matches-tab/components/match-card"

const MatchesTab = () => {
	const { competicionId } = useParams<{ competicionId: string }>()
	const { matchesQuery } = useMatchesByCompetitionId(competicionId)
	const { competitionCategoriesQuery } =
		useCompetitionCategoriesByCompetitionId(competicionId)

	const groupedMatches = useMemo(() => {
		if (!matchesQuery.data || !competitionCategoriesQuery.data) return {}

		return matchesQuery.data.reduce(
			(acc, match) => {
				const category = competitionCategoriesQuery.data.find(
					(c) => c.id === match.categoryId,
				)
				const categoryName = category?.name || "Sin categoría"

				if (!acc[categoryName]) {
					acc[categoryName] = []
				}
				acc[categoryName].push(match)
				return acc
			},
			{} as Record<string, Match[]>,
		)
	}, [matchesQuery.data, competitionCategoriesQuery.data])

	return (
		<div className="space-y-6">
			{Object.entries(groupedMatches).map(([categoryName, matches]) => (
				<div key={categoryName}>
					<h2 className="text-xl font-bold mb-4">{categoryName}</h2>
					<div className="space-y-4">
						{matches
							.sort((a, b) => a.round - b.round)
							.map((match) => (
								<MatchCard match={match} />
							))}
					</div>
				</div>
			))}
		</div>
	)
}

export default MatchesTab
