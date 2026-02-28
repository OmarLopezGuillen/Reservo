import { useQuery } from "@tanstack/react-query"
import { useAuthStore } from "@/auth/stores/auth.store"
import {
	getAllCompetitions,
	getCompetitionById,
	getCompetitionsByClubId,
	getCompetitionsByUserId,
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

export const useAllCompetitions = () => {
	const allCompetitionsQuery = useQuery({
		queryKey: [COMPETITIONS_QUERY_KEY, "all-with-club"],
		queryFn: () => getAllCompetitions(),
	})
	return { allCompetitionsQuery }
}

export const useMyCompetitions = () => {
	const userId = useAuthStore((state) => state.user?.id)

	const myCompetitionsQuery = useQuery({
		queryKey: [COMPETITIONS_QUERY_KEY, "my", userId],
		queryFn: () => getCompetitionsByUserId(userId!),
		enabled: !!userId,
	})

	return { myCompetitionsQuery }
}
