import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import type {
	CompetitionRuleTemplatesInsert,
	CompetitionRuleTemplatesUpdate,
} from "@/models/dbTypes"
import {
	createCompetitionRuleTemplate,
	deleteCompetitionRuleTemplate,
	updateCompetitionRuleTemplate,
} from "@/services/databaseService/competitions/competition_rule_templates.service"
import { COMPETITION_RULE_TEMPLATES_QUERY_KEY } from "./useCompetitionRuleTemplatesQuery"

export const useCompetitionRuleTemplatesMutation = () => {
	const queryClient = useQueryClient()

	const invalidateCompetitionRuleTemplatesQueries = () => {
		queryClient.invalidateQueries({
			queryKey: [COMPETITION_RULE_TEMPLATES_QUERY_KEY],
		})
	}

	const createCompetitionRuleTemplateMutation = useMutation({
		mutationFn: (templateData: CompetitionRuleTemplatesInsert) =>
			createCompetitionRuleTemplate(templateData),
		onSuccess: () => {
			invalidateCompetitionRuleTemplatesQueries()
			toast.success("Plantilla de regla de competición creada correctamente.")
		},
		onError: (error) => {
			console.error("Error creating competition rule template:", error)
			toast.error("Error al crear la plantilla de regla de competición.")
		},
	})

	const updateCompetitionRuleTemplateMutation = useMutation({
		mutationFn: ({
			id,
			templateData,
		}: {
			id: string
			templateData: CompetitionRuleTemplatesUpdate
		}) => updateCompetitionRuleTemplate(id, templateData),
		onSuccess: (_, { id }) => {
			invalidateCompetitionRuleTemplatesQueries()
			queryClient.invalidateQueries({
				queryKey: [COMPETITION_RULE_TEMPLATES_QUERY_KEY, id],
			})
			toast.success(
				"Plantilla de regla de competición actualizada correctamente.",
			)
		},
		onError: (error) => {
			console.error("Error updating competition rule template:", error)
			toast.error("Error al actualizar la plantilla de regla de competición.")
		},
	})

	const deleteCompetitionRuleTemplateMutation = useMutation({
		mutationFn: (id: string) => deleteCompetitionRuleTemplate(id),
		onSuccess: () => {
			invalidateCompetitionRuleTemplatesQueries()
			toast.success(
				"Plantilla de regla de competición eliminada correctamente.",
			)
		},
		onError: (error) => {
			console.error("Error deleting competition rule template:", error)
			toast.error("Error al eliminar la plantilla de regla de competición.")
		},
	})

	return {
		createCompetitionRuleTemplate: createCompetitionRuleTemplateMutation,
		updateCompetitionRuleTemplate: updateCompetitionRuleTemplateMutation,
		deleteCompetitionRuleTemplate: deleteCompetitionRuleTemplateMutation,
	}
}
