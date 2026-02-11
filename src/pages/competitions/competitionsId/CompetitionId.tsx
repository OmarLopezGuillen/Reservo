import { useMemo } from "react"
import { useNavigate, useParams } from "react-router"

import { useCompetitionCategoriesByCompetitionId } from "@/hooks/competitions/useCompetitionCategoriesQuery"
import { useMatchesByCompetitionId } from "@/hooks/competitions/useMatchesQuery"

import type { Match } from "@/models/competition.model"

import { MatchCard } from "@/pages/admin/pages/Competiciones/pages/CompetitionId/components/TabsCompetition/components/matches-tab/components/match-card"
import StandingsTab from "@/pages/admin/pages/Competiciones/pages/CompetitionId/components/TabsCompetition/components/standings-tab"

type MatchesByCategory = Record<string, Match[]>

const CompetitionId = () => {
	const navigate = useNavigate()
	const { competicionId } = useParams<{ competicionId: string }>()

	const { matchesQuery } = useMatchesByCompetitionId(competicionId)
	const { competitionCategoriesQuery } =
		useCompetitionCategoriesByCompetitionId(competicionId)

	const groupedMatches = useMemo<MatchesByCategory>(() => {
		const matches = matchesQuery.data
		const categories = competitionCategoriesQuery.data

		if (!matches || !categories) return {}

		return matches.reduce<MatchesByCategory>((acc, match) => {
			const category = categories.find((c) => c.id === match.categoryId)
			const categoryName = category?.name ?? "Sin categoría"

			acc[categoryName] = acc[categoryName] || []
			acc[categoryName].push(match)

			return acc
		}, {})
	}, [matchesQuery.data, competitionCategoriesQuery.data])

	if (matchesQuery.isLoading || competitionCategoriesQuery.isLoading) {
		return (
			<div className="flex items-center justify-center py-20">
				<p className="text-gray-500 text-lg animate-pulse">
					Cargando información de la competición...
				</p>
			</div>
		)
	}

	if (matchesQuery.isError || competitionCategoriesQuery.isError) {
		return (
			<div className="flex items-center justify-center py-20">
				<p className="text-red-500 text-lg">
					Ha ocurrido un error al cargar los datos
				</p>
			</div>
		)
	}

	const hasMatches = Object.keys(groupedMatches).length > 0

	return (
		<div className="max-w-5xl mx-auto px-4 py-6 space-y-8">
			{/* Header */}
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white shadow rounded-lg p-4">
				<h1 className="text-2xl font-bold text-gray-800">
					Detalles de la competición
				</h1>

				<button
					onClick={() => navigate("/mis-ligas")}
					className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition"
				>
					← Volver a mis ligas
				</button>
			</div>

			{/* Matches Section */}
			<div className="bg-white shadow rounded-lg p-5 space-y-6">
				<h2 className="text-xl font-semibold text-gray-700">Partidos</h2>

				{!hasMatches && (
					<p className="text-gray-500">
						No hay partidos registrados para esta competición.
					</p>
				)}

				{Object.entries(groupedMatches).map(([categoryName, matches]) => (
					<section key={categoryName} className="space-y-3">
						<h3 className="text-lg font-bold border-b pb-2 text-gray-800">
							{categoryName}
						</h3>

						<div className="space-y-3">
							{matches
								.sort((a, b) => a.round - b.round)
								.map((match) => (
									<MatchCard key={match.id} match={match} />
								))}
						</div>
					</section>
				))}
			</div>

			{/* Standings Section */}
			<div className="bg-white shadow rounded-lg p-5">
				<StandingsTab competitionId={competicionId ?? ""} />
			</div>
		</div>
	)
}

export default CompetitionId
