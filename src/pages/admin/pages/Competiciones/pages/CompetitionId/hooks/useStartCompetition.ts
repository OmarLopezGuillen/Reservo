import type { CompetitionTeamWithMemberAndAvailability } from "@/models/competition.model"
import { generateSchedulesByCategory } from "@/pages/admin/pages/Competiciones/pages/CompetitionId/utils/RoundRobin"

type roundRobin = "single_round_robin" | "double_round_robin" | null | undefined

export function useStartCompetition(
	teams: CompetitionTeamWithMemberAndAvailability[],
	type: roundRobin,
) {
	const startCompetition = () => {
		if (!type) return []
		const schedule = generateSchedulesByCategory(teams, type)

		return schedule
	}
	return { startCompetition }

	/* 	getTeamsAvailabilitiesByTeamIds(["", "", ""])

	assignStartTimesToSchedule(schedule, disponibilidad) --> lib */
}
