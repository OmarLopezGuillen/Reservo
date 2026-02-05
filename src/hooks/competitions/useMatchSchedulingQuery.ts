import { useQuery } from "@tanstack/react-query"
import {
	getProposalsByThreadId,
	getRequiredVotersCount,
} from "@/services/databaseService/competitions/matchScheduling.service"

export const PROPOSALS_QUERY_KEY = "match_schedule_proposals"
export const REQUIRED_VOTERS_QUERY_KEY = "required_voters"

export function useRequiredVoters(threadId?: string) {
	const q = useQuery({
		queryKey: [REQUIRED_VOTERS_QUERY_KEY, threadId],
		queryFn: () => getRequiredVotersCount(threadId!),
		enabled: !!threadId,
	})
	return { requiredVotersQuery: q }
}

export function useProposals(threadId?: string) {
	const q = useQuery({
		queryKey: [PROPOSALS_QUERY_KEY, threadId],
		queryFn: () => getProposalsByThreadId(threadId!),
		enabled: !!threadId,
	})
	return { proposalsQuery: q }
}
