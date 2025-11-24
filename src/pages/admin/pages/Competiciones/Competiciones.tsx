import type { VariantProps } from "class-variance-authority"
import { Calendar, Loader2, Plus, Trophy, Users } from "lucide-react"
import { Link } from "react-router"
import { useAuthStore } from "@/auth/stores/auth.store"
import type { badgeVariants } from "@/components/ui/badge"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import { useCompetitionsByClubId } from "@/hooks/competitions/useCompetitionsQuery"
import type { Competition } from "@/models/competition.model"
import { ROUTES } from "@/ROUTES"

const Competiciones = () => {
	const { user } = useAuthStore()
	const { competitionsQuery } = useCompetitionsByClubId(user!.clubId!)
	const { data: competitions = [], isLoading } = competitionsQuery

	const getStatusColor = (
		status: string,
	): VariantProps<typeof badgeVariants>["variant"] => {
		switch (status) {
			case "published":
				return "default" // Primary color
			case "draft":
				return "secondary" // Gray
			case "completed":
				return "outline"
			default:
				return "secondary"
		}
	}

	const getStatusLabel = (status: string) => {
		switch (status) {
			case "published":
				return "Publicada"
			case "draft":
				return "Borrador"
			case "completed":
				return "Finalizada"
			default:
				return status
		}
	}

	return (
		<div className="container mx-auto py-8">
			<div className="flex items-center justify-between mb-8">
				<div>
					<h1 className="text-3xl font-bold mb-2">Competiciones</h1>
					<p className="text-muted-foreground">
						Gestiona tus ligas y torneos de pádel
					</p>
				</div>
				<Link to={ROUTES.ADMIN.CREAR_COMPETICION}>
					<Button>
						<Plus className="mr-2 h-4 w-4" />
						Crear Competición
					</Button>
				</Link>
			</div>

			{isLoading ? (
				<div className="flex justify-center py-12">
					<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
				</div>
			) : competitions.length === 0 ? (
				<div className="text-center py-12 border rounded-lg bg-muted/10">
					<Trophy className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
					<h3 className="text-lg font-medium mb-2">No hay competiciones</h3>
					<p className="text-muted-foreground mb-4">
						Empieza creando tu primera liga o torneo
					</p>
					<Link to={ROUTES.ADMIN.CREAR_COMPETICION}>
						<Button variant="outline">Crear Competición</Button>
					</Link>
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{(competitions as Competition[]).map((competition) => (
						<Link key={competition.id} to={ROUTES.ADMIN.ID(competition.id)}>
							<Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
								<CardHeader className="pb-2">
									<div className="flex justify-between items-start">
										<Badge variant={getStatusColor(competition.status)}>
											{getStatusLabel(competition.status)}
										</Badge>
										<Badge variant="outline" className="capitalize">
											{competition.type}
										</Badge>
									</div>
									<CardTitle className="mt-2">{competition.name}</CardTitle>
									<CardDescription className="line-clamp-2">
										{competition.description || "Sin descripción"}
									</CardDescription>
								</CardHeader>
								<CardContent>
									<div className="space-y-2 text-sm text-muted-foreground mt-2">
										<div className="flex items-center">
											<Calendar className="mr-2 h-4 w-4" />
											<span>
												{new Date(competition.startDate).toLocaleDateString()} -{" "}
												{new Date(competition.endDate).toLocaleDateString()}
											</span>
										</div>
										{competition.maxTeamsPerCategory && (
											<div className="flex items-center">
												<Users className="mr-2 h-4 w-4" />
												<span>
													Máx. {competition.maxTeamsPerCategory} equipos/cat
												</span>
											</div>
										)}
									</div>
								</CardContent>
							</Card>
						</Link>
					))}
				</div>
			)}
		</div>
	)
}

export default Competiciones
