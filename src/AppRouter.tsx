import { lazy, Suspense } from "react"
import { BrowserRouter, Navigate, Route, Routes } from "react-router"
import { AuthInit } from "@/auth/components/AuthInit"
import { NoAuthRoute } from "@/auth/layouts/NoAuthRoute"
import { PrivateRoute } from "@/auth/layouts/PrivateRoute"
import Login from "@/auth/pages/Login"
import Register from "@/auth/pages/Register"
import { Loading } from "@/components/Loading"
import { ROLES } from "@/models/roles.model"
import Home from "@/pages/home/pages/Home"
import Landing from "@/pages/landing/pages/Landing"
import { ROUTES } from "@/ROUTES"

const Unauthorized = lazy(() => import("@/pages/Unauthorized"))
const NotFound = lazy(() => import("@/pages/NotFound"))
const Reservas = lazy(() => import("@/pages/reservas/pages/Reservas"))
const ReservasId = lazy(() => import("@/pages/reservas/pages/ReservasId"))

const Clubs = lazy(() => import("@/pages/clubs/pages/Clubs"))
const ClubsId = lazy(() => import("@/pages/clubs/pages/ClubsId"))

const CrearReserva = lazy(
	() => import("@/pages/crear-reserva/pages/CrearReserva/CrearReserva"),
)

const CrearReservaExito = lazy(
	() => import("@/pages/crear-reserva/pages/Exito/Exito"),
)

const AdminLayout = lazy(() => import("@/pages/admin/layout/AdminLayout"))

const Calendar = lazy(() => import("@/pages/admin/pages/Calendar/Calendar"))
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
				<Route path={ROUTES.HOME} element={<Home />} />
				<Route path={"/landing"} element={<Landing />} />
				<Route
					path={ROUTES.CLUBS.ROOT}
					element={
						<Suspense fallback={<Loading />}>
							<Clubs />
						</Suspense>
					}
				/>

				<Route
					path={ROUTES.CLUBS.ID(":clubId")}
					element={
						<Suspense fallback={<Loading />}>
							<ClubsId />
						</Suspense>
					}
				/>

				<Route element={<NoAuthRoute />}>
					<Route path={ROUTES.LOGIN} element={<Login />} />
					<Route path={ROUTES.REGISTER} element={<Register />} />
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

				{/* Admin */}
				<Route element={<PrivateRoute roles={[ROLES.ADMIN]} />}>
					<Route
						path={ROUTES.ADMIN.ROOT}
						element={
							<Suspense fallback={<Loading />}>
								<AdminLayout />
							</Suspense>
						}
					>
						{/* Redirección por defecto */}
						<Route
							index
							element={<Navigate to={ROUTES.ADMIN.CALENDAR} replace />}
						/>

						<Route path={ROUTES.ADMIN.CALENDAR} element={<Calendar />} />
						<Route path={ROUTES.ADMIN.AJUSTES} element={<AdminAjustes />} />
						<Route
							element={
								<PrivateRoute
									roles={[ROLES.OWNER]}
									redirectTo={ROUTES.ADMIN.ROOT}
								/>
							}
						>
							<Route
								path={ROUTES.ADMIN.ESTADISTICAS}
								element={<AdminEstadisticas />}
							/>
						</Route>
						<Route path={ROUTES.ADMIN.LIGA} element={<AdminLiga />} />
						<Route
							path={ROUTES.ADMIN.LISTA_ESPERA}
							element={<AdminListaEspera />}
						/>
						<Route path={ROUTES.ADMIN.RECURSOS} element={<AdminRecursos />} />
						<Route path={ROUTES.ADMIN.REPORTES} element={<AdminReportes />} />
					</Route>
				</Route>

				{/* Reservas */}
				<Route element={<PrivateRoute roles={[ROLES.USER, ROLES.ADMIN]} />}>
					<Route
						path={ROUTES.RESERVAS.ROOT}
						element={
							<Suspense fallback={<Loading />}>
								<Reservas />
							</Suspense>
						}
					/>

					<Route
						path={ROUTES.RESERVAS.ID(":reservaId")}
						element={
							<Suspense fallback={<Loading />}>
								<ReservasId />
							</Suspense>
						}
					/>

					{/* Crear Reserva */}
					<Route
						path={ROUTES.CREAR_RESERVA.ROOT}
						element={
							<Suspense fallback={<Loading />}>
								<CrearReserva />
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
