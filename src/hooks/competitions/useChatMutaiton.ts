import { useMutation, useQueryClient } from "@tanstack/react-query"
import { sendChatMessage } from "@/services/databaseService/competitions/chat.service"
import { CHAT_MESSAGES_QUERY_KEY } from "./useChatQuery"

export function useSendChatMessage(threadId: string) {
	const queryClient = useQueryClient()

	const sendMessageMutation = useMutation({
		mutationFn: (body: string) => sendChatMessage(threadId, body),
		onSuccess: (newMsg) => {
			// añadimos el mensaje en cache para que sea instantáneo
			queryClient.setQueryData(
				[CHAT_MESSAGES_QUERY_KEY, threadId],
				(old: any) => {
					const prev = Array.isArray(old) ? old : []
					if (prev.some((m) => m.id === newMsg.id)) return prev
					return [...prev, newMsg]
				},
			)
		},
	})

	return { sendMessageMutation }
}
