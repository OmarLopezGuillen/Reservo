import type { TeamAvailability } from "@/models/competition.model"
import type { WeekDay } from "@/models/dbTypes"

export type TeamId = string

export interface InterfaceMatch {
	home: TeamId
	away: TeamId
}

export type Round = InterfaceMatch[]
export type Schedule = Round[]

export interface InterfaceMatchWithStart extends InterfaceMatch {
	startTime: string | null
}

export type ScheduledRound = InterfaceMatchWithStart[]
export type ScheduledSchedule = ScheduledRound[]

export interface TeamAvailabilitiesByTeam {
	teamId: TeamId
	availabilities: TeamAvailability[]
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
}

export function getUniqueTeamIdsFromSchedule(schedule: Schedule): TeamId[] {
	const [firstRound] = schedule
	if (!firstRound) return []

	const unique = new Set<TeamId>()

	firstRound.forEach((match) => {
		unique.add(match.home)
		unique.add(match.away)
	})

	return Array.from(unique)
}

/**
 * Assigns start times to a schedule (rounds of matches) based on the overlapping availability of
 * each team.
 *
 * The algorithm picks the earliest common slot by ordering weekdays from Monday (0) to Sunday (6)
 * and, within each day, selecting the smallest intersecting start time. If no overlap exists for a
 * match, its startTime is set to null.
 */
export function assignStartTimesToSchedule(
	schedule: Schedule,
	teamAvailabilities: TeamAvailabilitiesByTeam[],
	options: ScheduleOptions = {},
): ScheduledSchedule {
	const availabilityMap = buildAvailabilityMap(teamAvailabilities)
	const referenceWeekStart = getMonday(options.referenceDate ?? new Date())

	return schedule.map((round) =>
		round.map((match) => {
			const homeAvailability = availabilityMap.get(match.home) ?? []
			const awayAvailability = availabilityMap.get(match.away) ?? []
			const overlap = findEarliestOverlap(homeAvailability, awayAvailability)

			if (!overlap) {
				return { ...match, startTime: null }
			}

			const scheduledDate = addMinutesToDate(
				addDays(referenceWeekStart, overlap.weekday),
				overlap.startMinutes,
			)

			return { ...match, startTime: scheduledDate.toISOString() }
		}),
	)
}

function buildAvailabilityMap(entries: TeamAvailabilitiesByTeam[]) {
	return entries.reduce<Map<string, TeamAvailability[]>>((map, entry) => {
		map.set(entry.teamId, entry.availabilities)
		return map
	}, new Map())
}

function findEarliestOverlap(
	home: TeamAvailability[],
	away: TeamAvailability[],
): SlotIntersection | null {
	if (home.length === 0 || away.length === 0) return null

	const homeByDay = groupByWeekday(home)
	const awayByDay = groupByWeekday(away)

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
					return { weekday, startMinutes: start }
				}
			}
		}
	}

	return null
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
