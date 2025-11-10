import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import type { CourtsInsert, CourtsUpdate } from "@/models/dbTypes"
import {
	createCourt,
	deleteCourt,
	updateCourt,
} from "@/services/databaseService/courts.service"
import { COURTS_QUERY_KEY } from "./useCourtsQuery"

export const useCourtsMutation = () => {
	const queryClient = useQueryClient()

	const invalidateCourtsQueries = () => {
		queryClient.invalidateQueries({ queryKey: [COURTS_QUERY_KEY] })
	}

	const createCourtMutation = useMutation({
		mutationFn: (courtData: CourtsInsert) => createCourt(courtData),
		onSuccess: () => {
			invalidateCourtsQueries()
			toast.success("Cancha creada correctamente.")
		},
		onError: (error) => {
			console.error("Error creating court:", error)
			toast.error("Error al crear la cancha.")
		},
	})

	const updateCourtMutation = useMutation({
		mutationFn: ({ id, courtData }: { id: string; courtData: CourtsUpdate }) =>
			updateCourt(id, courtData),
		onSuccess: (_, { id }) => {
			// Invalida tanto la lista general como la consulta específica de esta cancha.
			invalidateCourtsQueries()
			queryClient.invalidateQueries({ queryKey: [COURTS_QUERY_KEY, id] })
			toast.success("Cancha actualizada correctamente.")
		},
		onError: (error) => {
			console.error("Error updating court:", error)
			toast.error("Error al actualizar la cancha.")
		},
	})

	const deleteCourtMutation = useMutation({
		mutationFn: (id: string) => deleteCourt(id),
		onSuccess: () => {
			invalidateCourtsQueries()
			toast.success("Cancha eliminada correctamente.")
		},
		onError: (error) => {
			console.error("Error deleting court:", error)
			toast.error("Error al eliminar la cancha.")
		},
	})

	return {
		createCourt: createCourtMutation,
		updateCourt: updateCourtMutation,
		deleteCourt: deleteCourtMutation,
	}
}
