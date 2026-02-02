import { CheckCircle2, Edit, Play, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCompetitionsMutation } from "@/hooks/competitions/useCompetitionsMutations"
import type {
	Competition,
	CompetitionTeamWithMemberAndAvailability,
} from "@/models/competition.model"
import { StartCompetitionDialog } from "@/pages/admin/pages/Competiciones/pages/CompetitionId/components/OptionsCompetition/components/StartCompetitionDialog/StartCompetitionDialog"
import { useStartCompetition } from "@/pages/admin/pages/Competiciones/pages/CompetitionId/hooks/useStartCompetition"

export default function OptionsCompetition({
	competition,
	teams,
}: {
	competition: Competition
	teams: CompetitionTeamWithMemberAndAvailability[]
}) {
	const competitionStatus = competition.status
	const { updateCompetition } = useCompetitionsMutation()

	//this is a comment
	const roundCompetition = competition.roundType
	const statusCompetition = competition.status

	const { startCompetition } = useStartCompetition(teams, roundCompetition)

	const handleStatusChange = (newStatus: typeof statusCompetition) => {
		if (!newStatus) return

		updateCompetition.mutate({
			id: competition.id,
			competitionData: { status: newStatus },
		})
	}

	const initCompetition = () => {
		startCompetition()
		handleStatusChange("in_progress")
	}

	return (
		<div className="flex gap-2">
			{competitionStatus === "draft" && (
				<Button onClick={() => handleStatusChange("published")}>
					<Play className="mr-2 h-4 w-4" />
					Publicar
				</Button>
			)}

			{competitionStatus === "published" && (
				<StartCompetitionDialog teams={teams} onConfirm={initCompetition} />
			)}

			{competitionStatus === "in_progress" && (
				<Button
					onClick={() => handleStatusChange("finished")}
					variant="outline"
				>
					<CheckCircle2 className="mr-2 h-4 w-4" />
					Finalizar
				</Button>
			)}
			{/*TODO: Hacer función de Editar */}
			<Button variant="outline">
				<Edit className="mr-2 h-4 w-4" />
				Editar
			</Button>
			{/*TODO: Hacer función de Eliminar */}
			<Button variant="outline" size="icon">
				<Trash2 className="h-4 w-4" />
			</Button>
		</div>
	)
}
