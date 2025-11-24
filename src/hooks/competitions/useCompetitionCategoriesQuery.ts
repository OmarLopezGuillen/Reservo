import { useQuery } from "@tanstack/react-query"
import {
	getCompetitionCategoriesByCompetitionId,
	getCompetitionCategoryById,
} from "@/services/databaseService/competitions/competition_categories.service"

export const COMPETITION_CATEGORIES_QUERY_KEY = "competition_categories"

export const useCompetitionCategoriesByCompetitionId = (
	competitionId?: string,
) => {
	const competitionCategoriesQuery = useQuery({
		queryKey: [
			COMPETITION_CATEGORIES_QUERY_KEY,
			"competition",
			competitionId,
		],
		queryFn: () => getCompetitionCategoriesByCompetitionId(competitionId!),
		enabled: !!competitionId,
	})
	return { competitionCategoriesQuery }
}

export const useCompetitionCategoryById = (id: string | null) => {
	const competitionCategoryByIdQuery = useQuery({
		queryKey: [COMPETITION_CATEGORIES_QUERY_KEY, id],
		queryFn: () => getCompetitionCategoryById(id!),
		enabled: !!id,
	})
	return { competitionCategoryByIdQuery }
}
