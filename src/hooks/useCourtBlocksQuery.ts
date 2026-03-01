import { useQuery } from "@tanstack/react-query"
import { getCourtBlocksByCourtIds } from "@/services/databaseService/courtBlocks.service"

export const COURT_BLOCKS_QUERY_KEY = "court_blocks"

export const useCourtBlocksByCourtIds = (courtIds: string[]) => {
	const courtBlocksQuery = useQuery({
		queryKey: [COURT_BLOCKS_QUERY_KEY, [...courtIds].sort()],
		queryFn: () => getCourtBlocksByCourtIds(courtIds),
		enabled: courtIds.length > 0,
	})

	return { courtBlocksQuery }
}
