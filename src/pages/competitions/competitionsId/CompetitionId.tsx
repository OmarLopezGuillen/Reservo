import { ArrowLeft, Loader2, ShieldAlert, Trophy } from "lucide-react"
import { useMemo } from "react"
import { Link, useParams } from "react-router"
import { useAuthUser } from "@/auth/hooks/useAuthUser"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ROUTES } from "@/constants/ROUTES"
import { useCompetitionTeamsByCompetitionId } from "@/hooks/competitions/useCompetitionTeamsQuery"

import { useCompetitionCategoriesByCompetitionId } from "@/hooks/competitions/useCompetitionCategoriesQuery"
import { useMatchesByCompetitionId } from "@/hooks/competitions/useMatchesQuery"

import type { Match } from "@/models/competition.model"

import { MatchCard } from "@/pages/admin/pages/Competiciones/pages/CompetitionId/components/TabsCompetition/components/matches-tab/components/MatchCard"
import StandingsTab from "@/pages/admin/pages/Competiciones/pages/CompetitionId/components/TabsCompetition/components/standings-tab"

type MatchesByCategory = Record<string, Match[]>

const CompetitionId = () => {
	const user = useAuthUser()
	const { competicionId } = useParams<{ competicionId: string }>()

	const { matchesQuery } = useMatchesByCompetitionId(competicionId)
	const { competitionTeamsQuery } =
		useCompetitionTeamsByCompetitionId(competicionId)
	const { competitionCategoriesQuery } =
		useCompetitionCategoriesByCompetitionId(competicionId)

	const myTeamIds = useMemo(() => {
		const teams = competitionTeamsQuery.data ?? []
		return new Set(
			teams
				.filter((team) =>
					team.members.some((member) => member.userId === user.id),
				)
				.map((team) => team.id),
		)
	}, [competitionTeamsQuery.data, user.id])

	const groupedMatches = useMemo<MatchesByCategory>(() => {
		const matches = matchesQuery.data
		const categories = competitionCategoriesQuery.data

		if (!matches || !categories) return {}

		return matches
			.filter(
				(match) =>
					myTeamIds.has(match.homeTeamId) || myTeamIds.has(match.awayTeamId),
			)
			.reduce<MatchesByCategory>((acc, match) => {
			const category = categories.find((c) => c.id === match.categoryId)
			const categoryName = category?.name ?? "Sin categoría"

			acc[categoryName] = acc[categoryName] || []
			acc[categoryName].push(match)

			return acc
		}, {})
	}, [matchesQuery.data, competitionCategoriesQuery.data, myTeamIds])

	if (
		matchesQuery.isLoading ||
		competitionCategoriesQuery.isLoading ||
		competitionTeamsQuery.isLoading
	) {
		return (
			<div className="min-h-screen bg-background">
				<header className="border-b">
					<div className="container mx-auto px-4 py-4">
						<div className="flex items-center gap-4">
							<Button variant="ghost" size="sm" asChild>
								<Link to={ROUTES.MIS_LIGAS}>
									<ArrowLeft className="h-4 w-4 mr-2" />
									Volver
								</Link>
							</Button>
							<h1 className="text-2xl font-bold">Detalles de la competición</h1>
						</div>
					</div>
				</header>
				<div className="container mx-auto px-4 py-8 flex h-72 items-center justify-center">
					<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
				</div>
			</div>
		)
	}

	if (
		matchesQuery.isError ||
		competitionCategoriesQuery.isError ||
		competitionTeamsQuery.isError
	) {
		return (
			<div className="min-h-screen bg-background">
				<header className="border-b">
					<div className="container mx-auto px-4 py-4">
						<div className="flex items-center gap-4">
							<Button variant="ghost" size="sm" asChild>
								<Link to={ROUTES.MIS_LIGAS}>
									<ArrowLeft className="h-4 w-4 mr-2" />
									Volver
								</Link>
							</Button>
							<h1 className="text-2xl font-bold">Detalles de la competición</h1>
						</div>
					</div>
				</header>
				<div className="container mx-auto px-4 py-10 text-center">
					<ShieldAlert className="mx-auto mb-4 h-12 w-12 text-destructive" />
					<h2 className="text-2xl font-bold">
						Ha ocurrido un error al cargar los datos
					</h2>
					<p className="text-muted-foreground">Inténtalo de nuevo más tarde.</p>
				</div>
			</div>
		)
	}

	const hasMatches = Object.keys(groupedMatches).length > 0

	return (
		<div className="min-h-screen bg-background">
			<header className="border-b">
				<div className="container mx-auto px-4 py-4">
					<div className="flex items-center gap-4">
						<Button variant="ghost" size="sm" asChild>
							<Link to={ROUTES.MIS_LIGAS}>
								<ArrowLeft className="h-4 w-4 mr-2" />
								Volver
							</Link>
						</Button>
						<h1 className="text-2xl font-bold">Detalles de la competición</h1>
					</div>
				</div>
			</header>

			<div className="container mx-auto px-4 py-8 space-y-8 max-w-6xl">
				<Card>
					<CardHeader>
						<CardTitle>Partidos</CardTitle>
					</CardHeader>
					<CardContent className="space-y-6">
						{!hasMatches && (
							<div className="rounded-lg border border-dashed p-8 text-center">
								<Trophy className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
								<p className="text-muted-foreground">
									No hay partidos para tus equipos en esta competición.
								</p>
							</div>
						)}

						{Object.entries(groupedMatches).map(([categoryName, matches]) => (
							<section key={categoryName} className="space-y-3">
								<h3 className="text-lg font-semibold border-b pb-2">
									{categoryName}
								</h3>

								<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
									{[...matches]
										.sort((a, b) => a.round - b.round)
										.map((match) => (
											<MatchCard key={match.id} match={match} />
										))}
								</div>
							</section>
						))}
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Clasificación</CardTitle>
					</CardHeader>
					<CardContent>
						<StandingsTab competitionId={competicionId ?? ""} />
					</CardContent>
				</Card>
			</div>
		</div>
	)
}

export default CompetitionId
