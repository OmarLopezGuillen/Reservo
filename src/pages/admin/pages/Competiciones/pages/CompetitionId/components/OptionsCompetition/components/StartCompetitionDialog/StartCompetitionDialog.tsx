import { Play } from "lucide-react"
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import type { CompetitionTeamWithMemberAndAvailability } from "@/models/competition.model"
import { useCanStartCompetition } from "@/pages/admin/pages/Competiciones/pages/CompetitionId/components/OptionsCompetition/components/StartCompetitionDialog/hooks/useCanStartCompetition"

interface StartCompetitionDialogProps {
	teams: CompetitionTeamWithMemberAndAvailability[]
	onConfirm: () => void
}

export const StartCompetitionDialog = ({
	teams,
	onConfirm,
}: StartCompetitionDialogProps) => {
	const { conditionsTeams, disabledReasons } = useCanStartCompetition(teams)

	const { allConditionsTeamsCompleted } = conditionsTeams

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button>
					<Play className="mr-2 h-4 w-4" />
					Iniciar
				</Button>
			</AlertDialogTrigger>

			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>¿Iniciar la competición?</AlertDialogTitle>
					<AlertDialogDescription>
						Se crearán todos los cruces automáticamente. Esta acción no se puede
						deshacer.
					</AlertDialogDescription>
					{!allConditionsTeamsCompleted && (
						<div>
							<p className="text-red-500 text-sm mt-2">
								Para comenzar, es necesario que todos los equipos hayan aceptado
								la invitación y tengan disponibilidad horaria.
							</p>

							<ul className="text-red-500 text-sm mt-1 list-disc list-inside">
								{disabledReasons.map((reason) => (
									<li key={reason}>{reason}</li>
								))}
							</ul>
						</div>
					)}
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancelar</AlertDialogCancel>
					<AlertDialogAction
						onClick={() => onConfirm()}
						disabled={!allConditionsTeamsCompleted}
					>
						Aceptar
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}
