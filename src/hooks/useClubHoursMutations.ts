import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import type {
	ClubHoursInsert,
	ClubHoursUpdate,
	Position,
	WeekDay,
} from "@/models/dbTypes"
import {
	createClubHour,
	deleteClubHour,
	updateClubHour,
} from "@/services/databaseService/clubHours.service"
import { CLUB_HOURS_QUERY_KEY } from "./useClubHoursQuery"

export const useClubHoursMutation = () => {
	const queryClient = useQueryClient()

	const invalidateClubHoursQueries = () => {
		queryClient.invalidateQueries({ queryKey: [CLUB_HOURS_QUERY_KEY] })
	}

	const createClubHourMutation = useMutation({
		mutationFn: (data: ClubHoursInsert) => createClubHour(data),
		onSuccess: () => {
			invalidateClubHoursQueries()
			toast.success("Horario de club creado correctamente.")
		},
		onError: (error) => {
			console.error("Error creating club hour:", error)
			toast.error("Error al crear el horario del club.")
		},
	})

	const updateClubHourMutation = useMutation({
		mutationFn: ({
			clubId,
			weekday,
			position,
			data,
		}: {
			clubId: string
			weekday: WeekDay
			position: Position
			data: ClubHoursUpdate
		}) => updateClubHour(clubId, weekday, position, data),
		onSuccess: () => {
			invalidateClubHoursQueries()
			toast.success("Horario de club actualizado correctamente.")
		},
		onError: (error) => {
			console.error("Error updating club hour:", error)
			toast.error("Error al actualizar el horario del club.")
		},
	})

	const deleteClubHourMutation = useMutation({
		mutationFn: ({
			clubId,
			weekday,
			position,
		}: {
			clubId: string
			weekday: WeekDay
			position: Position
		}) => deleteClubHour(clubId, weekday, position),
		onSuccess: () => {
			invalidateClubHoursQueries()
			toast.success("Horario de club eliminado correctamente.")
		},
		onError: (error) => {
			console.error("Error deleting club hour:", error)
			toast.error("Error al eliminar el horario del club.")
		},
	})

	return {
		createClubHour: createClubHourMutation,
		updateClubHour: updateClubHourMutation,
		deleteClubHour: deleteClubHourMutation,
	}
}
