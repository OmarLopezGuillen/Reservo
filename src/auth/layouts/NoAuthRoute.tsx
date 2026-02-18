import { Navigate, Outlet } from "react-router"
import { useAuthStore } from "@/auth/stores/auth.store"
import { Loading } from "@/components/Loading"
import { ROUTES } from "@/constants/ROUTES"

export function NoAuthRoute() {
	const user = useAuthStore((s) => s.user)
	const loading = useAuthStore((s) => s.loading)

	if (loading) return <Loading />

	if (user) {
		// Si no tiene rol (no debería pasar) -> al unauthorized
		if (!user.userRole) return <Navigate to={ROUTES.UNAUTHORIZED} replace />

		// Autenticado -> al home
		return <Navigate to={ROUTES.HOME} replace />
	}

	return <Outlet />
}
