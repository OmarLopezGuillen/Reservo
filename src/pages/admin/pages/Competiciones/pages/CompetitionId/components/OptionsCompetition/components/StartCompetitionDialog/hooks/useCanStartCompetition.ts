import { useMemo } from "react"
import type { CompetitionTeamWithMemberAndAvailability } from "@/models/competition.model"

export function useCanStartCompetition(
	teams: CompetitionTeamWithMemberAndAvailability[],
) {
	const conditionsTeams = useMemo(() => {
		let emptyTeams = false
		let incompleteTeams = false
		let noAvailabilityTeams = false

		if (teams.length < 2) emptyTeams = true

		if (teams.some((team) => team.status === "pending")) incompleteTeams = true

		if (
			teams.some(
				(team) => !team.availabilities || team.availabilities.length <= 0,
			)
		)
			noAvailabilityTeams = true

		const allConditionsTeamsCompleted = !(
			emptyTeams ||
			incompleteTeams ||
			noAvailabilityTeams
		)

		return {
			emptyTeams,
			incompleteTeams,
			noAvailabilityTeams,
			allConditionsTeamsCompleted,
		}
	}, [teams])

	const disabledReasons = useMemo(() => {
		const reasons = []
		const { emptyTeams, incompleteTeams, noAvailabilityTeams } = conditionsTeams

		if (emptyTeams) reasons.push("No hay suficientes equipos inscritos.")

		if (incompleteTeams) reasons.push("Hay equipos que no están completos.")

		if (noAvailabilityTeams)
			reasons.push("Hay equipos sin disponibilidad horaria.")

		return reasons
	}, [teams])

	return { conditionsTeams, disabledReasons }
}
