import { useQuery } from "@tanstack/react-query"
import {
	getCompetitionTeamMemberById,
	getCompetitionTeamMembersByTeamId,
} from "@/services/databaseService/competitions/competitions_team_members.service"

export const COMPETITION_TEAM_MEMBERS_QUERY_KEY = "competition_team_members"

export const useCompetitionTeamMembersByTeamId = (teamId?: string) => {
	const competitionTeamMembersQuery = useQuery({
		queryKey: [COMPETITION_TEAM_MEMBERS_QUERY_KEY, "team", teamId],
		queryFn: () => getCompetitionTeamMembersByTeamId(teamId!),
		enabled: !!teamId,
	})
	return { competitionTeamMembersQuery }
}

export const useCompetitionTeamMemberById = (id: string | null) => {
	const competitionTeamMemberByIdQuery = useQuery({
		queryKey: [COMPETITION_TEAM_MEMBERS_QUERY_KEY, id],
		queryFn: () => getCompetitionTeamMemberById(id!),
		enabled: !!id,
	})
	return { competitionTeamMemberByIdQuery }
}
