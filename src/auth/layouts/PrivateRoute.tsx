import { Navigate, Outlet } from "react-router"
import { useAuthStore } from "@/auth/stores/auth.store"
import { Loading } from "@/components/Loading"
import { ROUTES } from "@/ROUTES"

//TODO. A: Crear los roles
type ROLE = "admin" | "user"

interface PrivateRouteProps {
	roles?: ROLE[]
}

export function PrivateRoute({ roles }: PrivateRouteProps) {
	const user = useAuthStore((s) => s.user)
	const loading = useAuthStore((s) => s.loading)

	if (loading) return <Loading />

	// No autenticado -> al login
	if (!user) return <Navigate to={ROUTES.LOGIN} replace />

	if (!user.userRole) return <Navigate to={ROUTES.UNAUTHORIZED} replace />

	// Autenticado pero sin rol permitido -> los mando a su "home" por rol
	if (roles && !roles.includes(user.userRole as ROLE)) {
		const fallback = ROUTES.HOME
		return <Navigate to={fallback} replace />
	}

	return <Outlet />
}
