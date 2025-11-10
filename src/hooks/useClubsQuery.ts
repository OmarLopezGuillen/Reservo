import { useQuery } from "@tanstack/react-query"
import { getClubs } from "@/services/databaseService/clubs.service"

export const CLUBS_QUERY_KEY = "clubs"

export const useClubs = () => {
	return useQuery({
		queryKey: [CLUBS_QUERY_KEY],
		queryFn: getClubs,
	})
}
