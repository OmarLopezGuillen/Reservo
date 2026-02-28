import { lazy, Suspense } from "react"
import { BrowserRouter, Navigate, Route, Routes } from "react-router"
import { AuthInit } from "@/auth/components/AuthInit"
import { NoAuthRoute } from "@/auth/layouts/NoAuthRoute"
import { PrivateRoute } from "@/auth/layouts/PrivateRoute"
import Login from "@/auth/pages/Login"
import Register from "@/auth/pages/Register"
import { Loading } from "@/components/Loading"
import { ROUTES } from "@/constants/ROUTES"
import { ROLES } from "@/models/ROLES.model"
import ForgotPassword from "@/auth/pages/ForgotPassword"
import ResetPassword from "@/auth/pages/ResetPassword"
import Home from "./pages/home/Home"

const Unauthorized = lazy(() => import("@/pages/Unauthorized"))
const NotFound = lazy(() => import("@/pages/NotFound"))
const Reservas = lazy(() => import("@/pages/reservas/pages/Reservas/Reservas"))
const ReservasId = lazy(
	() => import("@/pages/reservas/pages/ReservaId/ReservasId"),
)

const Clubs = lazy(() => import("@/pages/clubs/pages/Clubs/Clubs"))
const ClubsId = lazy(() => import("@/pages/clubs/pages/ClubId/ClubsId"))

const CrearReserva = lazy(
	() => import("@/pages/crear-reserva/pages/CrearReserva/CrearReserva"),
)

const CrearReservaExito = lazy(
	() => import("@/pages/crear-reserva/pages/Exito/Exito"),
)

const AdminLayout = lazy(() => import("@/pages/admin/layout/AdminLayout"))

const Calendar = lazy(() => import("@/pages/admin/pages/Calendar/Calendar"))
const AdminAjustes = lazy(() => import("@/pages/admin/pages/Ajustes/Ajustes"))
const AdminCompeticiones = lazy(
	() => import("@/pages/admin/pages/Competiciones/Competiciones"),
)
const AdminCompeticionesId = lazy(
	() =>
		import(
			"@/pages/admin/pages/Competiciones/pages/CompetitionId/CompetitionId"
		),
)
const AdminChats = lazy(() => import("@/pages/admin/pages/chats/Chats"))
const CrearCompeticion = lazy(
	() =>
		import(
			"@/pages/admin/pages/Competiciones/pages/crear-competicion/CrearCompeticion"
		),
)
const CompetitionRegister = lazy(
	() => import("@/pages/CompetitionRegister/CompetitionRegister"),
)
const Competitions = lazy(() => import("@/pages/competitions/Competitions"))
const CompetitionId = lazy(
	() => import("@/pages/competitions/competitionsId/CompetitionId"),
)

const LegalPrivacidad = lazy(() => import("@/pages/legal/pages/Privacidad"))
const LegalTerminos = lazy(() => import("@/pages/legal/pages/Terminos"))
const InvitePage = lazy(() => import("@/pages/invite/invite"))

//const Chats = lazy(() => import(""))
const ChatsId = lazy(() => import("@/pages/chats/chatId/ChatId.tsx"))
const MisChats = lazy(() => import("@/pages/chats/Chat.tsx"))
const MisLigas = lazy(() => import("@/pages/mis-ligas/MisLigas"))

export default function AppRouter() {
	return (
		<BrowserRouter>
			<AuthInit />
			<Routes>
				{/* Rutas públicas */}
				<Route path={ROUTES.HOME} element={<Home />} />
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
					<Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPassword />} />
					<Route path={ROUTES.RESET_PASSWORD} element={<ResetPassword />} />
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
				<Route element={<PrivateRoute roles={[ROLES.ADMIN, ROLES.OWNER]} />}>
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

						{/* SOLO ACCEDE A ESTADISTICAS EL OWNER */}
						{/* <Route
							element={
								<PrivateRoute
									roles={[ROLES.OWNER]}
									redirectTo={ROUTES.ADMIN.ROOT}
								/>
							}
						></Route> */}
						<Route path={ROUTES.ADMIN.CHAT} element={<AdminChats />} />
						<Route
							path={ROUTES.ADMIN.COMPETICIONES}
							element={<AdminCompeticiones />}
						/>
						<Route
							path={ROUTES.ADMIN.ID(":competicionId")}
							element={<AdminCompeticionesId />}
						/>
						<Route
							path={ROUTES.ADMIN.CREAR_COMPETICION}
							element={<CrearCompeticion />}
						/>
					</Route>
				</Route>

				{/* Reservas */}
				<Route
					element={
						<PrivateRoute roles={[ROLES.USER, ROLES.ADMIN, ROLES.OWNER]} />
					}
				>
					<Route
						path={ROUTES.MIS_LIGAS}
						element={
							<Suspense fallback={<Loading />}>
								<MisLigas />
							</Suspense>
						}
					/>

					<Route
						path={ROUTES.CHATS.ROOT}
						element={
							<Suspense fallback={<Loading />}>
								<MisChats />
							</Suspense>
						}
					/>

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
					<Route
						path={ROUTES.COMPETITIONS.REGISTER}
						element={
							<Suspense fallback={<Loading />}>
								<CompetitionRegister />
							</Suspense>
						}
					/>
					<Route
						path={ROUTES.COMPETITIONS.ROOT}
						element={
							<Suspense fallback={<Loading />}>
								<Competitions />
							</Suspense>
						}
					/>
					<Route
						path={ROUTES.COMPETITIONS.ID(":competicionId")}
						element={
							<Suspense fallback={<Loading />}>
								<CompetitionId />
							</Suspense>
						}
					/>
					<Route
						path={ROUTES.INVITE}
						element={
							<Suspense fallback={<Loading />}>
								<InvitePage />
							</Suspense>
						}
					/>
					{/* Chats 	<Route
						path={ROUTES.CHATS.ROOT}
						element={
							<Suspense fallback={<Loading />}>
								<Chats />
							</Suspense>
						}
					/>*/}
					<Route
						path={ROUTES.CHATS.ID(":chatId")}
						element={
							<Suspense fallback={<Loading />}>
								<ChatsId />
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
