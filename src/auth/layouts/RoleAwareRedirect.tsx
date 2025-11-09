// src/auth/components/RoleAwareRedirect.tsx

import { Navigate } from "react-router"
import { useAuthStore } from "@/auth/stores/auth.store"
import { ROUTES } from "@/ROUTES"

export function RoleAwareRedirect() {
	const { user } = useAuthStore.getState()

	if (!user) return <Navigate to={ROUTES.LOGIN} replace />

	if (!user.userRole) return <Navigate to={ROUTES.UNAUTHORIZED} replace />

	return <Navigate to={ROUTES.HOME} replace />
}
