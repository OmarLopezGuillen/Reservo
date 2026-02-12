import {
	Calendar,
	CheckCircle2,
	ChevronLeft,
	Loader2,
	Send,
	Trophy,
	Users,
} from "lucide-react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useNavigate, useSearchParams } from "react-router"
import { toast } from "sonner"
import { useAuthUser } from "@/auth/hooks/useAuthUser"
import { AvailabilityManager } from "@/components/AvailabilityManager"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { useCompetitionCategoriesByCompetitionId } from "@/hooks/competitions/useCompetitionCategoriesQuery"
import { useCompetitionById } from "@/hooks/competitions/useCompetitionsQuery"
import { useCompetitionTeamsMutation } from "@/hooks/competitions/useCompetitionTeamsMutations"
import { useTeamAvailabilitiesMutation } from "@/hooks/competitions/useTeamAvailabilitiesMutations"
import type { TeamAvailability } from "@/models/competition.model"
import { ROUTES } from "@/ROUTES"

type FormValues = {
	teamName: string
	categoryId: string
	emailPlayer2: string
	emailSubstitute?: string
}

const CompetitionRegister = () => {
	const [searchParams] = useSearchParams()
	const competitionId = searchParams.get("id")
	const navigate = useNavigate()
	const user = useAuthUser()

	const userEmail = user?.email

	const {
		data: competition,
		isLoading: isLoadingCompetition,
		isError,
	} = useCompetitionById(competitionId).competitionByIdQuery

	const { data: categories = [], isLoading: isLoadingCategories } =
		useCompetitionCategoriesByCompetitionId(
			competitionId!,
		).competitionCategoriesQuery

	const { createTeamByAdmin } = useCompetitionTeamsMutation()
	const { createTeamAvailability } = useTeamAvailabilitiesMutation()

	const [submitted, setSubmitted] = useState(false)
	const [availabilities, setAvailabilities] = useState<TeamAvailability[]>([])

	const {
		register,
		handleSubmit,
		setValue,
		watch,
		formState: { errors, isSubmitting },
	} = useForm<FormValues>()

	// Set player1 email automáticamente
	useEffect(() => {
		if (!userEmail) {
			toast.error("No se pudo detectar tu email. Vuelve a iniciar sesión.")
		}
	}, [userEmail])

	const isLoading = isLoadingCompetition || isLoadingCategories

	const onSubmit = async (values: FormValues) => {
		if (!userEmail) return

		const p1 = userEmail.toLowerCase()
		const p2 = values.emailPlayer2.toLowerCase()
		const sub = values.emailSubstitute?.trim().toLowerCase()

		if (p1 === p2) {
			toast.error("El email del Jugador 2 no puede ser igual al tuyo.")
			return
		}

		if (sub && (sub === p1 || sub === p2)) {
			toast.error("El email del sustituto no puede coincidir con otro jugador.")
			return
		}

		createTeamByAdmin.mutate(
			{
				competitionId: competitionId!,
				categoryId: values.categoryId,
				teamName: values.teamName,
				emailPlayer1: userEmail,
				emailPlayer2: values.emailPlayer2,
				emailSubstitute: sub || null,
			},
			{
				onSuccess: (data) => {
					setSubmitted(true)

					if (availabilities.length > 0 && data.team_id) {
						for (const avail of availabilities) {
							createTeamAvailability.mutate({
								team_id: data.team_id,
								weekday: avail.weekday,
								start_time: avail.startTime,
								end_time: avail.endTime,
							})
						}
					} else {
						toast.success("Equipo creado correctamente.")
					}
				},
			},
		)
	}

	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<Loader2 className="h-8 w-8 animate-spin" />
			</div>
		)
	}

	if (isError || !competition) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<Card>
					<CardContent className="pt-6">Competición no encontrada</CardContent>
				</Card>
			</div>
		)
	}

	if (submitted) {
		return (
			<div className="min-h-screen flex items-center justify-center p-4">
				<Card className="max-w-md w-full text-center">
					<CardContent className="pt-6 space-y-4">
						<CheckCircle2 className="h-16 w-16 text-green-500 mx-auto" />
						<h2 className="text-2xl font-bold">Equipo inscrito</h2>
						<Button
							onClick={() => navigate(ROUTES.COMPETITIONS.ID(competitionId!))}
							className="w-full"
						>
							Ver competición
						</Button>
					</CardContent>
				</Card>
			</div>
		)
	}

	return (
		<div className="min-h-screen bg-muted/30 py-8 px-4">
			<div className="max-w-xl mx-auto">
				<Button
					variant="ghost"
					onClick={() => navigate(ROUTES.COMPETITIONS.ID(competitionId!))}
				>
					<ChevronLeft className="h-4 w-4 mr-2" /> Volver a la competición
				</Button>
				<Card className="mb-6">
					<CardHeader className="text-center">
						<div className="flex justify-center mb-4">
							<div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
								<Trophy className="h-8 w-8 text-primary" />
							</div>
						</div>
						<CardTitle className="text-2xl">{competition.name}</CardTitle>
						<CardDescription>
							{competition.description || "Inscríbete en esta competición"}
						</CardDescription>
						<div className="flex justify-center gap-2 mt-4">
							<Badge variant="outline" className="capitalize">
								{competition.type}
							</Badge>
							{competition.startDate && (
								<Badge variant="secondary">
									<Calendar className="h-3 w-3 mr-1" />
									Inicio:{" "}
									{new Date(competition.startDate).toLocaleDateString("es-ES")}
								</Badge>
							)}
						</div>
					</CardHeader>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle>Inscribir equipo</CardTitle>
						<CardDescription>Completa los datos del equipo</CardDescription>
					</CardHeader>

					<CardContent>
						<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
							{/* Team name */}
							<div>
								<Label>Nombre del equipo *</Label>
								<Input {...register("teamName", { required: true })} />
							</div>

							{/* Category */}
							<div>
								<Label>Categoría *</Label>
								<Select onValueChange={(v) => setValue("categoryId", v)}>
									<SelectTrigger>
										<SelectValue placeholder="Selecciona categoría" />
									</SelectTrigger>
									<SelectContent>
										{categories.map((cat) => (
											<SelectItem key={cat.id} value={cat.id}>
												{cat.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>

							{/* Player 1 */}
							<div>
								<Label>Jugador 1</Label>
								<Input value={userEmail} disabled />
								<p className="text-xs text-muted-foreground">
									Se usa el email de tu cuenta
								</p>
							</div>

							{/* Player 2 */}
							<div>
								<Label>Email Jugador 2 *</Label>
								<Input
									type="email"
									{...register("emailPlayer2", { required: true })}
								/>
							</div>

							{/* Substitute */}
							<div>
								<Label>Email Sustituto (opcional)</Label>
								<Input type="email" {...register("emailSubstitute")} />
								<p className="text-xs text-muted-foreground">
									No es obligatorio, pero recomendable para más disponibilidad
									horaria.
								</p>
							</div>

							<AvailabilityManager
								availabilities={availabilities}
								setAvailabilities={setAvailabilities}
							/>

							<Alert>
								<Send className="h-4 w-4" />
								<AlertDescription>
									Si algún jugador no está registrado, recibirá una invitación
									por email.
								</AlertDescription>
							</Alert>

							<Button type="submit" className="w-full" disabled={isSubmitting}>
								{isSubmitting ? "Inscribiendo..." : "Inscribir equipo"}
							</Button>
						</form>
					</CardContent>
				</Card>
			</div>
		</div>
	)
}

export default CompetitionRegister
