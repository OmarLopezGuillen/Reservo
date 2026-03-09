import {
	Calendar,
	CheckCircle2,
	ChevronLeft,
	Loader2,
	Send,
	Trophy,
} from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { useNavigate, useSearchParams } from "react-router"
import { toast } from "sonner"
import { useAuthUser } from "@/auth/hooks/useAuthUser"
import {
	AvailabilityManager,
	type TeamAvailabilityDraft,
} from "@/components/AvailabilityManager"
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
import { ROUTES } from "@/constants/ROUTES"
import { useCompetitionCategoriesByCompetitionId } from "@/hooks/competitions/useCompetitionCategoriesQuery"
import { useCompetitionById } from "@/hooks/competitions/useCompetitionsQuery"
import { useCompetitionTeamsMutation } from "@/hooks/competitions/useCompetitionTeamsMutations"
import { useTeamAvailabilitiesMutation } from "@/hooks/competitions/useTeamAvailabilitiesMutations"

type FormValues = {
	teamName: string
	categoryId: string
	emailPlayer2: string
	emailSubstitute?: string
}

const UUID_REGEX =
	/[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/i

const sanitizeCompetitionId = (rawId: string | null) => {
	if (!rawId) return null

	return rawId.match(UUID_REGEX)?.[0] ?? null
}

const timeToMinutes = (time: string) => {
	const [hours, minutes] = time.split(":").map(Number)
	return hours * 60 + minutes
}

const CompetitionRegister = () => {
	const [searchParams] = useSearchParams()
	const competitionId = sanitizeCompetitionId(searchParams.get("id"))
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
	const [availabilities, setAvailabilities] = useState<TeamAvailabilityDraft[]>([])

	const {
		register,
		handleSubmit,
		setValue,
		formState: { isSubmitting },
	} = useForm<FormValues>()

	// Set player1 email automáticamente
	useEffect(() => {
		if (!userEmail) {
			toast.error("No se pudo detectar tu email. Vuelve a iniciar sesión.")
		}
	}, [userEmail])

	useEffect(() => {
		if (searchParams.get("id") && !competitionId) {
			toast.error("El enlace de inscripción no es válido.")
		}
	}, [competitionId, searchParams])

	const isLoading = isLoadingCompetition || isLoadingCategories

	const availabilityValidation = useMemo(() => {
		const minDays = competition?.minAvailabilityDays ?? 0
		const minHoursPerDay = competition?.minAvailabilityHoursPerDay ?? 0
		const minMinutesPerDay = minHoursPerDay * 60

		const groupedByDay = new Map<string, { start: number; end: number }[]>()
		const invalidRanges = availabilities.some((availability) => {
			const start = timeToMinutes(availability.startTime)
			const end = timeToMinutes(availability.endTime)

			if (end <= start) return true

			const current = groupedByDay.get(availability.weekday) ?? []
			current.push({ start, end })
			groupedByDay.set(availability.weekday, current)
			return false
		})

		const validDays = Array.from(groupedByDay.values()).filter((ranges) => {
			const merged = [...ranges]
				.sort((a, b) => a.start - b.start)
				.reduce<{ start: number; end: number }[]>((acc, range) => {
					const last = acc[acc.length - 1]
					if (!last || range.start > last.end) {
						acc.push({ ...range })
						return acc
					}

					last.end = Math.max(last.end, range.end)
					return acc
				}, [])

			const totalMinutes = merged.reduce(
				(sum, range) => sum + (range.end - range.start),
				0,
			)

			return totalMinutes >= minMinutesPerDay
		}).length

		return {
			minDays,
			minHoursPerDay,
			validDays,
			invalidRanges,
			meetsRequirement: !invalidRanges && validDays >= minDays,
		}
	}, [availabilities, competition])

	const submitDisabled =
		isSubmitting ||
		createTeamByAdmin.isPending ||
		createTeamAvailability.isPending ||
		!availabilityValidation.meetsRequirement

	const onSubmit = async (values: FormValues) => {
		if (!userEmail) return
		if (!competition) return

		if (availabilityValidation.invalidRanges) {
			toast.error("Revisa los tramos de disponibilidad: la hora de fin debe ser posterior al inicio.")
			return
		}

		if (!availabilityValidation.meetsRequirement) {
			toast.error(
				`Debes indicar al menos ${availabilityValidation.minDays} dias con ${availabilityValidation.minHoursPerDay} horas de disponibilidad cada uno.`,
			)
			return
		}

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
				teamData: {
					competitionId: competitionId!,
					categoryId: values.categoryId,
					teamName: values.teamName,
					emailPlayer1: userEmail,
					emailPlayer2: values.emailPlayer2,
					emailSubstitute: sub || null,
				},
				extraData: {
					teamName: values.teamName,
					competitionName: competition.name,
					clubName: "Reservo",
					inviterName:
						user?.user_metadata?.full_name ?? user?.email ?? "Jugador",
				},
			},
			{
				onSuccess: (data) => {
					setSubmitted(true)

					if (availabilities.length > 0 && data.team_id) {
						for (const avail of availabilities) {
							createTeamAvailability.mutate({
								availabilityData: {
									team_id: data.team_id,
									weekday: avail.weekday,
									start_time: avail.startTime,
									end_time: avail.endTime,
								},
							})
						}
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

							<Alert
								variant={
									availabilityValidation.meetsRequirement
										? "default"
										: "destructive"
								}
							>
								<AlertDescription>
									{availabilityValidation.invalidRanges
										? "Hay tramos invalidos: la hora de fin debe ser posterior a la de inicio."
										: availabilityValidation.meetsRequirement
											? `Requisito cumplido: ${availabilityValidation.validDays}/${availabilityValidation.minDays} dias validos con al menos ${availabilityValidation.minHoursPerDay} horas por dia.`
											: `Debes indicar al menos ${availabilityValidation.minDays} dias con ${availabilityValidation.minHoursPerDay} horas por dia. Actualmente cumples ${availabilityValidation.validDays}/${availabilityValidation.minDays} dias.`}
								</AlertDescription>
							</Alert>

							<Alert>
								<Send className="h-4 w-4" />
								<AlertDescription>
									Si algún jugador no está registrado, recibirá una invitación
									por email.
								</AlertDescription>
							</Alert>

							<Button type="submit" className="w-full" disabled={submitDisabled}>
								{submitDisabled && !isSubmitting && !createTeamByAdmin.isPending
									? "Completa la disponibilidad minima"
									: isSubmitting || createTeamByAdmin.isPending
										? "Inscribiendo..."
										: "Inscribir equipo"}
							</Button>
						</form>
					</CardContent>
				</Card>
			</div>
		</div>
	)
}

export default CompetitionRegister
