import { useQuery } from "@tanstack/react-query"
import {
	getCourtById,
	getCourts,
} from "@/services/databaseService/courts.service"

export const COURTS_QUERY_KEY = "courts"

export const useCourts = (clubId: string) => {
	const courtsQuery = useQuery({
		queryKey: [COURTS_QUERY_KEY, clubId],
		queryFn: () => getCourts(clubId),
		enabled: !!clubId, // La consulta solo se ejecuta si clubId tiene un valor.
	})
	return { courtsQuery }
}
//TODO: Traer los courts de useCourts si estan en cache
export const useCourtById = (id: string | null) => {
	const courtByIdQuery = useQuery({
		queryKey: [COURTS_QUERY_KEY, id],
		queryFn: () => getCourtById(id!), // El '!' es seguro gracias a la opción 'enabled'.
		enabled: !!id, // La consulta solo se ejecuta si el id tiene un valor.
	})
	return { courtByIdQuery }
}
