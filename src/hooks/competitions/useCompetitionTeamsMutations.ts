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
import {
	type AcceptTeamInviteParams,
	acceptTeamInvite,
} from "@/services/databaseService/competitions/RPC/acceptTeamInvite"
import {
	type CreateTeamAdminParams,
	createTeamByAdmin,
} from "@/services/databaseService/competitions/RPC/createTeamAdmin"
import { COMPETITION_TEAM_INVITES_QUERY_KEY } from "./useCompetitionTeamInvitesQuery"
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

	const createTeamByAdminMutation = useMutation({
		mutationFn: (teamData: CreateTeamAdminParams) =>
			createTeamByAdmin(teamData),
		onSuccess: (data) => {
			invalidateCompetitionTeamsQueries()
			let successMessage = "Equipo creado exitosamente."
			if (data.invites.length > 0) {
				successMessage = `Equipo creado. Se enviaron ${data.invites.length} invitación(es).`
			}
			toast.success(successMessage)
		},
		onError: (error) => {
			console.error("Error creating team by admin:", error)
			let errorMessage = "Error al crear el equipo y las invitaciones."
			// El objeto de error de Supabase tiene una propiedad 'message',
			// incluso si no es una instancia de 'Error'.
			if (error && typeof error === "object" && "message" in error) {
				errorMessage = String(error.message)
			}
			toast.error(errorMessage)
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

	const acceptTeamInviteMutation = useMutation({
		mutationFn: (params: AcceptTeamInviteParams) => acceptTeamInvite(params),
		onSuccess: (data) => {
			// Invalidar tanto las invitaciones como los equipos
			queryClient.invalidateQueries({
				queryKey: [COMPETITION_TEAM_INVITES_QUERY_KEY],
			})
			invalidateCompetitionTeamsQueries()
			toast.success(data.message)
		},
		onError: (error) => {
			console.error("Error accepting team invite:", error)
			toast.error(error.message || "Error al aceptar la invitación al equipo.")
		},
	})

	return {
		createCompetitionTeam: createCompetitionTeamMutation,
		createTeamByAdmin: createTeamByAdminMutation,
		updateCompetitionTeam: updateCompetitionTeamMutation,
		deleteCompetitionTeam: deleteCompetitionTeamMutation,
		acceptTeamInvite: acceptTeamInviteMutation,
	}
}
