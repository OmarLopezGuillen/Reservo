import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import type { ClubsInsert, ClubsUpdate } from "@/models/dbTypes"
import {
	createClub,
	updateClub,
} from "@/services/databaseService/clubs.service"
import { CLUBS_QUERY_KEY } from "./useClubsQuery"

export const useClubsMutation = () => {
	const queryClient = useQueryClient()

	const invalidateClubsQueries = () => {
		queryClient.invalidateQueries({ queryKey: [CLUBS_QUERY_KEY] })
	}

	const createClubMutation = useMutation({
		mutationFn: (clubData: ClubsInsert) => createClub(clubData),
		onSuccess: () => {
			invalidateClubsQueries()
			toast.success("Club creado correctamente.")
		},
		onError: (error) => {
			console.error("Error creating club:", error)
			toast.error("Error al crear el club.")
		},
	})

	const updateClubMutation = useMutation({
		mutationFn: ({ id, clubData }: { id: string; clubData: ClubsUpdate }) =>
			updateClub(id, clubData),
		onSuccess: (_, { id }) => {
			// Invalida tanto la lista general como la consulta específica de este club.
			invalidateClubsQueries()
			queryClient.invalidateQueries({ queryKey: [CLUBS_QUERY_KEY, id] })
			toast.success("Club actualizado correctamente.")
		},
		onError: (error) => {
			console.error("Error updating club:", error)
			toast.error("Error al actualizar el club.")
		},
	})

	return {
		createClub: createClubMutation.mutate,
		updateClub: updateClubMutation.mutate,
	}
}
