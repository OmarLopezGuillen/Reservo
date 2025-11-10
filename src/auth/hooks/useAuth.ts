import { type JwtPayload, jwtDecode } from "jwt-decode"
import { useEffect } from "react"
import { useAuthStore } from "@/auth/stores/auth.store"
import { ROLES, type Role } from "@/models/roles.model"
import { onAuthStateChange } from "@/services/auth/onAuthStateChange.service"

interface MyJwtPayload extends JwtPayload {
	user_role: Role
}

export function useAuth() {
	const setAuth = useAuthStore((s) => s.setAuth)

	useEffect(() => {
		const subscription = onAuthStateChange((event, session) => {
			if (event === "SIGNED_OUT") {
				setAuth(null, null)
				return
			}

			if (session) {
				const jwt = jwtDecode(session.access_token) as MyJwtPayload
				const userRole = jwt.user_role ?? ROLES.USER // Se le asigna el rol más bajo si no hay rol
				setAuth(session, userRole)
				return
			}
			setAuth(null, null)
		})

		return () => {
			subscription.unsubscribe()
		}
	}, [])
}
