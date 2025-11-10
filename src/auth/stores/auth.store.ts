import type { Session, User } from "@supabase/supabase-js"
import { create } from "zustand"
import type { Role } from "@/models/roles.model"
import { signOut } from "@/services/auth/signOut.service"

interface UserAuth extends User {
	userRole: Role | null
}

interface AuthState {
	user: UserAuth | null
	session: Session | null
	loading: boolean
	setAuth: (session: Session | null, userRole: Role | null) => void
	signOut: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
	user: null,
	session: null,
	loading: true,
	setAuth: (session, userRole) => {
		if (!session || !userRole) {
			set({
				session: null,
				user: null,
				loading: false,
			})
			return
		}
		set({
			session,
			user: { ...session.user, userRole },
			loading: false,
		})
	},
	signOut: async () => {
		await signOut()
		set({ session: null, user: null, loading: false })
	},
}))
