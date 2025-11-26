import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import type {
	CompetitionTeamMembersInsert,
	CompetitionTeamMembersUpdate,
} from "@/models/dbTypes"
import {
	createCompetitionTeamMember,
	deleteCompetitionTeamMember,
	updateCompetitionTeamMember,
} from "@/services/databaseService/competitions/competitions_team_members.service"
import { COMPETITION_TEAM_MEMBERS_QUERY_KEY } from "./useCompetitionTeamMembersQuery"

export const useCompetitionTeamMembersMutation = () => {
	const queryClient = useQueryClient()

	const invalidateCompetitionTeamMembersQueries = () => {
		queryClient.invalidateQueries({
			queryKey: [COMPETITION_TEAM_MEMBERS_QUERY_KEY],
		})
	}

	const createCompetitionTeamMemberMutation = useMutation({
		mutationFn: (memberData: CompetitionTeamMembersInsert) =>
			createCompetitionTeamMember(memberData),
		onSuccess: () => {
			invalidateCompetitionTeamMembersQueries()
			toast.success("Miembro añadido al equipo correctamente.")
		},
		onError: (error) => {
			console.error("Error creating competition team member:", error)
			toast.error("Error al añadir el miembro al equipo.")
		},
	})

	const updateCompetitionTeamMemberMutation = useMutation({
		mutationFn: ({
			id,
			memberData,
		}: {
			id: string
			memberData: CompetitionTeamMembersUpdate
		}) => updateCompetitionTeamMember(id, memberData),
		onSuccess: (_, { id }) => {
			invalidateCompetitionTeamMembersQueries()
			queryClient.invalidateQueries({
				queryKey: [COMPETITION_TEAM_MEMBERS_QUERY_KEY, id],
			})
			toast.success("Miembro del equipo actualizado correctamente.")
		},
		onError: (error) => {
			console.error("Error updating competition team member:", error)
			toast.error("Error al actualizar el miembro del equipo.")
		},
	})

	const deleteCompetitionTeamMemberMutation = useMutation({
		mutationFn: (id: string) => deleteCompetitionTeamMember(id),
		onSuccess: () => {
			invalidateCompetitionTeamMembersQueries()
			toast.success("Miembro del equipo eliminado correctamente.")
		},
		onError: (error) => {
			console.error("Error deleting competition team member:", error)
			toast.error("Error al eliminar el miembro del equipo.")
		},
	})

	return {
		createCompetitionTeamMember: createCompetitionTeamMemberMutation,
		updateCompetitionTeamMember: updateCompetitionTeamMemberMutation,
		deleteCompetitionTeamMember: deleteCompetitionTeamMemberMutation,
	}
}
