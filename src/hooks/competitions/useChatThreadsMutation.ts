import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { createMatchChatThread } from "@/services/databaseService/competitions/RPC/createMatchChatThread"
import { CHAT_THREADS_QUERY_KEY } from "./useChatThreadsQuery"

export const useCreateMatchChatThreadMutation = () => {
	const queryClient = useQueryClient()

	const createThreadMutation = useMutation({
		mutationFn: (matchId: string) => createMatchChatThread({ matchId }),
		onSuccess: (_, matchId) => {
			// refrescar el "existe / no existe" para ese match
			queryClient.invalidateQueries({
				queryKey: [CHAT_THREADS_QUERY_KEY, "match", matchId],
			})
		},
		onError: (error) => {
			console.error(error)
			toast.error("No se pudo crear el chat.")
		},
	})

	return { createThreadMutation }
}
