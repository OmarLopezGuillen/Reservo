import { useQuery } from "@tanstack/react-query"
import {
	getChatThreadByMatchId,
	getChatThreads,
} from "@/services/databaseService/competitions/chatThread.service"

export const CHAT_THREADS_QUERY_KEY = "chat_threads"

export const useChatThreadByMatchId = (matchId?: string) => {
	const threadByMatchQuery = useQuery({
		queryKey: [CHAT_THREADS_QUERY_KEY, "match", matchId],
		queryFn: () => getChatThreadByMatchId(matchId!),
		enabled: !!matchId,
	})

	return { threadByMatchQuery }
}

export function useChatThreads() {
	const chatThreadsQuery = useQuery({
		queryKey: [CHAT_THREADS_QUERY_KEY],
		queryFn: getChatThreads,
	})

	return { chatThreadsQuery }
}
