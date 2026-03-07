import { useQuery } from "@tanstack/react-query"
import { useAuthStore } from "@/auth/stores/auth.store"
import { supabase } from "@/lib/supabase"

export const getNotificationsQueryKey = (userId: string | null) => [
	"notifications",
	userId,
]

export function useNotifications() {
	const userId = useAuthStore((state) => state.user?.id ?? null)

	return useQuery({
		queryKey: getNotificationsQueryKey(userId),
		enabled: !!userId,
		queryFn: async () => {
			if (!userId) return []

			const { data, error } = await supabase
				.from("notifications")
				.select("*")
				.eq("user_id", userId)
				.order("created_at", { ascending: false })
				.limit(20)

			if (error) throw error
			return data ?? []
		},
		initialData: [],
	})
}
