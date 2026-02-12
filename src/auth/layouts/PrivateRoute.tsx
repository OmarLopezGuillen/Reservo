import { Navigate, Outlet, useLocation } from "react-router"
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
	const location = useLocation()

	if (loading) return <Loading />

	// No autenticado -> al login (guardando la ruta original)
	if (!user) {
		const intended = location.pathname + location.search
		return (
			<Navigate
				to={`${ROUTES.LOGIN}?redirect=${encodeURIComponent(intended)}`}
				replace
			/>
		)
	}

	// Si no tiene rol (no debería pasar) -> al unauthorized
	if (!user.userRole) return <Navigate to={ROUTES.UNAUTHORIZED} replace />

	// Autenticado pero sin rol permitido -> al home (o redirectTo)
	if (roles && !roles.includes(user.userRole as Role)) {
		return <Navigate to={redirectTo || ROUTES.HOME} replace />
	}

	return <Outlet />
}
