import { useQueryClient } from "@tanstack/react-query"
import { useEffect } from "react"
import { useAuthStore } from "@/auth/stores/auth.store"
import { getNotificationsQueryKey } from "@/components/Notifications/hook/useNotifications"
import { supabase } from "@/lib/supabase"

export function NotificationsRealtimeProvider({
	children,
}: {
	children: React.ReactNode
}) {
	const queryClient = useQueryClient()
	const userId = useAuthStore((state) => state.user?.id ?? null)

	useEffect(() => {
		if (!userId) {
			void queryClient.removeQueries({
				queryKey: ["notifications"],
			})
			return
		}

		const invalidateNotifications = () => {
			void queryClient.invalidateQueries({
				queryKey: getNotificationsQueryKey(userId),
				exact: true,
			})
		}

		const channel = supabase
			.channel(`notifications:${userId}`)
			.on(
				"postgres_changes",
				{
					event: "*",
					schema: "public",
					table: "notifications",
					filter: `user_id=eq.${userId}`,
				},
				invalidateNotifications,
			)
			.subscribe()

		return () => {
			void supabase.removeChannel(channel)
		}
	}, [queryClient, userId])

	return <>{children}</>
}
