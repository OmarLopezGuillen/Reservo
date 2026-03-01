import type { BusinessDay } from "@/models/business.model"
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

export interface CourtSlotRule {
	slotDurationMinutes: number
	slotStartOffsetMinutes: number
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
	firstRoundWeekStart?: Date
	courtSlotRules?: CourtSlotRule[]
	clubHours?: BusinessDay[]
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

	const today = options.referenceDate ?? new Date()

	// 👇 antes era fijo addDays(getMonday(today), 7)
	const referenceWeekStart =
		options.firstRoundWeekStart ?? addDays(getMonday(today), 7)

	return categories.map((cat) => ({
		categoryId: cat.categoryId,
		schedule: assignStartTimesToScheduleInternal(
			cat.schedule,
			availabilityMap,
			referenceWeekStart,
			options.courtSlotRules ?? [],
			options.clubHours ?? [],
		),
	}))
}

/** ====== Helpers internos para no recalcular map + monday por cada categoría ====== */

function assignStartTimesToScheduleInternal(
	schedule: Schedule,
	availabilityMap: Map<string, TeamAvailability[]>,
	referenceWeekStart: Date,
	courtSlotRules: CourtSlotRule[],
	clubHours: BusinessDay[],
): ScheduledSchedule {
	return schedule.map((round, roundIndex) =>
		round.map((match) => {
			const homeAvailability = availabilityMap.get(match.home) ?? []
			const awayAvailability = availabilityMap.get(match.away) ?? []

			const overlaps = findAllOverlaps(homeAvailability, awayAvailability)
			const weekStartForRound = addDays(referenceWeekStart, roundIndex * 7)
			const startTimes =
				courtSlotRules.length > 0
					? buildStartTimesFromOverlaps(
							overlaps,
							weekStartForRound,
							courtSlotRules,
							clubHours,
						)
					: overlaps.map((overlap) => {
							const scheduledDate = addMinutesToDate(
								addDays(weekStartForRound, overlap.weekday),
								overlap.startMinutes,
							)
							return scheduledDate.toISOString()
						})

			return { ...match, startTime: startTimes }
		}),
	)
}

function buildStartTimesFromOverlaps(
	overlaps: SlotIntersection[],
	weekStartForRound: Date,
	courtSlotRules: CourtSlotRule[],
	clubHours: BusinessDay[],
): string[] {
	const starts = new Set<number>()
	const rangesByWeekday = buildClubOpenRangesByWeekday(clubHours)

	for (const overlap of overlaps) {
		for (const rule of courtSlotRules) {
			const duration = Math.max(1, rule.slotDurationMinutes || 90)
			const offset = Math.max(0, rule.slotStartOffsetMinutes || 0)
			const dayRanges = rangesByWeekday[overlap.weekday]

			// Si no hay horario de club, fallback al comportamiento previo.
			if (dayRanges.length === 0) {
				let startMinutes = firstAlignedStart(overlap.startMinutes, offset, duration)

				while (startMinutes + duration <= overlap.endMinutes) {
					const scheduledDate = addMinutesToDate(
						addDays(weekStartForRound, overlap.weekday),
						startMinutes,
					)
					starts.add(scheduledDate.getTime())
					startMinutes += duration
				}
				continue
			}

			for (const range of dayRanges) {
				const intersectionStart = Math.max(overlap.startMinutes, range.startMinutes)
				const intersectionEnd = Math.min(overlap.endMinutes, range.endMinutes)
				const rangeAnchor = range.startMinutes + offset
				let startMinutes = firstAlignedStart(
					intersectionStart,
					rangeAnchor,
					duration,
				)

				while (startMinutes + duration <= intersectionEnd) {
					const scheduledDate = addMinutesToDate(
						addDays(weekStartForRound, overlap.weekday),
						startMinutes,
					)
					starts.add(scheduledDate.getTime())
					startMinutes += duration
				}
			}
		}
	}

	return [...starts]
		.sort((a, b) => a - b)
		.map((timestamp) => new Date(timestamp).toISOString())
}

function firstAlignedStart(
	startMinutes: number,
	offsetMinutes: number,
	durationMinutes: number,
): number {
	if (startMinutes <= offsetMinutes) return offsetMinutes
	const delta = startMinutes - offsetMinutes
	const slots = Math.ceil(delta / durationMinutes)
	return offsetMinutes + slots * durationMinutes
}

function buildClubOpenRangesByWeekday(clubHours: BusinessDay[]) {
	const result: Array<Array<{ startMinutes: number; endMinutes: number }>> = [
		[],
		[],
		[],
		[],
		[],
		[],
		[],
	]

	for (const day of clubHours) {
		const weekday = weekdayToIndex(day.weekday)
		if (weekday === null || day.closed) continue

		result[weekday] = (day.hours ?? [])
			.map((hourRange) => ({
				startMinutes: timeToMinutes(hourRange.start),
				endMinutes: timeToMinutes(hourRange.end),
			}))
			.filter((range) => range.endMinutes > range.startMinutes)
			.sort((a, b) => a.startMinutes - b.startMinutes)
	}

	return result
}

function weekdayToIndex(weekday: string): number | null {
	const normalized = weekday.toLowerCase()
	const map: Record<string, number> = {
		lunes: 0,
		martes: 1,
		miercoles: 2,
		miércoles: 2,
		jueves: 3,
		viernes: 4,
		sabado: 5,
		sábado: 5,
		domingo: 6,
	}
	return map[normalized] ?? null
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
