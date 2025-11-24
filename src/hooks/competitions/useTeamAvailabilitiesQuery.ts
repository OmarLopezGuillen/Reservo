import { useQuery } from "@tanstack/react-query"
import {
	getTeamAvailabilitiesByTeamId,
	getTeamAvailabilityById,
} from "@/services/databaseService/competitions/team_availabilities.service"

export const TEAM_AVAILABILITIES_QUERY_KEY = "team_availabilities"

export const useTeamAvailabilitiesByTeamId = (teamId?: string) => {
	const teamAvailabilitiesQuery = useQuery({
		queryKey: [TEAM_AVAILABILITIES_QUERY_KEY, "team", teamId],
		queryFn: () => getTeamAvailabilitiesByTeamId(teamId!),
		enabled: !!teamId,
	})
	return { teamAvailabilitiesQuery }
}

export const useTeamAvailabilityById = (id: string | null) => {
	const teamAvailabilityByIdQuery = useQuery({
		queryKey: [TEAM_AVAILABILITIES_QUERY_KEY, id],
		queryFn: () => getTeamAvailabilityById(id!),
		enabled: !!id,
	})
	return { teamAvailabilityByIdQuery }
}
