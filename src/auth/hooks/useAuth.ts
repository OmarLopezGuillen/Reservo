import { type JwtPayload, jwtDecode } from "jwt-decode"
import { useEffect } from "react"
import { useAuthStore } from "@/auth/stores/auth.store"
import { ROLES, type Role } from "@/models/ROLES.model"
import { onAuthStateChange } from "@/services/auth/onAuthStateChange.service"

interface MyJwtPayload extends JwtPayload {
	user_role: Role
	club_id?: string
}

export function useAuth() {
	const setAuth = useAuthStore((s) => s.setAuth)

	useEffect(() => {
		const subscription = onAuthStateChange((event, session) => {
			if (event === "SIGNED_OUT") {
				setAuth(null, null, null)
				return
			}

			if (session) {
				const jwt = jwtDecode(session.access_token) as MyJwtPayload
				const userRole = jwt.user_role ?? ROLES.USER // Se le asigna el rol más bajo si no hay rol
				const clubId = jwt.club_id ?? null

				setAuth(session, userRole, clubId)
				return
			}
			setAuth(null, null, null)
		})

		return () => {
			subscription.unsubscribe()
		}
	}, [])
}
