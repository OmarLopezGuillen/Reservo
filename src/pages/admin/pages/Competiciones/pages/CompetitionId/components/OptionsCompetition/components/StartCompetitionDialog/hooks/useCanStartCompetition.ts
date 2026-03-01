import { useMemo } from "react"
import { useAuthUser } from "@/auth/hooks/useAuthUser"
import { useCourts } from "@/hooks/useCourtsQuery"
import type { CompetitionTeamWithMemberAndAvailability } from "@/models/competition.model"

export function useCanStartCompetition(
	teams: CompetitionTeamWithMemberAndAvailability[],
) {
	const user = useAuthUser()
	const { courtsQuery } = useCourts(user.clubId ?? undefined)

	const activeCourts = useMemo(
		() => (courtsQuery.data ?? []).filter((court) => court.isActive),
		[courtsQuery.data],
	)

	const conditionsTeams = useMemo(() => {
		let emptyTeams = false
		let incompleteTeams = false
		let noAvailabilityTeams = false
		let noActiveCourts = false
		let invalidCourtSlotSettings = false

		if (teams.length < 2) emptyTeams = true

		if (teams.some((team) => team.status === "pending")) incompleteTeams = true

		if (
			teams.some(
				(team) => !team.availabilities || team.availabilities.length <= 0,
			)
		)
			noAvailabilityTeams = true

		if (!courtsQuery.isLoading && activeCourts.length === 0) noActiveCourts = true

		if (
			activeCourts.some(
				(court) =>
					court.slotDurationMinutes <= 0 || court.slotStartOffsetMinutes < 0,
			)
		)
			invalidCourtSlotSettings = true

		const allConditionsTeamsCompleted = !(
			emptyTeams ||
			incompleteTeams ||
			noAvailabilityTeams ||
			noActiveCourts ||
			invalidCourtSlotSettings
		)

		return {
			emptyTeams,
			incompleteTeams,
			noAvailabilityTeams,
			noActiveCourts,
			invalidCourtSlotSettings,
			allConditionsTeamsCompleted,
		}
	}, [teams, activeCourts, courtsQuery.isLoading])

	const disabledReasons = useMemo(() => {
		const reasons = []
		const {
			emptyTeams,
			incompleteTeams,
			noAvailabilityTeams,
			noActiveCourts,
			invalidCourtSlotSettings,
		} = conditionsTeams

		if (emptyTeams) reasons.push("No hay suficientes equipos inscritos.")

		if (incompleteTeams) reasons.push("Hay equipos que no están completos.")

		if (noAvailabilityTeams)
			reasons.push("Hay equipos sin disponibilidad horaria.")

		if (noActiveCourts) reasons.push("No hay pistas activas para programar partidos.")

		if (invalidCourtSlotSettings)
			reasons.push("Hay pistas con configuración inválida de duración u offset.")

		return reasons
	}, [conditionsTeams])

	return { conditionsTeams, disabledReasons }
}
