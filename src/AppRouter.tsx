import { lazy, Suspense } from "react"
import { BrowserRouter, Route, Routes } from "react-router"
import Login from "./pages/auth/pages/Login"
import Register from "./pages/auth/pages/Register"

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
				<Route path="/" element={<Login />} />
				<Route path="/login" element={<Login />} />
				<Route path="/register" element={<Register />} />

				{/* Admin */}
				<Route
					path="/admin"
					element={
						<Suspense fallback={<Loader />}>
							<Admin />
						</Suspense>
					}
				>
					<Route
						path="/admin/ajustes"
						element={
							<Suspense fallback={<Loader />}>
								<AdminAjustes />
							</Suspense>
						}
					/>
					<Route
						path="/admin/estadisticas"
						element={
							<Suspense fallback={<Loader />}>
								<AdminEstadisticas />
							</Suspense>
						}
					/>
					<Route
						path="/admin/liga"
						element={
							<Suspense fallback={<Loader />}>
								<AdminLiga />
							</Suspense>
						}
					/>
					<Route
						path="/admin/lista-espera"
						element={
							<Suspense fallback={<Loader />}>
								<AdminListaEspera />
							</Suspense>
						}
					/>
					<Route
						path="/admin/recursos"
						element={
							<Suspense fallback={<Loader />}>
								<AdminRecursos />
							</Suspense>
						}
					/>
					<Route
						path="/admin/reportes"
						element={
							<Suspense fallback={<Loader />}>
								<AdminReportes />
							</Suspense>
						}
					/>
				</Route>

				{/* Legales */}
				<Route
					path="/legal/privacidad"
					element={
						<Suspense fallback={<Loader />}>
							<LegalPrivacidad />
						</Suspense>
					}
				/>
				<Route
					path="/legal/terminos"
					element={
						<Suspense fallback={<Loader />}>
							<LegalTerminos />
						</Suspense>
					}
				/>

				{/* Reservas */}
				<Route
					path="/reserva/:reservaId"
					element={
						<Suspense fallback={<Loader />}>
							<Reserva />
						</Suspense>
					}
				/>

				<Route
					path="/crear-reserva"
					element={
						<Suspense fallback={<Loader />}>
							<CrearReserva />
						</Suspense>
					}
				>
					<Route
						path="/crear-reserva/datos"
						element={
							<Suspense fallback={<Loader />}>
								<CrearReservaDatos />
							</Suspense>
						}
					/>
					<Route
						path="/crear-reserva/pago"
						element={
							<Suspense fallback={<Loader />}>
								<CrearReservaPago />
							</Suspense>
						}
					/>
					<Route
						path="/crear-reserva/exito"
						element={
							<Suspense fallback={<Loader />}>
								<CrearReservaExito />
							</Suspense>
						}
					/>
				</Route>

				{/* Errores */}
				<Route
					path="/unauthorized"
					element={
						<Suspense fallback={<Loader />}>
							<Unauthorized />
						</Suspense>
					}
				/>
				<Route
					path="*"
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
