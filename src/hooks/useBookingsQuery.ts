import { useQuery } from "@tanstack/react-query"
import { useAuthUser } from "@/auth/hooks/useAuthUser"
import {
	getBookingById,
	getBookings,
	getBookingsCalendar,
	getMyBookingById,
	getMyBookings,
} from "@/services/databaseService/bookings.service"

export const BOOKINGS_QUERY_KEY = "bookings"

export const useBookings = (clubId?: string) => {
	const bookingsQuery = useQuery({
		queryKey: [BOOKINGS_QUERY_KEY, clubId],
		queryFn: () => getBookings(clubId!),
		enabled: !!clubId, // La consulta solo se ejecuta si clubId tiene un valor.
	})
	return { bookingsQuery }
}

export const useBookingsCalendar = (clubId?: string) => {
	const bookingCalendarQuery = useQuery({
		queryKey: [BOOKINGS_QUERY_KEY, "calendar", clubId],
		queryFn: () => getBookingsCalendar(clubId!),
		enabled: !!clubId, // La consulta solo se ejecuta si hay un usuario logueado.
	})
	return { bookingCalendarQuery }
}

//TODO: Traer los bookings de useBookings si estan en cache
export const useBookingById = (id: string | null) => {
	const bookingByIdQuery = useQuery({
		queryKey: [BOOKINGS_QUERY_KEY, id],
		queryFn: () => getBookingById(id!), // El '!' es seguro gracias a la opción 'enabled'.
		enabled: !!id, // La consulta solo se ejecuta si el id tiene un valor.
	})
	return { bookingByIdQuery }
}

/**
 * Hook para obtener todas las reservas del usuario actualmente autenticado.
 */
export const useMyBookings = () => {
	const user = useAuthUser()
	const myBookingsQuery = useQuery({
		queryKey: [BOOKINGS_QUERY_KEY, "me", user?.id],
		queryFn: () => getMyBookings(user!.id),
		enabled: !!user, // La consulta solo se ejecuta si hay un usuario logueado.
	})
	return { myBookingsQuery }
}

export const useMyBookingById = (id: string | null) => {
	const myBookingQuery = useQuery({
		queryKey: [BOOKINGS_QUERY_KEY, "me", id],
		queryFn: () => getMyBookingById(id!),
		enabled: !!id, // La consulta solo se ejecuta si hay un usuario logueado.
	})
	return { myBookingQuery }
}
