import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import type { ClubsUpdate } from "@/models/dbTypes"
import { updateClub as updateClubService } from "@/services/databaseService/clubs.service"

import { AJUSTES_CLUB_QUERY_KEY } from "./clubsQueryKey"

export const useAjustesClubMutation = () => {
	const queryClient = useQueryClient()

	const updateClubMutation = useMutation({
		mutationFn: ({ id, clubData }: { id: string; clubData: ClubsUpdate }) =>
			updateClubService(id, clubData),
		onSuccess: (_, { id }) => {
			queryClient.invalidateQueries({ queryKey: [AJUSTES_CLUB_QUERY_KEY] })
			queryClient.invalidateQueries({ queryKey: [AJUSTES_CLUB_QUERY_KEY, id] })
			toast.success("Club actualizado correctamente.")
		},
		onError: (error) => {
			console.error("Error updating club:", error)
			toast.error("Error al actualizar el club.")
		},
	})

	return {
		updateClub: updateClubMutation,
	}
}
