import { useAuthStore } from "@/auth/stores/auth.store"

export function useAuthUser() {
	const { user } = useAuthStore()
	if (!user) throw new Error("called without an authenticated user")
	return user
}
