import { Navigate, Outlet } from "react-router"
import { useAuthStore } from "@/auth/stores/auth.store"
import { Loading } from "@/components/Loading"
import type { Role } from "@/models/roles.model"
import { ROUTES } from "@/ROUTES"

interface PrivateRouteProps {
	roles: Role[]
	redirectTo?: string
}

export function PrivateRoute({ roles, redirectTo }: PrivateRouteProps) {
	const user = useAuthStore((s) => s.user)
	const loading = useAuthStore((s) => s.loading)

	if (loading) return <Loading />

	// No autenticado -> al login
	if (!user) return <Navigate to={ROUTES.LOGIN} replace />

	// Si no tiene rol (no debería pasar) -> al unauthorized
	if (!user.userRole) return <Navigate to={ROUTES.UNAUTHORIZED} replace />

	// Autenticado pero sin rol permitido -> al home
	if (roles && !roles.includes(user.userRole as Role)) {
		return <Navigate to={redirectTo || ROUTES.HOME} replace />
	}

	return <Outlet />
}
