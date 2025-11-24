import { useQuery } from "@tanstack/react-query"
import {
	getCompetitionById,
	getCompetitionsByClubId,
} from "@/services/databaseService/competitions/competitions.service"

export const COMPETITIONS_QUERY_KEY = "competitions"

export const useCompetitionsByClubId = (clubId?: string) => {
	const competitionsQuery = useQuery({
		queryKey: [COMPETITIONS_QUERY_KEY, "club", clubId],
		queryFn: () => getCompetitionsByClubId(clubId!),
		enabled: !!clubId,
	})
	return { competitionsQuery }
}

export const useCompetitionById = (id: string | null) => {
	const competitionByIdQuery = useQuery({
		queryKey: [COMPETITIONS_QUERY_KEY, id],
		queryFn: () => getCompetitionById(id!),
		enabled: !!id,
	})
	return { competitionByIdQuery }
}
