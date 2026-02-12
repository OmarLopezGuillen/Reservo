import { ArrowLeft, Loader2, Plus } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import { useCompetitionTeamsByCategoryId } from "@/hooks/competitions/useCompetitionTeamsQuery"
import type {
	Competition,
	CompetitionCategory,
	CompetitionTeam,
	CompetitionTeamWithMemberAndAvailability,
} from "@/models/competition.model"
import { TeamCard } from "./TeamCard"

interface CategoryDetailViewProps {
	competition: Competition
	category: CompetitionCategory
	onBack: () => void
}

export const CategoryDetailView = ({
	competition,
	category,
	onBack,
}: CategoryDetailViewProps) => {
	const [isAddParticipantOpen, setIsAddParticipantOpen] = useState(false)

	const { data: teams = [], isLoading } = useCompetitionTeamsByCategoryId(
		category.id,
	).competitionTeamsQuery
	return (
		<Card>
			<CardHeader>
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-4">
						<Button
							variant="outline"
							size="icon"
							className="h-8 w-8"
							onClick={onBack}
						>
							<ArrowLeft className="h-4 w-4" />
							<span className="sr-only">Volver</span>
						</Button>
						<div>
							<CardTitle>{category.name}</CardTitle>
							<CardDescription>
								Equipos inscritos y solicitudes para esta categoría.
							</CardDescription>
						</div>
					</div>
					<Button onClick={() => setIsAddParticipantOpen(true)}>
						<Plus className="mr-2 h-4 w-4" />
						Añadir {competition.type === "league" ? "Equipo" : "Participante"}
					</Button>
				</div>
			</CardHeader>
			<CardContent>
				{isLoading ? (
					<div className="flex justify-center items-center h-24 text-muted-foreground">
						<Loader2 className="mr-2 h-4 w-4 animate-spin" />
						Cargando equipos...
					</div>
				) : teams.length > 0 ? (
					<div className="space-y-4">
						{teams.map((team) => (
							<TeamCard key={team.id} team={team} />
						))}
					</div>
				) : (
					<p className="text-center h-24 text-muted-foreground">
						No hay equipos inscritos en esta categoría.
					</p>
				)}
			</CardContent>
		</Card>
	)
}
