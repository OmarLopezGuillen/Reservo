import { Suspense } from "react"
import { NavLink, Outlet } from "react-router"
import { Loading } from "@/components/Loading"
import { ROUTES } from "@/ROUTES"

const AdminLayout = () => {
	return (
		<div>
			<NavLink to={ROUTES.ADMIN.AJUSTES}> Ajustes </NavLink>
			<NavLink to={ROUTES.ADMIN.LIGA}> Liga </NavLink>
			<NavLink to={ROUTES.ADMIN.ESTADISTICAS}> Estadisticas </NavLink>

			<Suspense fallback={<Loading />}>
				<Outlet />
			</Suspense>
		</div>
	)
}
export default AdminLayout
