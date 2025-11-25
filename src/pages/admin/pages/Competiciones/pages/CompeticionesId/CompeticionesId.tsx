import {
	ArrowLeft,
	CheckCircle2,
	Edit,
	Loader2,
	Play,
	Trash2,
} from "lucide-react"
import { useState } from "react"
import { Link, useNavigate, useParams } from "react-router"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useCompetitionCategoriesByCompetitionId } from "@/hooks/competitions/useCompetitionCategoriesQuery"
import { useCompetitionsMutation } from "@/hooks/competitions/useCompetitionsMutations"
import { useCompetitionById } from "@/hooks/competitions/useCompetitionsQuery"
import type { CompetitionsStatus } from "@/models/dbTypes"
import { ROUTES } from "@/ROUTES"

import CategoriesTab from "./components/categories-tab"
import MatchesTab from "./components/matches-tab"
import OverviewTab from "./components/overview-tab"
import RulesTab from "./components/rules-tab"
import StandingsTab from "./components/standings-tab"

const CompeticionesId = () => {
	const { competicionId } = useParams<{ competicionId: string }>()
	const [activeTab, setActiveTab] = useState("overview")
	console.log(competicionId)
	const {
		data: competition,
		isLoading: isLoadingCompetition,
		isError: isErrorCompetition,
	} = useCompetitionById(competicionId ?? null).competitionByIdQuery

	const { data: categories = [], isLoading: isLoadingCategories } =
		useCompetitionCategoriesByCompetitionId(
			competicionId,
		).competitionCategoriesQuery

	const { updateCompetition } = useCompetitionsMutation()

	const isLoading = isLoadingCompetition || isLoadingCategories

	const getStatusColor = (status: string) => {
		switch (status) {
			case "published":
				return "success"
			case "draft":
				return "secondary"
			case "in_progress":
				return "default"
			case "finished":
				return "outline"
			default:
				return "destructive"
		}
	}

	const getStatusLabel = (status: string) => {
		switch (status) {
			case "published":
				return "Publicada"
			case "draft":
				return "Borrador"
			case "in_progress":
				return "En Progreso"
			case "finished":
				return "Finalizada"
			case "closed":
				return "Cerrada"
			default:
				return status
		}
	}

	const handleStatusChange = (newStatus: CompetitionsStatus) => {
		if (!competition) return

		updateCompetition.mutate({
			id: competition.id,
			competitionData: { status: newStatus },
		})
	}

	if (isLoading || !competition) {
		return (
			<div className="container mx-auto py-8">
				<div className="flex justify-center items-center min-h-[400px]">
					<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
				</div>
			</div>
		)
	}

	return (
		<div className="container mx-auto py-8">
			{/* Header */}
			<div className="mb-6">
				<Link to={ROUTES.ADMIN.COMPETICIONES}>
					<Button variant="ghost" size="sm" className="mb-4">
						<ArrowLeft className="mr-2 h-4 w-4" />
						Volver a Competiciones
					</Button>
				</Link>

				<div className="flex items-start justify-between">
					<div>
						<div className="flex items-center gap-3 mb-2">
							<h1 className="text-3xl font-bold">{competition.name}</h1>
							<Badge variant={getStatusColor(competition.status)}>
								{getStatusLabel(competition.status)}
							</Badge>
							<Badge variant="outline" className="capitalize">
								{competition.type}
							</Badge>
						</div>
						<p className="text-muted-foreground">
							{competition.description || "Sin descripción"}
						</p>
					</div>

					<div className="flex gap-2">
						{competition.status === "draft" && !updateCompetition.isPending && (
							<Button onClick={() => handleStatusChange("published")}>
								<Play className="mr-2 h-4 w-4" />
								Publicar
							</Button>
						)}
						{competition.status === "published" &&
							!updateCompetition.isPending && (
								<Button onClick={() => handleStatusChange("in_progress")}>
									<Play className="mr-2 h-4 w-4" />
									Iniciar
								</Button>
							)}
						{competition.status === "in_progress" &&
							!updateCompetition.isPending && (
								<Button
									onClick={() => handleStatusChange("finished")}
									variant="outline"
								>
									<CheckCircle2 className="mr-2 h-4 w-4" />
									Finalizar
								</Button>
							)}
						<Button variant="outline">
							<Edit className="mr-2 h-4 w-4" />
							Editar
						</Button>
						<Button variant="outline" size="icon">
							<Trash2 className="h-4 w-4" />
						</Button>
					</div>
				</div>
			</div>

			{/* Tabs */}
			<Tabs value={activeTab} onValueChange={setActiveTab}>
				<TabsList className="w-full justify-start">
					<TabsTrigger value="overview">General</TabsTrigger>
					<TabsTrigger value="categories">Categorías</TabsTrigger>
					<TabsTrigger value="rules">Normas</TabsTrigger>
					<TabsTrigger value="matches">Partidos</TabsTrigger>
					<TabsTrigger value="standings">Clasificación</TabsTrigger>
				</TabsList>

				<TabsContent value="overview" className="mt-6">
					<OverviewTab competition={competition} categories={categories} />
				</TabsContent>

				<TabsContent value="categories" className="mt-6">
					<CategoriesTab competition={competition} />
				</TabsContent>

				<TabsContent value="rules" className="mt-6">
					<RulesTab competition={competition} />
				</TabsContent>

				<TabsContent value="matches" className="mt-6">
					<MatchesTab competitionId={competition.id} />
				</TabsContent>

				<TabsContent value="standings" className="mt-6">
					<StandingsTab competitionId={competition.id} />
				</TabsContent>
			</Tabs>
		</div>
	)
}
export default CompeticionesId
