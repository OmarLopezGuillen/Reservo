import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import type {
	CompetitionRulesInsert,
	CompetitionRulesUpdate,
} from "@/models/dbTypes"
import {
	createCompetitionRule,
	deleteCompetitionRule,
	updateCompetitionRule,
} from "@/services/databaseService/competitions/competition_rules.service"
import { COMPETITION_RULES_QUERY_KEY } from "./useCompetitionRulesQuery"

export const useCompetitionRulesMutation = () => {
	const queryClient = useQueryClient()

	const invalidateCompetitionRulesQueries = () => {
		queryClient.invalidateQueries({
			queryKey: [COMPETITION_RULES_QUERY_KEY],
		})
	}

	const createCompetitionRuleMutation = useMutation({
		mutationFn: (ruleData: CompetitionRulesInsert) =>
			createCompetitionRule(ruleData),
		onSuccess: () => {
			invalidateCompetitionRulesQueries()
			toast.success("Regla de competición creada correctamente.")
		},
		onError: (error) => {
			console.error("Error creating competition rule:", error)
			toast.error("Error al crear la regla de competición.")
		},
	})

	const updateCompetitionRuleMutation = useMutation({
		mutationFn: ({
			id,
			ruleData,
		}: {
			id: string
			ruleData: CompetitionRulesUpdate
		}) => updateCompetitionRule(id, ruleData),
		onSuccess: (_, { id }) => {
			invalidateCompetitionRulesQueries()
			queryClient.invalidateQueries({
				queryKey: [COMPETITION_RULES_QUERY_KEY, id],
			})
			toast.success("Regla de competición actualizada correctamente.")
		},
		onError: (error) => {
			console.error("Error updating competition rule:", error)
			toast.error("Error al actualizar la regla de competición.")
		},
	})

	const deleteCompetitionRuleMutation = useMutation({
		mutationFn: (id: string) => deleteCompetitionRule(id),
		onSuccess: () => {
			invalidateCompetitionRulesQueries()
			toast.success("Regla de competición eliminada correctamente.")
		},
		onError: (error) => {
			console.error("Error deleting competition rule:", error)
			toast.error("Error al eliminar la regla de competición.")
		},
	})

	return {
		createCompetitionRule: createCompetitionRuleMutation,
		updateCompetitionRule: updateCompetitionRuleMutation,
		deleteCompetitionRule: deleteCompetitionRuleMutation,
	}
}
