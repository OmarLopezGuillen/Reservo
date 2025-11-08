import { lazy, Suspense } from "react"
import { BrowserRouter, Route, Routes } from "react-router"
import Login from "./pages/auth/pages/Login"
import Register from "./pages/auth/pages/Register"
import { ROUTES } from "./ROUTES"

const Unauthorized = lazy(() => import("./pages/Unauthorized"))
const NotFound = lazy(() => import("./pages/NotFound"))
const Reserva = lazy(() => import("./pages/reserva/pages/Reserva"))

const CrearReserva = lazy(
	() => import("./pages/crear-reserva/layout/CrearReservaLayout"),
)
const CrearReservaDatos = lazy(
	() => import("./pages/crear-reserva/pages/Datos"),
)
const CrearReservaPago = lazy(() => import("./pages/crear-reserva/pages/Pago"))
const CrearReservaExito = lazy(
	() => import("./pages/crear-reserva/pages/Exito"),
)

const Admin = lazy(() => import("./pages/admin/layout/AdminLayout"))
const AdminAjustes = lazy(() => import("./pages/admin/pages/Ajustes"))
const AdminEstadisticas = lazy(() => import("./pages/admin/pages/Estadisticas"))
const AdminLiga = lazy(() => import("./pages/admin/pages/Liga"))
const AdminListaEspera = lazy(() => import("./pages/admin/pages/ListaEspera"))
const AdminRecursos = lazy(() => import("./pages/admin/pages/Recursos"))
const AdminReportes = lazy(() => import("./pages/admin/pages/Reportes"))

const LegalPrivacidad = lazy(() => import("./pages/legal/pages/Privacidad"))
const LegalTerminos = lazy(() => import("./pages/legal/pages/Terminos"))

const Loader = () => <div className="p-8 text-center">Cargando...</div>

export default function AppRouter() {
	return (
		<BrowserRouter>
			<Routes>
				{/* Rutas públicas */}
				<Route path={ROUTES.HOME} element={<Login />} />
				<Route path={ROUTES.LOGIN} element={<Login />} />
				<Route path={ROUTES.REGISTER} element={<Register />} />

				{/* Admin */}
				<Route
					path={ROUTES.ADMIN.ROOT}
					element={
						<Suspense fallback={<Loader />}>
							<Admin />
						</Suspense>
					}
				>
					<Route
						path={ROUTES.ADMIN.AJUSTES}
						element={
							<Suspense fallback={<Loader />}>
								<AdminAjustes />
							</Suspense>
						}
					/>
					<Route
						path={ROUTES.ADMIN.ESTADISTICAS}
						element={
							<Suspense fallback={<Loader />}>
								<AdminEstadisticas />
							</Suspense>
						}
					/>
					<Route
						path={ROUTES.ADMIN.LIGA}
						element={
							<Suspense fallback={<Loader />}>
								<AdminLiga />
							</Suspense>
						}
					/>
					<Route
						path={ROUTES.ADMIN.LISTA_ESPERA}
						element={
							<Suspense fallback={<Loader />}>
								<AdminListaEspera />
							</Suspense>
						}
					/>
					<Route
						path={ROUTES.ADMIN.RECURSOS}
						element={
							<Suspense fallback={<Loader />}>
								<AdminRecursos />
							</Suspense>
						}
					/>
					<Route
						path={ROUTES.ADMIN.REPORTES}
						element={
							<Suspense fallback={<Loader />}>
								<AdminReportes />
							</Suspense>
						}
					/>
				</Route>

				{/* Legales */}
				<Route
					path={ROUTES.LEGAL.PRIVACIDAD}
					element={
						<Suspense fallback={<Loader />}>
							<LegalPrivacidad />
						</Suspense>
					}
				/>
				<Route
					path={ROUTES.LEGAL.TERMINOS}
					element={
						<Suspense fallback={<Loader />}>
							<LegalTerminos />
						</Suspense>
					}
				/>

				{/* Reservas */}
				<Route
					path={ROUTES.RESERVA(":reservaId")}
					element={
						<Suspense fallback={<Loader />}>
							<Reserva />
						</Suspense>
					}
				/>

				<Route
					path={ROUTES.CREAR_RESERVA.ROOT}
					element={
						<Suspense fallback={<Loader />}>
							<CrearReserva />
						</Suspense>
					}
				>
					<Route
						path={ROUTES.CREAR_RESERVA.DATOS}
						element={
							<Suspense fallback={<Loader />}>
								<CrearReservaDatos />
							</Suspense>
						}
					/>
					<Route
						path={ROUTES.CREAR_RESERVA.PAGO}
						element={
							<Suspense fallback={<Loader />}>
								<CrearReservaPago />
							</Suspense>
						}
					/>
					<Route
						path={ROUTES.CREAR_RESERVA.EXITO}
						element={
							<Suspense fallback={<Loader />}>
								<CrearReservaExito />
							</Suspense>
						}
					/>
				</Route>

				{/* Errores */}
				<Route
					path={ROUTES.UNAUTHORIZED}
					element={
						<Suspense fallback={<Loader />}>
							<Unauthorized />
						</Suspense>
					}
				/>
				<Route
					path={ROUTES.NOT_FOUND}
					element={
						<Suspense fallback={<Loader />}>
							<NotFound />
						</Suspense>
					}
				/>
			</Routes>
		</BrowserRouter>
	)
}
