import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import type { CompetitionsInsert, CompetitionsUpdate } from "@/models/dbTypes"
import {
	createCompetition,
	deleteCompetition,
	updateCompetition,
} from "@/services/databaseService/competitions/competitions.service"
import { COMPETITIONS_QUERY_KEY } from "./useCompetitionsQuery"

export const useCompetitionsMutation = () => {
	const queryClient = useQueryClient()

	const invalidateCompetitionsQueries = () => {
		queryClient.invalidateQueries({ queryKey: [COMPETITIONS_QUERY_KEY] })
	}

	const createCompetitionMutation = useMutation({
		mutationFn: (competitionData: CompetitionsInsert) =>
			createCompetition(competitionData),
		onSuccess: () => {
			invalidateCompetitionsQueries()
			toast.success("Competición creada correctamente.")
		},
		onError: (error) => {
			console.error("Error creating competition:", error)
			toast.error("Error al crear la competición.")
		},
	})

	const updateCompetitionMutation = useMutation({
		mutationFn: ({
			id,
			competitionData,
		}: {
			id: string
			competitionData: CompetitionsUpdate
		}) => updateCompetition(id, competitionData),
		onSuccess: (_, { id }) => {
			invalidateCompetitionsQueries()
			queryClient.invalidateQueries({
				queryKey: [COMPETITIONS_QUERY_KEY, id],
			})
			toast.success("Competición actualizada correctamente.")
		},
		onError: (error) => {
			console.error("Error updating competition:", error)
			toast.error("Error al actualizar la competición.")
		},
	})

	const deleteCompetitionMutation = useMutation({
		mutationFn: (id: string) => deleteCompetition(id),
		onSuccess: () => {
			invalidateCompetitionsQueries()
			toast.success("Competición eliminada correctamente.")
		},
		onError: (error) => {
			console.error("Error deleting competition:", error)
			toast.error("Error al eliminar la competición.")
		},
	})

	return {
		createCompetition: createCompetitionMutation,
		updateCompetition: updateCompetitionMutation,
		deleteCompetition: deleteCompetitionMutation,
	}
}
