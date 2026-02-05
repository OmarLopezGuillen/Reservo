import { useParams } from "react-router"
import { useCourts } from "@/hooks/useCourtsQuery"
import {
	assignStartTimesToCategoryMatches,
	getUniqueTeamIdsFromSchedule,
} from "@/lib/matchScheduler"
import type {
	Competition,
	CompetitionTeamWithMemberAndAvailability,
} from "@/models/competition.model"
import { generateSchedulesByCategory } from "@/pages/admin/pages/Competiciones/pages/CompetitionId/utils/RoundRobin"
import { createMatchesGreedyFromCategoriesSchedule } from "@/services/databaseService/competitions/matches.greedy.service"
import { getTeamsAvailabilitiesByTeamIds } from "@/services/databaseService/competitions/team_availabilities.service"

type roundRobin = Competition["roundType"]

export function useStartCompetition(
	teams: CompetitionTeamWithMemberAndAvailability[],
	type: roundRobin,
) {
	const { competicionId } = useParams()
	const { courtsQuery } = useCourts(competicionId)
	const courtIds = courtsQuery.data?.map((c) => c.id) ?? []

	const startCompetition = async () => {
		if (!type || !competicionId) return []

		const schedule = generateSchedulesByCategory(teams, type)

		const uniqueteams = getUniqueTeamIdsFromSchedule(schedule)
		const disponibilidad = await getTeamsAvailabilitiesByTeamIds(uniqueteams)

		// ✅ lunes de la semana que viene (igual que tu lógica actual)
		const today = new Date()
		const firstRoundWeekStart = (() => {
			const d = new Date(today)
			const day = d.getDay()
			const diff = day === 0 ? -6 : 1 - day
			d.setDate(d.getDate() + diff)
			d.setHours(0, 0, 0, 0)
			d.setDate(d.getDate() + 7)
			return d
		})()

		const matchesWithTime = assignStartTimesToCategoryMatches(
			schedule,
			disponibilidad,
			{ firstRoundWeekStart },
		)

		await createMatchesGreedyFromCategoriesSchedule(matchesWithTime, {
			competitionId: competicionId,
			courtIds,
			firstRoundWeekStart, // 👈 NUEVO
		})

		return schedule
	}

	return { startCompetition }
}
