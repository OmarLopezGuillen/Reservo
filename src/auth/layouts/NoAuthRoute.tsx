import { Navigate, Outlet } from "react-router"
import { useAuthStore } from "@/auth/stores/auth.store"
import { Loading } from "@/components/Loading"
import { ROUTES } from "@/ROUTES"

export function NoAuthRoute() {
	const user = useAuthStore((s) => s.user)
	const loading = useAuthStore((s) => s.loading)

	if (loading) return <Loading />

	if (user) {
		if (!user.userRole) return <Navigate to={ROUTES.UNAUTHORIZED} replace />
		return <Navigate to={ROUTES.HOME} replace />
	}

	return <Outlet />
}
