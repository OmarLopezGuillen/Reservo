import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import type {
	TeamAvailabilitiesInsert,
	TeamAvailabilitiesUpdate,
} from "@/models/dbTypes"
import {
	createTeamAvailability,
	deleteTeamAvailability,
	updateTeamAvailability,
} from "@/services/databaseService/competitions/team_availabilities.service"
import { TEAM_AVAILABILITIES_QUERY_KEY } from "./useTeamAvailabilitiesQuery"

export const useTeamAvailabilitiesMutation = () => {
	const queryClient = useQueryClient()

	const invalidateTeamAvailabilitiesQueries = () => {
		queryClient.invalidateQueries({
			queryKey: [TEAM_AVAILABILITIES_QUERY_KEY],
		})
	}

	const createTeamAvailabilityMutation = useMutation({
		mutationFn: (availabilityData: TeamAvailabilitiesInsert) =>
			createTeamAvailability(availabilityData),
		onSuccess: () => {
			invalidateTeamAvailabilitiesQueries()
			toast.success("Disponibilidad de equipo creada correctamente.")
		},
		onError: (error) => {
			console.error("Error creating team availability:", error)
			toast.error("Error al crear la disponibilidad de equipo.")
		},
	})

	const updateTeamAvailabilityMutation = useMutation({
		mutationFn: ({
			id,
			availabilityData,
		}: {
			id: string
			availabilityData: TeamAvailabilitiesUpdate
		}) => updateTeamAvailability(id, availabilityData),
		onSuccess: (_, { id }) => {
			invalidateTeamAvailabilitiesQueries()
			queryClient.invalidateQueries({
				queryKey: [TEAM_AVAILABILITIES_QUERY_KEY, id],
			})
			toast.success("Disponibilidad de equipo actualizada correctamente.")
		},
		onError: (error) => {
			console.error("Error updating team availability:", error)
			toast.error("Error al actualizar la disponibilidad de equipo.")
		},
	})

	const deleteTeamAvailabilityMutation = useMutation({
		mutationFn: (id: string) => deleteTeamAvailability(id),
		onSuccess: () => {
			invalidateTeamAvailabilitiesQueries()
			toast.success("Disponibilidad de equipo eliminada correctamente.")
		},
		onError: (error) => {
			console.error("Error deleting team availability:", error)
			toast.error("Error al eliminar la disponibilidad de equipo.")
		},
	})

	return {
		createTeamAvailability: createTeamAvailabilityMutation,
		updateTeamAvailability: updateTeamAvailabilityMutation,
		deleteTeamAvailability: deleteTeamAvailabilityMutation,
	}
}
