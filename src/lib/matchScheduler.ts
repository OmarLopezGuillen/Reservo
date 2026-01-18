import type { TeamAvailability } from "@/models/competition.model"
import type { WeekDay } from "@/models/dbTypes"

export type TeamId = string
export type CategoryId = string

export interface InterfaceMatch {
	home: TeamId
	away: TeamId
}

export type Round = InterfaceMatch[]
export type Schedule = Round[]

// startTime ahora es un array con TODAS las posibles disponibilidades (solapes) en ISO
export interface InterfaceMatchWithStart extends InterfaceMatch {
	startTime: string[]
}

export type ScheduledRound = InterfaceMatchWithStart[]
export type ScheduledSchedule = ScheduledRound[]

export interface TeamAvailabilitiesByTeam {
	teamId: TeamId
	availabilities: TeamAvailability[]
}

/**
 * Nuevo formato por categoría:
 * - jornadas: Schedule (Round[])
 */
export interface CategoryMatches {
	categoryId: CategoryId
	schedule: Schedule
}

export interface CategoryScheduledMatches {
	categoryId: CategoryId
	schedule: ScheduledSchedule
}

interface ScheduleOptions {
	/**
	 * Reference date used to build the concrete datetime. It will be shifted to the
	 * Monday of that week to align with weekday indexes (0 = Monday, 6 = Sunday).
	 * Defaults to the current date if not provided.
	 */
	referenceDate?: Date
}

interface SlotIntersection {
	weekday: number
	startMinutes: number
	endMinutes: number
}

/**
 * NUEVO: devuelve equipos únicos de TODAS las categorías (recorre todas las jornadas y partidos).
 */
export function getUniqueTeamIdsFromSchedule(
	categories: CategoryMatches[],
): TeamId[] {
	const unique = new Set<TeamId>()

	for (const category of categories) {
		for (const round of category.schedule) {
			for (const match of round) {
				unique.add(match.home)
				unique.add(match.away)
			}
		}
	}

	return Array.from(unique)
}

/**
 * NUEVO: asigna startTimes a TODAS las categorías y devuelve:
 * [{ categoriaId, jornadas: ScheduledSchedule }]
 */
export function assignStartTimesToCategoryMatches(
	categories: CategoryMatches[],
	teamAvailabilities: TeamAvailabilitiesByTeam[],
	options: ScheduleOptions = {},
): CategoryScheduledMatches[] {
	const availabilityMap = buildAvailabilityMap(teamAvailabilities)
	const referenceWeekStart = getMonday(options.referenceDate ?? new Date())

	return categories.map((cat) => ({
		categoryId: cat.categoryId,
		schedule: assignStartTimesToScheduleInternal(
			cat.schedule,
			availabilityMap,
			referenceWeekStart,
		),
	}))
}

/** ====== Helpers internos para no recalcular map + monday por cada categoría ====== */

function assignStartTimesToScheduleInternal(
	schedule: Schedule,
	availabilityMap: Map<string, TeamAvailability[]>,
	referenceWeekStart: Date,
): ScheduledSchedule {
	return schedule.map((round) =>
		round.map((match) => {
			const homeAvailability = availabilityMap.get(match.home) ?? []
			const awayAvailability = availabilityMap.get(match.away) ?? []

			const overlaps = findAllOverlaps(homeAvailability, awayAvailability)

			const startTimes = overlaps.map((overlap) => {
				const scheduledDate = addMinutesToDate(
					addDays(referenceWeekStart, overlap.weekday),
					overlap.startMinutes,
				)
				return scheduledDate.toISOString()
			})

			return { ...match, startTime: startTimes }
		}),
	)
}

function buildAvailabilityMap(entries: TeamAvailabilitiesByTeam[]) {
	return entries.reduce<Map<string, TeamAvailability[]>>((map, entry) => {
		map.set(entry.teamId, entry.availabilities)
		return map
	}, new Map())
}

function findAllOverlaps(
	home: TeamAvailability[],
	away: TeamAvailability[],
): SlotIntersection[] {
	if (home.length === 0 || away.length === 0) return []

	const homeByDay = groupByWeekday(home)
	const awayByDay = groupByWeekday(away)

	const overlaps: SlotIntersection[] = []

	for (let weekday = 0; weekday <= 6; weekday++) {
		const homeSlots = sortByStartTime(homeByDay[weekday])
		const awaySlots = sortByStartTime(awayByDay[weekday])

		for (const homeSlot of homeSlots) {
			for (const awaySlot of awaySlots) {
				const start = Math.max(
					timeToMinutes(homeSlot.startTime),
					timeToMinutes(awaySlot.startTime),
				)
				const end = Math.min(
					timeToMinutes(homeSlot.endTime),
					timeToMinutes(awaySlot.endTime),
				)

				if (start < end) {
					overlaps.push({ weekday, startMinutes: start, endMinutes: end })
				}
			}
		}
	}

	// opcional: ordenar por weekday y hora de inicio (para que quede siempre consistente)
	return overlaps.sort(
		(a, b) => a.weekday - b.weekday || a.startMinutes - b.startMinutes,
	)
}

function groupByWeekday(
	availabilities: TeamAvailability[],
): TeamAvailability[][] {
	const days: TeamAvailability[][] = [[], [], [], [], [], [], []]

	availabilities.forEach((availability) => {
		const index = parseInt(availability.weekday as WeekDay, 10)
		if (!Number.isNaN(index)) {
			days[index].push(availability)
		}
	})

	return days
}

function sortByStartTime(
	availabilities: TeamAvailability[],
): TeamAvailability[] {
	return [...availabilities].sort(
		(a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime),
	)
}

function getMonday(date: Date): Date {
	const monday = new Date(date)
	const day = monday.getDay()
	const diff = day === 0 ? -6 : 1 - day
	monday.setDate(monday.getDate() + diff)
	monday.setHours(0, 0, 0, 0)
	return monday
}

function addDays(date: Date, days: number): Date {
	const result = new Date(date)
	result.setDate(result.getDate() + days)
	return result
}

function timeToMinutes(time: string): number {
	const [hours, minutes] = time.split(":").map(Number)
	return hours * 60 + minutes
}

function addMinutesToDate(date: Date, minutes: number): Date {
	const result = new Date(date)
	result.setMinutes(result.getMinutes() + minutes)
	return result
}
