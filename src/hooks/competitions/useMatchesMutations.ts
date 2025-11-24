import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import type { MatchesInsert, MatchesUpdate } from "@/models/dbTypes"
import {
	createMatch,
	deleteMatch,
	updateMatch,
} from "@/services/databaseService/competitions/matches.service"
import { MATCHES_QUERY_KEY } from "./useMatchesQuery"

export const useMatchesMutation = () => {
	const queryClient = useQueryClient()

	const invalidateMatchesQueries = () => {
		queryClient.invalidateQueries({ queryKey: [MATCHES_QUERY_KEY] })
	}

	const createMatchMutation = useMutation({
		mutationFn: (matchData: MatchesInsert) => createMatch(matchData),
		onSuccess: () => {
			invalidateMatchesQueries()
			toast.success("Partido creado correctamente.")
		},
		onError: (error) => {
			console.error("Error creating match:", error)
			toast.error("Error al crear el partido.")
		},
	})

	const updateMatchMutation = useMutation({
		mutationFn: ({
			id,
			matchData,
		}: {
			id: string
			matchData: MatchesUpdate
		}) => updateMatch(id, matchData),
		onSuccess: (_, { id }) => {
			invalidateMatchesQueries()
			queryClient.invalidateQueries({ queryKey: [MATCHES_QUERY_KEY, id] })
			toast.success("Partido actualizado correctamente.")
		},
		onError: (error) => {
			console.error("Error updating match:", error)
			toast.error("Error al actualizar el partido.")
		},
	})

	const deleteMatchMutation = useMutation({
		mutationFn: (id: string) => deleteMatch(id),
		onSuccess: () => {
			invalidateMatchesQueries()
			toast.success("Partido eliminado correctamente.")
		},
		onError: (error) => {
			console.error("Error deleting match:", error)
			toast.error("Error al eliminar el partido.")
		},
	})

	return {
		createMatch: createMatchMutation,
		updateMatch: updateMatchMutation,
		deleteMatch: deleteMatchMutation,
	}
}
