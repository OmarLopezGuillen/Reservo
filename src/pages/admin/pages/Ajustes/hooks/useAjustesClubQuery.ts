import { useQuery } from "@tanstack/react-query"

import { getClubsById } from "@/services/databaseService/clubs.service"

import { AJUSTES_CLUB_QUERY_KEY } from "./clubsQueryKey"

export const useAjustesClubQuery = (clubId?: string | null) => {
	const normalizedClubId = clubId ?? ""

	const clubQuery = useQuery({
		queryKey: [AJUSTES_CLUB_QUERY_KEY, normalizedClubId],
		queryFn: () => getClubsById(normalizedClubId),
		enabled: Boolean(normalizedClubId),
	})

	return { clubQuery }
}
