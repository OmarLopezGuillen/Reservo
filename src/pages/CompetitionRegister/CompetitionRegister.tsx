import {
	Calendar,
	CheckCircle2,
	ChevronLeft,
	Info,
	Loader2,
	PlusCircle,
	Send,
	Trophy,
	Users,
} from "lucide-react"
import type React from "react"
import { useState } from "react"
import { useNavigate, useSearchParams } from "react-router"
import { toast } from "sonner"
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

const CompetitionRegister = () => {
	const [searchParams] = useSearchParams()
	const competitionId = searchParams.get("id")
	const navigate = useNavigate()

	const {
		data: competition,
		isLoading: isLoadingCompetition,
		isError: isErrorCompetition,
	} = useCompetitionById(competitionId).competitionByIdQuery

	const { data: categories = [], isLoading: isLoadingCategories } =
		useCompetitionCategoriesByCompetitionId(
			competitionId!,
		).competitionCategoriesQuery

	const { createTeamByAdmin } = useCompetitionTeamsMutation()
	const { createTeamAvailability } = useTeamAvailabilitiesMutation()

	const [submitted, setSubmitted] = useState(false)

	const [teamName, setTeamName] = useState("")
	const [selectedCategory, setSelectedCategory] = useState("")
	const [emailPlayer1, setEmailPlayer1] = useState("")
	const [emailPlayer2, setEmailPlayer2] = useState("")
	const [availabilities, setAvailabilities] = useState<TeamAvailability[]>([])

	const isLoading = isLoadingCompetition || isLoadingCategories

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		if (
			!teamName.trim() ||
			!selectedCategory ||
			!emailPlayer1 ||
			!emailPlayer2
		) {
			toast.error("Por favor, completa todos los campos.")
			return
		}

		if (emailPlayer1.toLowerCase() === emailPlayer2.toLowerCase()) {
			toast.error("Los emails de los jugadores no pueden ser iguales.")
			return
		}

		createTeamByAdmin.mutate(
			{
				competitionId: competitionId!,
				categoryId: selectedCategory,
				teamName,
				emailPlayer1,
				emailPlayer2,
			},
			{
				onSuccess: (data) => {
					setSubmitted(true)
					if (availabilities.length > 0 && data.team_id) {
						console.log("Creando disponibilidades...: ", availabilities)
						availabilities.forEach((avail) => {
							createTeamAvailability.mutate({
								team_id: data.team_id,
								weekday: avail.weekday,
								start_time: avail.startTime,
								end_time: avail.endTime,
							})
						})
					} else {
						toast.success("Equipo creado sin disponibilidad horaria.")
					}
				},
			},
		)
	}

	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-muted/30">
				<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
			</div>
		)
	}

	if (isErrorCompetition || !competition) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-muted/30">
				<Card className="max-w-md">
					<CardContent className="pt-6 text-center">
						<p className="text-muted-foreground">Competición no encontrada</p>
					</CardContent>
				</Card>
			</div>
		)
	}

	const now = new Date()
	const regStart = competition.registrationStartsAt
		? new Date(competition.registrationStartsAt)
		: null
	const regEnd = competition.registrationEndsAt
		? new Date(competition.registrationEndsAt)
		: null
	const isRegistrationOpen =
		(!regStart || now >= regStart) &&
		(!regEnd || now <= regEnd) &&
		(competition.status === "published" || competition.status === "in_progress")

	if (submitted) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
				<Card className="max-w-md w-full">
					<CardContent className="pt-6 text-center space-y-4">
						<CheckCircle2 className="h-16 w-16 text-green-500 mx-auto" />
						<h2 className="text-2xl font-bold">Equipo Inscrito</h2>
						<p className="text-muted-foreground">
							El equipo "{teamName}" ha sido inscrito correctamente. Se han
							enviado invitaciones si los jugadores no estaban registrados.
						</p>
						<div className="pt-4 space-y-2">
							<Button
								onClick={() => navigate(ROUTES.COMPETITIONS.ID(competitionId!))}
								className="w-full"
							>
								Ver Competición
							</Button>
							<Button
								variant="outline"
								onClick={() => {
									setSubmitted(false)
									setTeamName("")
									setSelectedCategory("")
									setEmailPlayer1("")
									setEmailPlayer2("")
									setAvailabilities([])
								}}
								className="w-full"
							>
								Crear Otro Equipo
							</Button>
						</div>
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

				{!isRegistrationOpen ? (
					<Card>
						<CardContent className="pt-6 text-center">
							<p className="text-muted-foreground">
								{competition.status === "draft"
									? "Esta competición aún no está abierta para inscripciones"
									: competition.status === "finished"
										? "Esta competición ya ha finalizado"
										: "El período de inscripción no está activo"}
							</p>
							{regStart && now < regStart && (
								<p className="text-sm text-muted-foreground mt-2">
									Las inscripciones abren el{" "}
									{regStart.toLocaleDateString("es-ES")}
								</p>
							)}
						</CardContent>
					</Card>
				) : categories.length === 0 ? (
					<Card>
						<CardContent className="pt-6 text-center">
							<p className="text-muted-foreground">
								No hay categorías disponibles para inscripción
							</p>
						</CardContent>
					</Card>
				) : (
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Users className="h-5 w-5" />
								Inscribir Equipo
							</CardTitle>
							<CardDescription>
								Inscribe tu equipo en la competición.
							</CardDescription>
						</CardHeader>
						<CardContent>
							<form onSubmit={handleSubmit} className="space-y-6">
								<div className="space-y-2">
									<Label htmlFor="teamName">Nombre del Equipo *</Label>
									<Input
										id="teamName"
										value={teamName}
										onChange={(e) => setTeamName(e.target.value)}
										placeholder="Ej: Los Campeones"
										required
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="category">Categoría *</Label>
									<Select
										value={selectedCategory}
										onValueChange={setSelectedCategory}
										required
									>
										<SelectTrigger>
											<SelectValue placeholder="Selecciona una categoría" />
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

								<div className="space-y-2">
									<Label htmlFor="player1Email">Email del Jugador 1 *</Label>
									<Input
										id="player1Email"
										type="email"
										value={emailPlayer1}
										onChange={(e) => setEmailPlayer1(e.target.value)}
										placeholder="jugador1@email.com"
										required
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="player2Email">Email del Jugador 2 *</Label>
									<Input
										id="player2Email"
										type="email"
										value={emailPlayer2}
										onChange={(e) => setEmailPlayer2(e.target.value)}
										placeholder="jugador2@email.com"
										required
									/>
								</div>

								<AvailabilityManager
									availabilities={availabilities}
									setAvailabilities={setAvailabilities}
								/>

								<Alert>
									<Send className="h-4 w-4" />
									<AlertDescription>
										Si los jugadores no están registrados, recibirán una
										invitación por email para unirse.
									</AlertDescription>
								</Alert>

								<Button
									type="submit"
									className="w-full"
									disabled={createTeamByAdmin.isPending}
								>
									{createTeamByAdmin.isPending ? (
										<>
											<Loader2 className="mr-2 h-4 w-4 animate-spin" />
											Inscribiendo equipo...
										</>
									) : (
										<>
											<Users className="mr-2 h-4 w-4" />
											Inscribir Equipo
										</>
									)}
								</Button>
							</form>
						</CardContent>
					</Card>
				)}
			</div>
		</div>
	)
}

export default CompetitionRegister
