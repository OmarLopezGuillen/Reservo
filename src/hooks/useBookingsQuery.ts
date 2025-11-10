import { useQuery } from "@tanstack/react-query"
import {
	getBookingById,
	getBookings,
} from "@/services/databaseService/bookings.service"

export const BOOKINGS_QUERY_KEY = "bookings"

export const useBookings = (clubId: string) => {
	return useQuery({
		queryKey: [BOOKINGS_QUERY_KEY, clubId],
		queryFn: () => getBookings(clubId),
		enabled: !!clubId, // La consulta solo se ejecuta si clubId tiene un valor.
	})
}

//TODO: Traer los bookings de useBookings si estan en cache
export const useBookingById = (id: string | null) => {
	return useQuery({
		queryKey: [BOOKINGS_QUERY_KEY, id],
		queryFn: () => getBookingById(id!), // El '!' es seguro gracias a la opción 'enabled'.
		enabled: !!id, // La consulta solo se ejecuta si el id tiene un valor.
	})
}
