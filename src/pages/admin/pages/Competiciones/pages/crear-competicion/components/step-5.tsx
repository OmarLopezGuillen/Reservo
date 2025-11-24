import { format } from "date-fns"
import {
	AlertCircle,
	Calendar,
	CheckCircle2,
	FileText,
	Loader2,
	Trophy,
	Users,
} from "lucide-react"
import { useState } from "react"
import { Link, useNavigate } from "react-router"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useCompetitionCategoriesByCompetitionId } from "@/hooks/competitions/useCompetitionCategoriesQuery"
import { useCompetitionsMutation } from "@/hooks/competitions/useCompetitionsMutations"
import { useCompetitionById } from "@/hooks/competitions/useCompetitionsQuery"
import { ROUTES } from "@/ROUTES"

interface Step5Props {
	competitionId?: string
	onBack: () => void
}

const Step5 = ({ competitionId, onBack }: Step5Props) => {
	const navigate = useNavigate()
	const [isPublished, setIsPublished] = useState(false)

	const { data: competition, isLoading: isLoadingCompetition } =
		useCompetitionById(competitionId ?? null).competitionByIdQuery

	const { data: categories = [], isLoading: isLoadingCategories } =
		useCompetitionCategoriesByCompetitionId(
			competitionId,
		).competitionCategoriesQuery

	const { updateCompetition } = useCompetitionsMutation()

	const isLoading = isLoadingCompetition || isLoadingCategories

	const handlePublish = async () => {
		if (!competitionId) return

		updateCompetition.mutate(
			{
				id: competitionId,
				competitionData: { status: "published" },
			},
			{
				onSuccess: () => {
					toast.success("¡Competición publicada con éxito!")
					setIsPublished(true)
				},
			},
		)
	}

	const handleSaveAsDraft = () => {
		toast.info("La competición se ha guardado como borrador.")
		navigate(ROUTES.ADMIN.COMPETICIONES)
	}

	if (isLoading) {
		return (
			<div className="flex flex-col items-center justify-center py-12">
				<Loader2 className="animate-spin h-8 w-8 text-primary mb-4" />
				<p className="text-muted-foreground">Cargando resumen...</p>
			</div>
		)
	}

	if (!competition) {
		return (
			<div className="flex flex-col items-center justify-center py-12 text-destructive">
				<AlertCircle className="size-12 mb-4" />
				<p>No se pudo cargar la información de la competición</p>
			</div>
		)
	}

	if (isPublished) {
		return (
			<div className="bg-muted/50 p-6 rounded-lg border flex flex-col items-center text-center space-y-4">
				<div className="p-3 bg-green-600/10 rounded-full">
					<CheckCircle2 className="size-8 text-green-600" />
				</div>
				<div className="space-y-2">
					<h2 className="text-2xl font-bold">¡Competición Publicada!</h2>
					<p className="text-muted-foreground max-w-lg mx-auto">
						Tu competición ya es visible y está lista para recibir
						inscripciones.
					</p>
				</div>
				<Button asChild>
					<Link to={ROUTES.ADMIN.COMPETICIONES}>Volver al listado</Link>
				</Button>
			</div>
		)
	}

	const isLeague = competition.type === "league"

	return (
		<div className="space-y-8">
			<div className="bg-muted/50 p-6 rounded-lg border flex flex-col items-center text-center space-y-4">
				<div className="p-3 bg-primary/10 rounded-full">
					<CheckCircle2 className="size-8 text-primary" />
				</div>
				<div className="space-y-2">
					<h2 className="text-2xl font-bold">¡Todo listo!</h2>
					<p className="text-muted-foreground max-w-lg mx-auto">
						Revisa la información antes de publicar. Una vez publicada, la
						competición será visible para los jugadores.
					</p>
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				{/* General Info */}
				<Card>
					<CardHeader className="flex flex-row items-center gap-2 pb-2">
						<Trophy className="size-5 text-primary" />
						<CardTitle className="text-base">Información General</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid grid-cols-2 gap-2 text-sm">
							<span className="text-muted-foreground">Nombre:</span>
							<span className="font-medium text-right">{competition.name}</span>
							<span className="text-muted-foreground">Tipo:</span>
							<span className="font-medium text-right capitalize">
								{competition.type === "league"
									? "Liga"
									: competition.type === "tournament"
										? "Torneo"
										: "Americano"}
							</span>
							<span className="text-muted-foreground">Estado:</span>
							<span className="text-right">
								<Badge variant="secondary" className="capitalize">
									{competition.status === "draft"
										? "Borrador"
										: competition.status}
								</Badge>
							</span>
						</div>

						<Separator />

						<div className="space-y-2 text-sm">
							<div className="flex items-center gap-2 text-muted-foreground">
								<Calendar className="size-4" />
								<span>Fechas Clave</span>
							</div>
							<div className="grid grid-cols-2 gap-1 pl-6">
								<span className="text-muted-foreground">Inscripción:</span>
								<span className="font-medium text-right">
									{competition.registrationStartsAt &&
									competition.registrationEndsAt
										? format(
												new Date(competition.registrationStartsAt),
												"dd/MM/yy",
											)
										: ""}{" "}
									-{" "}
									{competition.registrationEndsAt
										? format(
												new Date(competition.registrationEndsAt),
												"dd/MM/yy",
											)
										: "-"}
								</span>
								<span className="text-muted-foreground">Inicio Torneo:</span>
								<span className="font-medium text-right">
									{format(new Date(competition.startDate), "dd/MM/yy")}
								</span>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Configuration */}
				<Card>
					<CardHeader className="flex flex-row items-center gap-2 pb-2">
						<FileText className="size-5 text-primary" />
						<CardTitle className="text-base">Configuración</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid grid-cols-2 gap-2 text-sm">
							<span className="text-muted-foreground">Puntuación:</span>
							<span className="font-medium text-right">
								{competition.pointsWin}/{competition.pointsDraw}/
								{competition.pointsLoss} (V/E/D)
							</span>

							<span className="text-muted-foreground">Empates:</span>
							<span className="font-medium text-right">
								{competition.allowDraws ? "Permitidos" : "No permitidos"}
							</span>

							{isLeague && (
								<>
									<span className="text-muted-foreground">Formato:</span>
									<span className="font-medium text-right">
										{competition.roundType === "single_round_robin"
											? "Ida"
											: "Ida y Vuelta"}
									</span>

									<span className="text-muted-foreground">Playoff:</span>
									<span className="font-medium text-right">
										{competition.hasPlayoff
											? `${competition.playoffTeams} equipos`
											: "No"}
									</span>
								</>
							)}
						</div>
					</CardContent>
				</Card>

				{/* Categories */}
				<Card className="md:col-span-2">
					<CardHeader className="flex flex-row items-center gap-2 pb-2">
						<Users className="size-5 text-primary" />
						<CardTitle className="text-base">
							Categorías ({categories.length})
						</CardTitle>
					</CardHeader>
					<CardContent>
						{categories.length === 0 ? (
							<p className="text-sm text-muted-foreground text-center py-4">
								No hay categorías definidas
							</p>
						) : (
							<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
								{categories.map((cat) => (
									<div key={cat.id} className="border rounded-md p-3 text-sm">
										<div className="font-medium">{cat.name}</div>
										<div className="text-muted-foreground text-xs mt-1">
											Max. {cat.maxTeams} equipos
										</div>
									</div>
								))}
							</div>
						)}
					</CardContent>
				</Card>
			</div>

			<div className="flex justify-between pt-4">
				<Button variant="outline" onClick={onBack}>
					Volver a editar
				</Button>
				<div className="flex items-center gap-2">
					<Button variant="ghost" onClick={handleSaveAsDraft}>
						Dejar como borrador
					</Button>
					<Button
						size="lg"
						onClick={handlePublish}
						disabled={updateCompetition.isPending || categories.length === 0}
						className="bg-green-600 hover:bg-green-700"
					>
						{updateCompetition.isPending && (
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
						)}
						{updateCompetition.isPending
							? "Publicando..."
							: "Publicar Competición"}
					</Button>
				</div>
			</div>
		</div>
	)
}

export default Step5
