import { useMemo, useState } from "react"
import { useParams } from "react-router"
import { Button } from "@/components/ui/button"
import { useCompetitionCategoriesByCompetitionId } from "@/hooks/competitions/useCompetitionCategoriesQuery"
import { useMatchesByCompetitionId } from "@/hooks/competitions/useMatchesQuery"
import type { Match } from "@/models/competition.model"
import { MatchCard } from "@/pages/admin/pages/Competiciones/pages/CompetitionId/components/TabsCompetition/components/matches-tab/components/MatchCard"

type GroupedMatches = Record<string, Match[]>

const ALL_ROUNDS = "all"
const ALL_CATEGORIES = "all"

const MatchesTab = () => {
	const { competicionId } = useParams<{ competicionId: string }>()
	const { matchesQuery } = useMatchesByCompetitionId(competicionId)
	const { competitionCategoriesQuery } =
		useCompetitionCategoriesByCompetitionId(competicionId)
	const [selectedRound, setSelectedRound] = useState<number | typeof ALL_ROUNDS>(
		ALL_ROUNDS,
	)
	const [selectedCategoryId, setSelectedCategoryId] = useState<
		string | typeof ALL_CATEGORIES
	>(ALL_CATEGORIES)

	const roundOptions = useMemo(() => {
		const rounds = new Set<number>()
		for (const match of matchesQuery.data ?? []) rounds.add(match.round)
		return [...rounds].sort((a, b) => a - b)
	}, [matchesQuery.data])

	const categoryOptions = useMemo(() => {
		return (competitionCategoriesQuery.data ?? []).map((category) => ({
			id: category.id,
			name: category.name,
		}))
	}, [competitionCategoriesQuery.data])

	const groupedMatches = useMemo<GroupedMatches>(() => {
		if (!matchesQuery.data || !competitionCategoriesQuery.data) return {}

		const roundFilteredMatches =
			selectedRound === ALL_ROUNDS
				? matchesQuery.data
				: matchesQuery.data.filter((match) => match.round === selectedRound)

		const filteredMatches =
			selectedCategoryId === ALL_CATEGORIES
				? roundFilteredMatches
				: roundFilteredMatches.filter(
						(match) => match.categoryId === selectedCategoryId,
					)

		return filteredMatches.reduce((acc, match) => {
			const category = competitionCategoriesQuery.data.find(
				(currentCategory) => currentCategory.id === match.categoryId,
			)
			const categoryName = category?.name ?? "Sin categoría"

			if (!acc[categoryName]) acc[categoryName] = []
			acc[categoryName].push(match)
			return acc
		}, {} as GroupedMatches)
	}, [
		matchesQuery.data,
		competitionCategoriesQuery.data,
		selectedRound,
		selectedCategoryId,
	])

	const groupedEntries = Object.entries(groupedMatches)

	return (
		<div className="space-y-6">
			<div className="flex flex-wrap items-center gap-2">
				<Button
					type="button"
					variant={selectedRound === ALL_ROUNDS ? "default" : "outline"}
					size="sm"
					onClick={() => setSelectedRound(ALL_ROUNDS)}
				>
					Todas las jornadas
				</Button>

				{roundOptions.map((round) => (
					<Button
						key={round}
						type="button"
						variant={selectedRound === round ? "default" : "outline"}
						size="sm"
						onClick={() => setSelectedRound(round)}
					>
						Jornada {round}
					</Button>
					))}
			</div>

			{categoryOptions.length > 1 && (
				<div className="flex flex-wrap items-center gap-2">
					<Button
						type="button"
						variant={
							selectedCategoryId === ALL_CATEGORIES ? "default" : "outline"
						}
						size="sm"
						onClick={() => setSelectedCategoryId(ALL_CATEGORIES)}
					>
						Todas las categorías
					</Button>

					{categoryOptions.map((category) => (
						<Button
							key={category.id}
							type="button"
							variant={
								selectedCategoryId === category.id ? "default" : "outline"
							}
							size="sm"
							onClick={() => setSelectedCategoryId(category.id)}
						>
							{category.name}
						</Button>
					))}
				</div>
			)}

			{groupedEntries.length === 0 && (
				<div className="rounded-md border border-dashed p-6 text-sm text-muted-foreground">
					No hay partidos para el filtro seleccionado.
				</div>
			)}

			{groupedEntries.map(([categoryName, matches]) => (
				<section key={categoryName} className="space-y-4">
					<h2 className="text-xl font-bold">{categoryName}</h2>
					<div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
						{[...matches]
							.sort((a, b) => a.round - b.round)
							.map((match) => (
								<MatchCard key={match.id} match={match} />
							))}
					</div>
				</section>
			))}
		</div>
	)
}

export default MatchesTab
