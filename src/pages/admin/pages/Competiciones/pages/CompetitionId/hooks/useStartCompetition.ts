import { useCourts } from "@/hooks/useCourtsQuery"
import {
	assignStartTimesToCategoryMatches,
	getUniqueTeamIdsFromSchedule,
} from "@/lib/matchScheduler"
import type { CompetitionTeamWithMemberAndAvailability } from "@/models/competition.model"
import { generateSchedulesByCategory } from "@/pages/admin/pages/Competiciones/pages/CompetitionId/utils/RoundRobin"
import { createMatchesGreedyFromCategoriesSchedule } from "@/services/databaseService/competitions/matches.greedy.service"
import { getTeamsAvailabilitiesByTeamIds } from "@/services/databaseService/competitions/team_availabilities.service"

type roundRobin = "single_round_robin" | "double_round_robin" | null | undefined

export function useStartCompetition(
	teams: CompetitionTeamWithMemberAndAvailability[],
	type: roundRobin,
) {
	const { courtsQuery } = useCourts("a32a865d-3ecc-448b-a38d-9da8a10cca59")
	const courtIds = courtsQuery.data?.map((c) => c.id) ?? []

	//const { competitionId } = useParams() // si tu ruta es /admin/competiciones/:competitionId

	const startCompetition = async () => {
		if (!type) return []
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
					competitionId: "5cc8bda5-e244-439f-be8e-942de0368e4e",
					courtIds, // todas las pistas del club
				},
			)
		console.log("MATCHES CREADOS:", matches)
		console.log("NO PROGRAMADOS:", unscheduled)
		return schedule

		/* 	getTeamsAvailabilitiesByTeamIds(["", "", ""])

	assignStartTimesToSchedule(schedule, disponibilidad) --> lib */
	}
	return { startCompetition }
}
