import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import type {
	CompetitionParticipantsInsert,
	CompetitionParticipantsUpdate,
} from "@/models/dbTypes"
import {
	createCompetitionParticipant,
	deleteCompetitionParticipant,
	updateCompetitionParticipant,
} from "@/services/databaseService/competitions/competition_participants.service"
import { COMPETITION_PARTICIPANTS_QUERY_KEY } from "./useCompetitionParticipantsQuery"

export const useCompetitionParticipantsMutation = () => {
	const queryClient = useQueryClient()

	const invalidateCompetitionParticipantsQueries = () => {
		queryClient.invalidateQueries({
			queryKey: [COMPETITION_PARTICIPANTS_QUERY_KEY],
		})
	}

	const createCompetitionParticipantMutation = useMutation({
		mutationFn: (participantData: CompetitionParticipantsInsert) =>
			createCompetitionParticipant(participantData),
		onSuccess: () => {
			invalidateCompetitionParticipantsQueries()
			toast.success("Participante de competición creado correctamente.")
		},
		onError: (error) => {
			console.error("Error creating competition participant:", error)
			toast.error("Error al crear el participante de competición.")
		},
	})

	const updateCompetitionParticipantMutation = useMutation({
		mutationFn: ({
			id,
			participantData,
		}: {
			id: string
			participantData: CompetitionParticipantsUpdate
		}) => updateCompetitionParticipant(id, participantData),
		onSuccess: (_, { id }) => {
			invalidateCompetitionParticipantsQueries()
			queryClient.invalidateQueries({
				queryKey: [COMPETITION_PARTICIPANTS_QUERY_KEY, id],
			})
			toast.success("Participante de competición actualizado correctamente.")
		},
		onError: (error) => {
			console.error("Error updating competition participant:", error)
			toast.error("Error al actualizar el participante de competición.")
		},
	})

	const deleteCompetitionParticipantMutation = useMutation({
		mutationFn: (id: string) => deleteCompetitionParticipant(id),
		onSuccess: () => {
			invalidateCompetitionParticipantsQueries()
			toast.success("Participante de competición eliminado correctamente.")
		},
		onError: (error) => {
			console.error("Error deleting competition participant:", error)
			toast.error("Error al eliminar el participante de competición.")
		},
	})

	return {
		createCompetitionParticipant: createCompetitionParticipantMutation,
		updateCompetitionParticipant: updateCompetitionParticipantMutation,
		deleteCompetitionParticipant: deleteCompetitionParticipantMutation,
	}
}
