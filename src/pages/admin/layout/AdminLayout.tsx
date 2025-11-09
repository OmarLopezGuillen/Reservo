import { Suspense } from "react"
import { NavLink, Outlet, useLocation } from "react-router"
import { Loading } from "@/components/Loading"
import { ROUTES } from "@/ROUTES"

const AdminLayout = () => {
	const location = useLocation()
	return (
		<div>
			<NavLink to={ROUTES.ADMIN.AJUSTES}> Ajustes </NavLink>
			<NavLink to={ROUTES.ADMIN.LIGA}> Liga </NavLink>
			<NavLink to={ROUTES.ADMIN.ESTADISTICAS}> Estadisticas </NavLink>

			{/* Suspense que se reinicia cada vez que cambia la subruta */}
			<Suspense key={location.pathname} fallback={<Loading />}>
				<Outlet />
			</Suspense>
		</div>
	)
}
export default AdminLayout
