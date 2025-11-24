import { useQuery } from "@tanstack/react-query"
import {
	getCompetitionTeamById,
	getCompetitionTeamsByCategoryId,
	getCompetitionTeamsByCompetitionId,
} from "@/services/databaseService/competitions/competition_teams.service"

export const COMPETITION_TEAMS_QUERY_KEY = "competition_teams"

export const useCompetitionTeamsByCompetitionId = (competitionId?: string) => {
	const competitionTeamsQuery = useQuery({
		queryKey: [
			COMPETITION_TEAMS_QUERY_KEY,
			"competition",
			competitionId,
		],
		queryFn: () => getCompetitionTeamsByCompetitionId(competitionId!),
		enabled: !!competitionId,
	})
	return { competitionTeamsQuery }
}

export const useCompetitionTeamsByCategoryId = (categoryId?: string) => {
	const competitionTeamsQuery = useQuery({
		queryKey: [COMPETITION_TEAMS_QUERY_KEY, "category", categoryId],
		queryFn: () => getCompetitionTeamsByCategoryId(categoryId!),
		enabled: !!categoryId,
	})
	return { competitionTeamsQuery }
}

export const useCompetitionTeamById = (id: string | null) => {
	const competitionTeamByIdQuery = useQuery({
		queryKey: [COMPETITION_TEAMS_QUERY_KEY, id],
		queryFn: () => getCompetitionTeamById(id!),
		enabled: !!id,
	})
	return { competitionTeamByIdQuery }
}
