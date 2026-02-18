import { Check, Loader2, ShieldAlert, X } from "lucide-react"
import { useEffect, useState } from "react"
import { Link, useLocation, useNavigate } from "react-router"
import { toast } from "sonner"
import { useAuthUser } from "@/auth/hooks/useAuthUser"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ROUTES } from "@/constants/ROUTES"
import { useCompetitionById } from "@/hooks/competitions/useCompetitionsQuery"
import { useCompetitionTeamInvitesMutation } from "@/hooks/competitions/useCompetitionTeamInvitesMutations"
import { useCompetitionTeamInvitesByToken } from "@/hooks/competitions/useCompetitionTeamInvitesQuery"
import { useCompetitionTeamById } from "@/hooks/competitions/useCompetitionTeamsQuery"

//TODO: PONER GONFETI AL ACEPTAR INVITACION

const InvitePage = () => {
	const location = useLocation()
	const navigate = useNavigate()
	const user = useAuthUser()
	const token = new URLSearchParams(location.search).get("token")
	const [isAccepted, setIsAccepted] = useState(false)

	// 1️⃣ Validar token
	useEffect(() => {
		if (!token) {
			toast.error("No se proporcionó un token de invitación.")
			navigate(ROUTES.HOME)
		}
	}, [token, navigate])

	// 2️⃣ Cargar invitación
	const { competitionTeamInvitesByTokenQuery } =
		useCompetitionTeamInvitesByToken(token || "")
	const {
		data: invite,
		isLoading: isLoadingInvite,
		error: inviteError,
	} = competitionTeamInvitesByTokenQuery

	// 3️⃣ Cargar equipo (solo si existe invite y pertenece al usuario autenticado)
	const teamId = invite?.teamId ?? null
	const { competitionTeamByIdQuery } = useCompetitionTeamById(teamId)
	const {
		data: team,
		isLoading: isLoadingTeam,
		error: teamError,
	} = competitionTeamByIdQuery

	// 4️⃣ Cargar competición (solo si existe team)
	const competitionId = team?.competitionId ?? null
	const { competitionByIdQuery } = useCompetitionById(competitionId)
	const {
		data: competition,
		isLoading: isLoadingCompetition,
		error: competitionError,
	} = competitionByIdQuery

	const { acceptTeamInvite, deleteCompetitionTeamInvite } =
		useCompetitionTeamInvitesMutation()

	// 5️⃣ Redirigir al login si no hay usuario
	useEffect(() => {
		if (!user && token) {
			const redirectUrl = encodeURIComponent(window.location.href)
			navigate(`${ROUTES.LOGIN}?redirect=${redirectUrl}`, { replace: true })
		}
	}, [user, token, navigate])

	// 6️⃣ Handlers
	const handleAccept = () => {
		if (!token) return
		acceptTeamInvite.mutate(
			{ token },
			{
				onSuccess: () => setIsAccepted(true),
			},
		)
	}

	const handleReject = () => {
		if (!invite) return
		deleteCompetitionTeamInvite.mutate(invite.id, {
			onSuccess: () => {
				toast.info("Has rechazado la invitación.")
				navigate(ROUTES.HOME)
			},
		})
	}

	// 7️⃣ Estado de carga
	if (
		isLoadingInvite ||
		(teamId && isLoadingTeam) ||
		(competitionId && isLoadingCompetition)
	) {
		return (
			<div className="flex items-center justify-center h-screen">
				<Loader2 className="h-12 w-12 animate-spin text-primary" />
			</div>
		)
	}

	// ✨ Pantalla de éxito después de aceptar
	if (isAccepted) {
		return (
			<div className="container mx-auto flex items-center justify-center h-screen">
				<Card className="w-full max-w-lg text-center">
					<CardHeader>
						<CardTitle>¡Te has unido al equipo!</CardTitle>
					</CardHeader>
					<CardContent className="space-y-6">
						<p className="text-muted-foreground">
							Te has registrado exitosamente en el equipo{" "}
							<strong className="text-primary">{team?.name || ""}</strong>.
						</p>
						<div className="flex justify-center gap-4 pt-4">
							<Button size="lg" asChild>
								<Link to={ROUTES.COMPETITIONS.ID(competition!.id)}>
									Ir a la competición
								</Link>
							</Button>
							<Button size="lg" variant="outline" asChild>
								<Link to={ROUTES.HOME}>Página principal</Link>
							</Button>
						</div>
					</CardContent>
				</Card>
			</div>
		)
	}

	// 8️⃣ Invitación no encontrada o inválida
	if (
		inviteError ||
		!invite ||
		invite.status !== "pending" ||
		!team ||
		!competition ||
		teamError ||
		competitionError
	) {
		return <InviteNotFound />
	}

	// 9️⃣ Invitación que NO pertenece al usuario autenticado
	if (user && invite.email.toLowerCase() !== user.email?.toLowerCase()) {
		// 👇 Aquí no mostramos info sensible (ni equipo ni competición)
		return <InviteNotFound />
	}

	// 🔟 Pantalla principal si todo OK
	return (
		<div className="container mx-auto flex items-center justify-center h-screen">
			<Card className="w-full max-w-lg">
				<CardHeader className="text-center">
					<CardTitle>¡Has sido invitado!</CardTitle>
				</CardHeader>
				<CardContent className="space-y-6">
					<div className="text-center text-muted-foreground">
						<p>
							Has recibido una invitación para unirte al equipo{" "}
							<strong className="text-primary">{team.name}</strong>
						</p>
						<p>
							para la competición{" "}
							<strong className="text-primary">{competition.name}</strong>.
						</p>
					</div>
					<div className="flex justify-center gap-4 pt-4">
						<Button
							size="lg"
							variant="outline"
							onClick={handleReject}
							disabled={deleteCompetitionTeamInvite.isPending}
						>
							<X className="mr-2 h-5 w-5" /> Rechazar
						</Button>
						<Button
							size="lg"
							onClick={handleAccept}
							disabled={acceptTeamInvite.isPending}
						>
							{acceptTeamInvite.isPending ? (
								<Loader2 className="mr-2 h-5 w-5 animate-spin" />
							) : (
								<Check className="mr-2 h-5 w-5" />
							)}
							Aceptar Invitación
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}

// 🧩 Componente reutilizable para invitación no válida / no encontrada
const InviteNotFound = () => (
	<div className="container mx-auto flex items-center justify-center h-screen">
		<Card className="w-full max-w-md text-center">
			<CardHeader>
				<CardTitle className="text-destructive">
					<ShieldAlert className="mx-auto h-12 w-12 mb-4" />
					Invitación no encontrada
				</CardTitle>
			</CardHeader>
			<CardContent>
				<p className="text-muted-foreground mb-6">
					El enlace de invitación no es válido, ha expirado o ya ha sido
					utilizado. Si crees que es un error, contacta con el organizador o el
					capitán del equipo.
				</p>
				<Button asChild>
					<Link to={ROUTES.HOME}>Volver al inicio</Link>
				</Button>
			</CardContent>
		</Card>
	</div>
)

export default InvitePage
