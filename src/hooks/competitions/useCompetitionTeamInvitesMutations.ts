import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import type {
	CompetitionTeamInvitesInsert,
	CompetitionTeamInvitesUpdate,
} from "@/models/dbTypes"
import {
	createCompetitionTeamInvite,
	deleteCompetitionTeamInvite,
	updateCompetitionTeamInvite,
} from "@/services/databaseService/competitions/competition_team_invites.service"
import {
	type AcceptTeamInviteParams,
	acceptTeamInvite,
} from "@/services/databaseService/competitions/RPC/acceptTeamInvite"
import { COMPETITION_TEAM_INVITES_QUERY_KEY } from "./useCompetitionTeamInvitesQuery"

export const useCompetitionTeamInvitesMutation = () => {
	const queryClient = useQueryClient()

	const invalidateCompetitionTeamInvitesQueries = () => {
		queryClient.invalidateQueries({
			queryKey: [COMPETITION_TEAM_INVITES_QUERY_KEY],
		})
	}

	const createCompetitionTeamInviteMutation = useMutation({
		mutationFn: (inviteData: CompetitionTeamInvitesInsert) =>
			createCompetitionTeamInvite(inviteData),
		onSuccess: () => {
			invalidateCompetitionTeamInvitesQueries()
			toast.success("Invitación al equipo creada correctamente.")
		},
		onError: (error) => {
			console.error("Error creating competition team invite:", error)
			toast.error("Error al crear la invitación al equipo.")
		},
	})

	const updateCompetitionTeamInviteMutation = useMutation({
		mutationFn: ({
			id,
			inviteData,
		}: {
			id: string
			inviteData: CompetitionTeamInvitesUpdate
		}) => updateCompetitionTeamInvite(id, inviteData),
		onSuccess: (_, { id }) => {
			invalidateCompetitionTeamInvitesQueries()
			queryClient.invalidateQueries({
				queryKey: [COMPETITION_TEAM_INVITES_QUERY_KEY, id],
			})
			toast.success("Invitación al equipo actualizada correctamente.")
		},
		onError: (error) => {
			console.error("Error updating competition team invite:", error)
			toast.error("Error al actualizar la invitación al equipo.")
		},
	})

	const deleteCompetitionTeamInviteMutation = useMutation({
		mutationFn: (id: string) => deleteCompetitionTeamInvite(id),
		onSuccess: () => {
			invalidateCompetitionTeamInvitesQueries()
			toast.success("Invitación al equipo eliminada correctamente.")
		},
		onError: (error) => {
			console.error("Error deleting competition team invite:", error)
			toast.error("Error al eliminar la invitación al equipo.")
		},
	})

	const acceptTeamInviteMutation = useMutation({
		mutationFn: (params: AcceptTeamInviteParams) => acceptTeamInvite(params),
		onSuccess: (data) => {
			invalidateCompetitionTeamInvitesQueries()
			toast.success(data.message)
		},
		onError: (error) => {
			console.error("Error accepting team invite:", error)
			toast.error(error.message || "Error al aceptar la invitación al equipo.")
		},
	})

	return {
		createCompetitionTeamInvite: createCompetitionTeamInviteMutation,
		updateCompetitionTeamInvite: updateCompetitionTeamInviteMutation,
		deleteCompetitionTeamInvite: deleteCompetitionTeamInviteMutation,
		acceptTeamInvite: acceptTeamInviteMutation,
	}
}
