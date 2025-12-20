import { useQuery } from "@tanstack/react-query"
import {
	getCompetitionTeamInviteById,
	getCompetitionTeamInviteByToken,
	getCompetitionTeamInvitesByTeamId,
	getPendingInvitesByEmail,
} from "@/services/databaseService/competitions/competition_team_invites.service"
import { useCompetitionTeamInvitesMutation } from "./useCompetitionTeamInvitesMutations"

export const COMPETITION_TEAM_INVITES_QUERY_KEY = "competition_team_invites"

export const useCompetitionTeamInvitesByTeamId = (teamId?: string) => {
	const competitionTeamInvitesQuery = useQuery({
		queryKey: [COMPETITION_TEAM_INVITES_QUERY_KEY, "team", teamId],
		queryFn: () => getCompetitionTeamInvitesByTeamId(teamId!),
		enabled: !!teamId,
	})
	return { competitionTeamInvitesQuery }
}

export const useCompetitionTeamInvitesByToken = (token?: string) => {
	const competitionTeamInvitesByTokenQuery = useQuery({
		queryKey: [COMPETITION_TEAM_INVITES_QUERY_KEY, "token", token],
		queryFn: () => getCompetitionTeamInviteByToken(token!),
		enabled: !!token,
	})
	return { competitionTeamInvitesByTokenQuery }
}

export const useCompetitionTeamInviteById = (id: string | null) => {
	const competitionTeamInviteByIdQuery = useQuery({
		queryKey: [COMPETITION_TEAM_INVITES_QUERY_KEY, id],
		queryFn: () => getCompetitionTeamInviteById(id!),
		enabled: !!id,
	})
	return { competitionTeamInviteByIdQuery }
}

export const usePendingInvitesForUser = (email?: string) => {
	const pendingInvitesQuery = useQuery({
		queryKey: [COMPETITION_TEAM_INVITES_QUERY_KEY, "pending", email],
		queryFn: () => getPendingInvitesByEmail(email!),
		enabled: !!email,
	})
	return { pendingInvitesQuery }
}
