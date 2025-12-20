import { Play } from "lucide-react"
import { useMemo } from "react"
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
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip"
import type { CompetitionTeamWithMemberAndAvailability } from "@/models/competition.model"

interface StartCompetitionDialogProps {
	teams: CompetitionTeamWithMemberAndAvailability[]
	onConfirm: () => void
	isPending: boolean
}

export const StartCompetitionDialog = ({
	teams,
	onConfirm,
	isPending,
}: StartCompetitionDialogProps) => {
	const canStartCompetition = useMemo(() => {
		if (teams.length === 0) return false
		const allTeamsCompleted = teams.every((team) => team.status === "enrolled")
		const allTeamsHaveAvailability = teams.every(
			(team) => team.availabilities && team.availabilities.length > 0,
		)
		return allTeamsCompleted && allTeamsHaveAvailability
	}, [teams])

	const disabledReason = useMemo(() => {
		if (canStartCompetition) return ""
		if (teams.length === 0) return "No hay equipos inscritos."
		const incompleteTeams = teams.filter((t) => t.status !== "enrolled").length
		const noAvailabilityTeams = teams.filter(
			(t) => !t.availabilities || t.availabilities.length === 0,
		).length

		const reasons = []
		if (incompleteTeams > 0)
			reasons.push(`${incompleteTeams} equipo(s) no están completos.`)
		if (noAvailabilityTeams > 0)
			reasons.push(
				`${noAvailabilityTeams} equipo(s) no tienen disponibilidad horaria.`,
			)
		return reasons.join(" ")
	}, [teams, canStartCompetition])

	return (
		<AlertDialog>
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger asChild>
						<AlertDialogTrigger asChild>
							<Button disabled={isPending}>
								<Play className="mr-2 h-4 w-4" />
								Iniciar
							</Button>
						</AlertDialogTrigger>
					</TooltipTrigger>
					{disabledReason && <TooltipContent>{disabledReason}</TooltipContent>}
				</Tooltip>
			</TooltipProvider>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>¿Iniciar la competición?</AlertDialogTitle>
					<AlertDialogDescription>
						Se crearán todos los cruces automáticamente. Esta acción no se puede
						deshacer.
					</AlertDialogDescription>
					{canStartCompetition && (
						<p className="text-red-500 text-sm mt-2">
							Para comenzar, es necesario que todos los equipos hayan aceptado
							la invitación y tengan disponibilidad horaria. {disabledReason}
						</p>
					)}
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancelar</AlertDialogCancel>
					<AlertDialogAction
						onClick={onConfirm}
						disabled={!canStartCompetition}
					>
						Aceptar
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}
