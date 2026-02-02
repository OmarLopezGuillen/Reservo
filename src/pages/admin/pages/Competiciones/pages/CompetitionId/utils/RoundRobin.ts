import type { Competition, CompetitionTeam } from "@/models/competition.model"

type TeamId = string
type Bye = "BYE"
type Slot = TeamId | Bye

interface Match {
	home: TeamId
	away: TeamId
}

type Round = Match[]
type Schedule = Round[]

type CategorySchedule = {
	categoryId: string
	schedule: Schedule
}

type roundRobin = Competition["roundType"]

/**
 * Función para agrupar equipos por categoría
 */
function groupTeamsByCategory(
	teams: readonly CompetitionTeam[],
): Record<string, CompetitionTeam[]> {
	return teams.reduce<Record<string, CompetitionTeam[]>>((acc, team) => {
		acc[team.categoryId] ??= []
		acc[team.categoryId].push(team)
		return acc
	}, {})
}

/**
 * Genera un calendario round-robin simple (todos contra todos una vez)
 */
export function singleRoundRobin(teams: readonly TeamId[]): Schedule {
	const slots: Slot[] = [...teams]

	// Añadimos BYE si es impar
	if (slots.length % 2 !== 0) {
		slots.push("BYE")
	}

	const totalTeams = slots.length
	const totalRounds = totalTeams - 1
	const rounds: Schedule = []

	for (let roundIndex = 0; roundIndex < totalRounds; roundIndex++) {
		const round: Round = []

		for (let i = 0; i < totalTeams / 2; i++) {
			const a = slots[i]
			const b = slots[totalTeams - 1 - i]

			if (a === "BYE" || b === "BYE") continue

			const isOddRound = roundIndex % 2 === 1

			round.push({
				home: isOddRound ? b : a,
				away: isOddRound ? a : b,
			})
		}

		rounds.push(round)
		rotateSlots(slots)
	}

	return rounds
}

/**
 * Genera un calendario ida y vuelta
 */
export function doubleRoundRobin(teams: readonly TeamId[]): Schedule {
	const firstLeg = singleRoundRobin(teams)

	const secondLeg: Schedule = firstLeg.map((round) =>
		round.map(({ home, away }) => ({
			home: away,
			away: home,
		})),
	)

	return [...firstLeg, ...secondLeg]
}

/**
 * Rota los equipos dejando fijo el primero (algoritmo round-robin clásico)
 */
function rotateSlots(slots: Slot[]): void {
	const last = slots.pop()
	if (last) {
		slots.splice(1, 0, last)
	}
}

export function generateSchedulesByCategory(
	teams: readonly CompetitionTeam[],
	type: roundRobin,
): CategorySchedule[] {
	const teamsByCategory = groupTeamsByCategory(teams)

	return Object.entries(teamsByCategory).map(([categoryId, categoryTeams]) => {
		const teamIds = categoryTeams.map((team) => team.id)

		return {
			categoryId,
			schedule:
				type === "single_round_robin"
					? singleRoundRobin(teamIds)
					: doubleRoundRobin(teamIds),
		}
	})
}
