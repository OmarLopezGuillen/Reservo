import { useQuery } from "@tanstack/react-query"
import {
	getCompetitionTeamInviteById,
	getCompetitionTeamInvitesByTeamId,
} from "@/services/databaseService/competitions/competition_team_invites.service"

export const COMPETITION_TEAM_INVITES_QUERY_KEY = "competition_team_invites"

export const useCompetitionTeamInvitesByTeamId = (teamId?: string) => {
	const competitionTeamInvitesQuery = useQuery({
		queryKey: [COMPETITION_TEAM_INVITES_QUERY_KEY, "team", teamId],
		queryFn: () => getCompetitionTeamInvitesByTeamId(teamId!),
		enabled: !!teamId,
	})
	return { competitionTeamInvitesQuery }
}

export const useCompetitionTeamInviteById = (id: string | null) => {
	const competitionTeamInviteByIdQuery = useQuery({
		queryKey: [COMPETITION_TEAM_INVITES_QUERY_KEY, id],
		queryFn: () => getCompetitionTeamInviteById(id!),
		enabled: !!id,
	})
	return { competitionTeamInviteByIdQuery }
}
