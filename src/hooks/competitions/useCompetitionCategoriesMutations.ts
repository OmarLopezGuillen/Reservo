import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import type {
	CompetitionCategoriesInsert,
	CompetitionCategoriesUpdate,
} from "@/models/dbTypes"
import {
	createCompetitionCategory,
	deleteCompetitionCategory,
	updateCompetitionCategory,
} from "@/services/databaseService/competitions/competition_categories.service"
import { COMPETITION_CATEGORIES_QUERY_KEY } from "./useCompetitionCategoriesQuery"

export const useCompetitionCategoriesMutation = () => {
	const queryClient = useQueryClient()

	const invalidateCompetitionCategoriesQueries = () => {
		queryClient.invalidateQueries({
			queryKey: [COMPETITION_CATEGORIES_QUERY_KEY],
		})
	}

	const createCompetitionCategoryMutation = useMutation({
		mutationFn: (categoryData: CompetitionCategoriesInsert) =>
			createCompetitionCategory(categoryData),
		onSuccess: () => {
			invalidateCompetitionCategoriesQueries()
			toast.success("Categoría de competición creada correctamente.")
		},
		onError: (error) => {
			console.error("Error creating competition category:", error)
			toast.error("Error al crear la categoría de competición.")
		},
	})

	const updateCompetitionCategoryMutation = useMutation({
		mutationFn: ({
			id,
			categoryData,
		}: {
			id: string
			categoryData: CompetitionCategoriesUpdate
		}) => updateCompetitionCategory(id, categoryData),
		onSuccess: (_, { id }) => {
			invalidateCompetitionCategoriesQueries()
			queryClient.invalidateQueries({
				queryKey: [COMPETITION_CATEGORIES_QUERY_KEY, id],
			})
			toast.success("Categoría de competición actualizada correctamente.")
		},
		onError: (error) => {
			console.error("Error updating competition category:", error)
			toast.error("Error al actualizar la categoría de competición.")
		},
	})

	const deleteCompetitionCategoryMutation = useMutation({
		mutationFn: (id: string) => deleteCompetitionCategory(id),
		onSuccess: () => {
			invalidateCompetitionCategoriesQueries()
			toast.success("Categoría de competición eliminada correctamente.")
		},
		onError: (error) => {
			console.error("Error deleting competition category:", error)
			toast.error("Error al eliminar la categoría de competición.")
		},
	})

	return {
		createCompetitionCategory: createCompetitionCategoryMutation,
		updateCompetitionCategory: updateCompetitionCategoryMutation,
		deleteCompetitionCategory: deleteCompetitionCategoryMutation,
	}
}
