import { useQuery } from "@tanstack/react-query"
import {
	getChatMessages,
	getChatThreadById,
} from "@/services/databaseService/competitions/chat.service"

export const CHAT_QUERY_KEY = "chat"
export const CHAT_MESSAGES_QUERY_KEY = "chat_messages"

export function useChatThread(threadId?: string) {
	const threadQuery = useQuery({
		queryKey: [CHAT_QUERY_KEY, threadId],
		queryFn: () => getChatThreadById(threadId!),
		enabled: !!threadId,
	})

	return { threadQuery }
}

export function useChatMessages(threadId?: string) {
	const messagesQuery = useQuery({
		queryKey: [CHAT_MESSAGES_QUERY_KEY, threadId],
		queryFn: () => getChatMessages(threadId!),
		enabled: !!threadId,
	})

	return { messagesQuery }
}
