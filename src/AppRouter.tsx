import { lazy, Suspense } from "react"
import { BrowserRouter, Route, Routes } from "react-router"
import { AuthInit } from "@/auth/components/AuthInit"
import { PrivateRoute } from "@/auth/layouts/PrivateRoute"
import Login from "@/auth/pages/Login"
import Register from "@/auth/pages/Register"
import { Loading } from "@/components/Loading"
import { ROUTES } from "@/ROUTES"

const Unauthorized = lazy(() => import("@/pages/Unauthorized"))
const NotFound = lazy(() => import("@/pages/NotFound"))
const Reserva = lazy(() => import("@/pages/reserva/pages/Reserva"))

const CrearReserva = lazy(
	() => import("@/pages/crear-reserva/layout/CrearReservaLayout"),
)
const CrearReservaDatos = lazy(
	() => import("@/pages/crear-reserva/pages/Datos"),
)
const CrearReservaPago = lazy(() => import("@/pages/crear-reserva/pages/Pago"))
const CrearReservaExito = lazy(
	() => import("@/pages/crear-reserva/pages/Exito"),
)

const AdminAjustes = lazy(() => import("@/pages/admin/pages/Ajustes"))
const AdminEstadisticas = lazy(() => import("@/pages/admin/pages/Estadisticas"))
const AdminLiga = lazy(() => import("@/pages/admin/pages/Liga"))
const AdminListaEspera = lazy(() => import("@/pages/admin/pages/ListaEspera"))
const AdminRecursos = lazy(() => import("@/pages/admin/pages/Recursos"))
const AdminReportes = lazy(() => import("@/pages/admin/pages/Reportes"))

const LegalPrivacidad = lazy(() => import("@/pages/legal/pages/Privacidad"))
const LegalTerminos = lazy(() => import("@/pages/legal/pages/Terminos"))

export default function AppRouter() {
	return (
		<BrowserRouter>
			<AuthInit />
			<Routes>
				{/* Rutas públicas */}
				<Route path={ROUTES.HOME} element={<Login />} />
				<Route path={ROUTES.LOGIN} element={<Login />} />
				<Route path={ROUTES.REGISTER} element={<Register />} />

				{/* Admin */}
				<Route
					path={ROUTES.ADMIN.ROOT}
					element={<PrivateRoute roles={["admin"]} />}
				>
					<Route
						path={ROUTES.ADMIN.AJUSTES}
						element={
							<Suspense fallback={<Loading />}>
								<AdminAjustes />
							</Suspense>
						}
					/>
					<Route
						path={ROUTES.ADMIN.ESTADISTICAS}
						element={
							<Suspense fallback={<Loading />}>
								<AdminEstadisticas />
							</Suspense>
						}
					/>
					<Route
						path={ROUTES.ADMIN.LIGA}
						element={
							<Suspense fallback={<Loading />}>
								<AdminLiga />
							</Suspense>
						}
					/>
					<Route
						path={ROUTES.ADMIN.LISTA_ESPERA}
						element={
							<Suspense fallback={<Loading />}>
								<AdminListaEspera />
							</Suspense>
						}
					/>
					<Route
						path={ROUTES.ADMIN.RECURSOS}
						element={
							<Suspense fallback={<Loading />}>
								<AdminRecursos />
							</Suspense>
						}
					/>
					<Route
						path={ROUTES.ADMIN.REPORTES}
						element={
							<Suspense fallback={<Loading />}>
								<AdminReportes />
							</Suspense>
						}
					/>
				</Route>

				{/* Legales */}
				<Route
					path={ROUTES.LEGAL.PRIVACIDAD}
					element={
						<Suspense fallback={<Loading />}>
							<LegalPrivacidad />
						</Suspense>
					}
				/>
				<Route
					path={ROUTES.LEGAL.TERMINOS}
					element={
						<Suspense fallback={<Loading />}>
							<LegalTerminos />
						</Suspense>
					}
				/>

				{/* Reservas */}
				<Route
					path={ROUTES.RESERVA(":reservaId")}
					element={
						<Suspense fallback={<Loading />}>
							<Reserva />
						</Suspense>
					}
				/>

				<Route
					path={ROUTES.CREAR_RESERVA.ROOT}
					element={
						<Suspense fallback={<Loading />}>
							<CrearReserva />
						</Suspense>
					}
				>
					<Route
						path={ROUTES.CREAR_RESERVA.DATOS}
						element={
							<Suspense fallback={<Loading />}>
								<CrearReservaDatos />
							</Suspense>
						}
					/>
					<Route
						path={ROUTES.CREAR_RESERVA.PAGO}
						element={
							<Suspense fallback={<Loading />}>
								<CrearReservaPago />
							</Suspense>
						}
					/>
					<Route
						path={ROUTES.CREAR_RESERVA.EXITO}
						element={
							<Suspense fallback={<Loading />}>
								<CrearReservaExito />
							</Suspense>
						}
					/>
				</Route>

				{/* Errores */}
				<Route
					path={ROUTES.UNAUTHORIZED}
					element={
						<Suspense fallback={<Loading />}>
							<Unauthorized />
						</Suspense>
					}
				/>
				<Route
					path={ROUTES.NOT_FOUND}
					element={
						<Suspense fallback={<Loading />}>
							<NotFound />
						</Suspense>
					}
				/>
			</Routes>
		</BrowserRouter>
	)
}
