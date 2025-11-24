import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import type {
	CompetitionTeamsInsert,
	CompetitionTeamsUpdate,
} from "@/models/dbTypes"
import {
	createCompetitionTeam,
	deleteCompetitionTeam,
	updateCompetitionTeam,
} from "@/services/databaseService/competitions/competition_teams.service"
import { COMPETITION_TEAMS_QUERY_KEY } from "./useCompetitionTeamsQuery"

export const useCompetitionTeamsMutation = () => {
	const queryClient = useQueryClient()

	const invalidateCompetitionTeamsQueries = () => {
		queryClient.invalidateQueries({
			queryKey: [COMPETITION_TEAMS_QUERY_KEY],
		})
	}

	const createCompetitionTeamMutation = useMutation({
		mutationFn: (teamData: CompetitionTeamsInsert) =>
			createCompetitionTeam(teamData),
		onSuccess: () => {
			invalidateCompetitionTeamsQueries()
			toast.success("Equipo de competición creado correctamente.")
		},
		onError: (error) => {
			console.error("Error creating competition team:", error)
			toast.error("Error al crear el equipo de competición.")
		},
	})

	const updateCompetitionTeamMutation = useMutation({
		mutationFn: ({
			id,
			teamData,
		}: {
			id: string
			teamData: CompetitionTeamsUpdate
		}) => updateCompetitionTeam(id, teamData),
		onSuccess: (_, { id }) => {
			invalidateCompetitionTeamsQueries()
			queryClient.invalidateQueries({
				queryKey: [COMPETITION_TEAMS_QUERY_KEY, id],
			})
			toast.success("Equipo de competición actualizado correctamente.")
		},
		onError: (error) => {
			console.error("Error updating competition team:", error)
			toast.error("Error al actualizar el equipo de competición.")
		},
	})

	const deleteCompetitionTeamMutation = useMutation({
		mutationFn: (id: string) => deleteCompetitionTeam(id),
		onSuccess: () => {
			invalidateCompetitionTeamsQueries()
			toast.success("Equipo de competición eliminado correctamente.")
		},
		onError: (error) => {
			console.error("Error deleting competition team:", error)
			toast.error("Error al eliminar el equipo de competición.")
		},
	})

	return {
		createCompetitionTeam: createCompetitionTeamMutation,
		updateCompetitionTeam: updateCompetitionTeamMutation,
		deleteCompetitionTeam: deleteCompetitionTeamMutation,
	}
}
