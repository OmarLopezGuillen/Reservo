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
		//TODO: Mover a reacquery o debatirlo
		const disponibilidad = await getTeamsAvailabilitiesByTeamIds(uniqueteams)
		const matchesWithTime = assignStartTimesToCategoryMatches(
			schedule,
			disponibilidad,
		)

		const { matches, unscheduled } =
			await createMatchesGreedyFromCategoriesSchedule(
				matchesWithTime, // tu array [{ categoriaId, schedule }, ...]
				{
					competitionId: competicionId,
					courtIds, // todas las pistas del club
				},
			)

		return schedule

		/* 	getTeamsAvailabilitiesByTeamIds(["", "", ""])

	assignStartTimesToSchedule(schedule, disponibilidad) --> lib */
	}
	return { startCompetition }
}
