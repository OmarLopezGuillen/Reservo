import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import type { BookingsInsert, BookingsUpdate } from "@/models/dbTypes"
import {
	createBooking,
	deleteBooking,
	updateBooking,
} from "@/services/databaseService/bookings.service"
import { BOOKINGS_QUERY_KEY } from "./useBookingsQuery"

export const useBookingsMutation = () => {
	const queryClient = useQueryClient()

	const invalidateBookingsQueries = () => {
		queryClient.invalidateQueries({ queryKey: [BOOKINGS_QUERY_KEY] })
	}

	const createBookingMutation = useMutation({
		mutationFn: (bookingData: BookingsInsert) => createBooking(bookingData),
		onSuccess: () => {
			invalidateBookingsQueries()
			toast.success("Reserva creada correctamente.")
		},
		onError: (error) => {
			console.error("Error creating booking:", error)
			toast.error("Error al crear la reserva.")
		},
	})

	const updateBookingMutation = useMutation({
		mutationFn: ({
			id,
			bookingData,
		}: {
			id: string
			bookingData: BookingsUpdate
		}) => updateBooking(id, bookingData),
		onSuccess: (_, { id }) => {
			// Invalida tanto la lista general como la consulta específica de esta reserva.
			invalidateBookingsQueries()
			queryClient.invalidateQueries({ queryKey: [BOOKINGS_QUERY_KEY, id] })
			toast.success("Reserva actualizada correctamente.")
		},
		onError: (error) => {
			console.error("Error updating booking:", error)
			toast.error("Error al actualizar la reserva.")
		},
	})

	const deleteBookingMutation = useMutation({
		mutationFn: (id: string) => deleteBooking(id),
		onSuccess: () => {
			invalidateBookingsQueries()
			toast.success("Reserva eliminada correctamente.")
		},
		onError: (error) => {
			console.error("Error deleting booking:", error)
			toast.error("Error al eliminar la reserva.")
		},
	})

	return {
		createBooking: createBookingMutation,
		updateBooking: updateBookingMutation,
		deleteBooking: deleteBookingMutation,
	}
}
