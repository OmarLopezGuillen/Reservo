import { useQuery } from "@tanstack/react-query"
import { getClubHours } from "@/services/databaseService/clubHours.service"

export const CLUB_HOURS_QUERY_KEY = "club_hours"

export const useClubHours = (clubId?: string) => {
	const clubHoursQuery = useQuery({
		queryKey: [CLUB_HOURS_QUERY_KEY, clubId],
		queryFn: () => getClubHours(clubId!),
		enabled: !!clubId, // La consulta solo se ejecuta si clubId tiene un valor.
	})

	return { clubHoursQuery }
}
