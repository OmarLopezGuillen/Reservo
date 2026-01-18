import { ArrowLeft, Loader2 } from "lucide-react"
import { Link, useParams } from "react-router"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useCompetitionById } from "@/hooks/competitions/useCompetitionsQuery"
import { useCompetitionTeamsByCompetitionId } from "@/hooks/competitions/useCompetitionTeamsQuery"
import OptionsCompetition from "@/pages/admin/pages/Competiciones/pages/CompetitionId/components/OptionsCompetition/OptionsCompetition"
import TabsCompetition from "@/pages/admin/pages/Competiciones/pages/CompetitionId/components/TabsCompetition/TabsCompetition"
import {
	getStatusColor,
	getStatusLabel,
} from "@/pages/admin/pages/Competiciones/pages/CompetitionId/utils/getStatusStyles"
import { ROUTES } from "@/ROUTES"

const CompeticionesId = () => {
	const { competicionId } = useParams<{ competicionId: string }>()

	const { data: competition, isLoading: isLoadingCompetition } =
		useCompetitionById(competicionId ?? null).competitionByIdQuery

	const { competitionTeamsQuery } =
		useCompetitionTeamsByCompetitionId(competicionId)

	const { data: teams = [] } = competitionTeamsQuery

	const isLoading = isLoadingCompetition || competitionTeamsQuery.isLoading

	if (isLoading) {
		return (
			<div className="container mx-auto py-8">
				<div className="flex justify-center items-center min-h-[400px]">
					<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
				</div>
			</div>
		)
	}

	if (!competition) {
		return (
			<div className="container mx-auto py-8">
				<div className="flex justify-center items-center min-h-[400px]">
					Error al buscar la competición
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
					{/* Information */}
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

					{/* Options */}
					<OptionsCompetition competition={competition} teams={teams} />
				</div>
			</div>

			<TabsCompetition />
		</div>
	)
}
export default CompeticionesId
