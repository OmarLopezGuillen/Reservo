import { type JwtPayload, jwtDecode } from "jwt-decode"
import { useEffect } from "react"
import { useNavigate } from "react-router"
import { useAuthStore } from "@/auth/stores/auth.store"
import { ROUTES } from "@/ROUTES"
import { onAuthStateChange } from "@/services/auth/onAuthStateChange.service"

interface MyJwtPayload extends JwtPayload {
	user_role: string
}

export function useAuth() {
	const setAuth = useAuthStore((s) => s.setAuth)

	const navigate = useNavigate()

	useEffect(() => {
		const subscription = onAuthStateChange((_event, session) => {
			let userRole: string | null = null
			if (session) {
				const jwt = jwtDecode(session.access_token) as MyJwtPayload
				userRole = jwt.user_role
				if (!userRole) {
					navigate(ROUTES.UNAUTHORIZED, { replace: true })
					setAuth(null, null) // mantiene el comportamiento de "borrar sesión"
					return
				}
			}
			setAuth(session, userRole)
		})

		return () => {
			subscription.unsubscribe()
		}
	}, [setAuth, navigate])
}
