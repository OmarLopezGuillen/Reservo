import { type JwtPayload, jwtDecode } from "jwt-decode"
import { useEffect } from "react"
import { useAuthStore } from "@/auth/stores/auth.store"
import { onAuthStateChange } from "@/services/auth/onAuthStateChange.service"

interface MyJwtPayload extends JwtPayload {
	user_role: string
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
				//TODO. A: Ajustar roles
				const userRole = jwt.user_role ?? "user" // Se le asigna el rol más bajo si no hay rol
				setAuth(session, userRole)
			}
		})

		return () => {
			subscription.unsubscribe()
		}
	}, [])
}
