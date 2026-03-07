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
	type CreateTeamAdminResponse,
	createTeamByAdmin,
} from "@/services/databaseService/competitions/RPC/createTeamAdmin"

import { sendEmail } from "@/services/email/sendEmail.service"
import { invitationTeamTemplate } from "@/services/email/templates/invitationTeam.template"

import { COMPETITION_TEAM_INVITES_QUERY_KEY } from "./useCompetitionTeamInvitesQuery"
import { COMPETITION_TEAMS_QUERY_KEY } from "./useCompetitionTeamsQuery"

export const useCompetitionTeamsMutation = () => {
	const queryClient = useQueryClient()

	const invalidateCompetitionTeamsQueries = () => {
		queryClient.invalidateQueries({
			queryKey: [COMPETITION_TEAMS_QUERY_KEY],
		})
	}

	// ---------------------------------------------
	// NORMAL CREATE TEAM
	// ---------------------------------------------
	const createCompetitionTeamMutation = useMutation({
		mutationFn: (teamData: CompetitionTeamsInsert) =>
			createCompetitionTeam(teamData),

		onSuccess: () => {
			invalidateCompetitionTeamsQueries()
			toast.success("Equipo de competición creado correctamente.")
		},

		onError: () => {
			toast.error("Error al crear el equipo de competición.")
		},
	})
	const APP_URL = import.meta.env.VITE_APP_URL || "http://localhost:5173"

	const invitationUrl = `${APP_URL}/register?redirect=${encodeURIComponent(
		"/mis-ligas",
	)}`
	// ---------------------------------------------
	// CREATE TEAM BY ADMIN (CON EMAILS)
	// ---------------------------------------------
	const createTeamByAdminMutation = useMutation<
		CreateTeamAdminResponse,
		unknown,
		{
			teamData: CreateTeamAdminParams
			extraData: {
				teamName: string
				competitionName: string
				clubName: string
				inviterName: string
			}
		}
	>({
		mutationFn: ({ teamData }) => createTeamByAdmin(teamData),

		onSuccess: async (data, variables) => {
			invalidateCompetitionTeamsQueries()

			const { teamName, competitionName, clubName, inviterName } =
				variables.extraData

			for (const invite of data.invites) {
				try {
					const template = invitationTeamTemplate({
						inviterName,
						teamName,
						competitionName,
						clubName,
						invitationUrl,
						expiresAtText: "10/03/2026 23:59",
					})

					await sendEmail({
						to: invite.email,
						html: template.html,
						subject: template.subject,
						text: template.text,
					})
				} catch (e) {
					console.error("Error enviando invitación a:", invite.email, e)
				}
			}

			toast.success(
				data.invites.length > 0
					? `Equipo creado. Se enviaron ${data.invites.length} invitación(es).`
					: "Equipo creado correctamente.",
			)
		},

		onError: (error: any) => {
			toast.error(error?.message || "Error al crear el equipo.")
		},
	})

	// ---------------------------------------------
	// UPDATE TEAM
	// ---------------------------------------------
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
			toast.success("Equipo actualizado correctamente.")
		},

		onError: () => {
			toast.error("Error al actualizar el equipo.")
		},
	})

	// ---------------------------------------------
	// DELETE TEAM
	// ---------------------------------------------
	const deleteCompetitionTeamMutation = useMutation({
		mutationFn: (id: string) => deleteCompetitionTeam(id),

		onSuccess: () => {
			invalidateCompetitionTeamsQueries()
			toast.success("Equipo eliminado correctamente.")
		},

		onError: () => {
			toast.error("Error al eliminar el equipo.")
		},
	})

	// ---------------------------------------------
	// ACCEPT INVITE
	// ---------------------------------------------
	const acceptTeamInviteMutation = useMutation({
		mutationFn: (params: AcceptTeamInviteParams) => acceptTeamInvite(params),

		onSuccess: (data) => {
			queryClient.invalidateQueries({
				queryKey: [COMPETITION_TEAM_INVITES_QUERY_KEY],
			})
			invalidateCompetitionTeamsQueries()
			toast.success(data.message)
		},

		onError: (error: any) => {
			toast.error(error?.message || "Error al aceptar la invitación.")
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
