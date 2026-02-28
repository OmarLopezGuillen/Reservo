import { useQueries } from "@tanstack/react-query"
import { useMemo } from "react"
import { useMyCompetitions } from "@/hooks/competitions/useCompetitionsQuery"
import { COMPETITION_TEAMS_QUERY_KEY } from "@/hooks/competitions/useCompetitionTeamsQuery"
import { MATCHES_QUERY_KEY } from "@/hooks/competitions/useMatchesQuery"
import type { Match } from "@/models/competition.model"
import type { StatusMatches } from "@/models/dbTypes"
import { getCompetitionTeamsByCompetitionId } from "@/services/databaseService/competitions/competition_teams.service"
import { getMatchesByCompetitionId } from "@/services/databaseService/competitions/matches.service"
import type { UpcomingMatchItem } from "./types"

type UseUpcomingMatchesParams = {
	competitionIds?: string[]
	maxItems: number
}

const MATCHES_TO_INCLUDE: StatusMatches[] = ["scheduled"]

export const useUpcomingMatches = ({
	competitionIds,
	maxItems,
}: UseUpcomingMatchesParams) => {
	const { myCompetitionsQuery } = useMyCompetitions()
	const competitions = myCompetitionsQuery.data ?? []

	const targetCompetitionIds = useMemo(() => {
		const sourceIds =
			competitionIds && competitionIds.length > 0
				? competitionIds
				: competitions.map((competition) => competition.id)

		return Array.from(new Set(sourceIds))
	}, [competitionIds, competitions])

	const competitionsById = useMemo(
		() =>
			new Map(competitions.map((competition) => [competition.id, competition])),
		[competitions],
	)

	const matchesQueries = useQueries({
		queries: targetCompetitionIds.map((competitionId) => ({
			queryKey: [MATCHES_QUERY_KEY, "competition", competitionId],
			queryFn: () => getMatchesByCompetitionId(competitionId),
			enabled: targetCompetitionIds.length > 0,
		})),
	})

	const teamQueries = useQueries({
		queries: targetCompetitionIds.map((competitionId) => ({
			queryKey: [COMPETITION_TEAMS_QUERY_KEY, "competition", competitionId],
			queryFn: () => getCompetitionTeamsByCompetitionId(competitionId),
			enabled: targetCompetitionIds.length > 0,
		})),
	})

	const isLoading =
		myCompetitionsQuery.isLoading ||
		matchesQueries.some((query) => query.isLoading) ||
		teamQueries.some((query) => query.isLoading)

	const hasError =
		myCompetitionsQuery.isError ||
		matchesQueries.some((query) => query.isError) ||
		teamQueries.some((query) => query.isError)

	const upcomingMatches = useMemo<UpcomingMatchItem[]>(() => {
		const nowMs = Date.now()

		return targetCompetitionIds
			.flatMap((_, index) => {
				const matches = matchesQueries[index]?.data ?? []
				const teams = teamQueries[index]?.data ?? []
				const teamsById = new Map(teams.map((team) => [team.id, team.name]))

				return matches
					.filter((match) => isUpcomingMatch(match, nowMs))
					.map((match) => {
						const startMs = match.startTime ? Date.parse(match.startTime) : null
						return {
							id: match.id,
							competitionId: match.competitionId,
							competitionName:
								competitionsById.get(match.competitionId)?.name ??
								"Liga sin nombre",
							homeTeamName: teamsById.get(match.homeTeamId) ?? "Equipo local",
							awayTeamName:
								teamsById.get(match.awayTeamId) ?? "Equipo visitante",
							status: match.status,
							startTime: match.startTime,
							round: match.round,
							createdAt: match.createdAt,
							startMs,
						}
					})
			})
			.sort(compareUpcomingMatches)
			.slice(0, maxItems)
	}, [
		targetCompetitionIds,
		matchesQueries,
		teamQueries,
		competitionsById,
		maxItems,
	])

	return {
		hasError,
		isLoading,
		upcomingMatches,
	}
}

function isUpcomingMatch(match: Match, nowMs: number) {
	if (!MATCHES_TO_INCLUDE.includes(match.status)) return false

	if (match.status === "scheduled" && match.startTime) {
		const startsAt = Date.parse(match.startTime)
		return Number.isFinite(startsAt) ? startsAt > nowMs : false
	}

	return true
}

function compareUpcomingMatches(a: UpcomingMatchItem, b: UpcomingMatchItem) {
	const aScheduled = a.status === "scheduled" && a.startMs !== null
	const bScheduled = b.status === "scheduled" && b.startMs !== null

	if (aScheduled && bScheduled) {
		return (
			(a.startMs ?? Number.MAX_SAFE_INTEGER) -
			(b.startMs ?? Number.MAX_SAFE_INTEGER)
		)
	}

	if (aScheduled && !bScheduled) return -1
	if (!aScheduled && bScheduled) return 1

	if (a.round !== b.round) return a.round - b.round
	return Date.parse(a.createdAt) - Date.parse(b.createdAt)
}
