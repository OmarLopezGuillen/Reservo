import { useQuery } from "@tanstack/react-query"
import {
	getClubs,
	getClubsById,
} from "@/services/databaseService/clubs.service"

export const CLUBS_QUERY_KEY = "clubs"

export const useClubs = () => {
	const clubsQuery = useQuery({
		queryKey: [CLUBS_QUERY_KEY],
		queryFn: getClubs,
	})
	return { clubsQuery }
}

export const useClubsById = (clubId: string) => {
	const clubsByIdQuery = useQuery({
		queryKey: [CLUBS_QUERY_KEY, clubId],
		queryFn: () => getClubsById(clubId),
		enabled: !!clubId,
	})
	return { clubsByIdQuery }
}
