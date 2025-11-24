import { useQuery } from "@tanstack/react-query"
import {
	getMatchById,
	getMatchesByCategoryId,
	getMatchesByCompetitionId,
} from "@/services/databaseService/competitions/matches.service"

export const MATCHES_QUERY_KEY = "matches"

export const useMatchesByCompetitionId = (competitionId?: string) => {
	const matchesQuery = useQuery({
		queryKey: [MATCHES_QUERY_KEY, "competition", competitionId],
		queryFn: () => getMatchesByCompetitionId(competitionId!),
		enabled: !!competitionId,
	})
	return { matchesQuery }
}

export const useMatchesByCategoryId = (categoryId?: string) => {
	const matchesQuery = useQuery({
		queryKey: [MATCHES_QUERY_KEY, "category", categoryId],
		queryFn: () => getMatchesByCategoryId(categoryId!),
		enabled: !!categoryId,
	})
	return { matchesQuery }
}

export const useMatchById = (id: string | null) => {
	const matchByIdQuery = useQuery({
		queryKey: [MATCHES_QUERY_KEY, id],
		queryFn: () => getMatchById(id!),
		enabled: !!id,
	})
	return { matchByIdQuery }
}
