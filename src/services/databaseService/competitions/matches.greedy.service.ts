import { supabase } from "@/lib/supabase"
import type { BusinessDay } from "@/models/business.model"
import type { Match } from "@/models/competition.model"
import type { MatchesInsert, MatchesRow } from "@/models/dbTypes"
import { matchAdapter } from "@/services/adapters/competitions.adapter"

export type TeamId = string

export interface ScheduledInterfaceMatch {
	home: TeamId
	away: TeamId
	startTime: string[] // posibles horas ISO
}
export type ScheduledRound = ScheduledInterfaceMatch[]
export type ScheduledSchedule = ScheduledRound[]

export type GreedyCategorySchedule = {
	categoryId: string
	schedule: ScheduledSchedule
}

type BusyInterval = { startMs: number; endMs: number; courtId: string }

type Unscheduled = {
	categoryId: string
	homeTeamId: string
	awayTeamId: string
	round: number
	matchday: number
	reason: "NO_CANDIDATES" | "NO_SLOT_AVAILABLE"
}

type GreedyParams = {
	competitionId: string
	courts: Array<{
		id: string
		slotDurationMinutes: number
		slotStartOffsetMinutes: number
	}>
	clubHours?: BusinessDay[]
	firstRoundWeekStart: Date
}

function addDaysLocal(date: Date, days: number) {
	const d = new Date(date)
	d.setDate(d.getDate() + days)
	return d
}

// YYYY-MM-DD en LOCAL (importante para no liarla con UTC)
function isoDateLocal(date: Date) {
	const y = date.getFullYear()
	const m = String(date.getMonth() + 1).padStart(2, "0")
	const d = String(date.getDate()).padStart(2, "0")
	return `${y}-${m}-${d}`
}

const KIND: MatchesInsert["kind"] = "regular" as MatchesInsert["kind"]
const STATUS_SCHEDULED: MatchesInsert["status"] =
	"scheduled" as MatchesInsert["status"]
const STATUS_PENDING: MatchesInsert["status"] =
	"pending" as MatchesInsert["status"]

export async function createMatchesGreedyFromCategoriesSchedule(
	categories: GreedyCategorySchedule[],
	params: GreedyParams,
): Promise<{ matches: Match[]; unscheduled: Unscheduled[] }> {
	// 1) Prefetch ocupación de TODAS las pistas
	const candidateTimesMs: number[] = []
	for (const cat of categories) {
		for (const schedule of cat.schedule) {
			for (const m of schedule) {
				for (const iso of m.startTime ?? []) {
					const t = Date.parse(iso)
					if (!Number.isNaN(t)) candidateTimesMs.push(t)
				}
			}
		}
	}

	const busy: BusyInterval[] = []
	const courtIds = params.courts.map((court) => court.id)
	if (candidateTimesMs.length > 0) {
		const minIso = new Date(Math.min(...candidateTimesMs)).toISOString()
		const maxIso = new Date(Math.max(...candidateTimesMs)).toISOString()
		const existing = await getMatchesByCourtsAndRange(courtIds, minIso, maxIso)
		for (const m of existing) {
			if (!m.start_time || !m.end_time) continue
			busy.push({
				courtId: m.court_id,
				startMs: Date.parse(m.start_time),
				endMs: Date.parse(m.end_time),
			})
		}
	}

	const createdMatches: Match[] = []
	const unscheduled: Unscheduled[] = []

	// 2) Iterar categoría → jornada → partido
	for (const cat of categories) {
		const categoryId = cat.categoryId

		for (
			let jornadaIndex = 0;
			jornadaIndex < cat.schedule.length;
			jornadaIndex++
		) {
			const jornada = cat.schedule[jornadaIndex]
			const roundNumber = jornadaIndex + 1
			const matchday = jornadaIndex + 1

			// ✅ lunes de esta jornada (round)
			const roundWeekStart = addDaysLocal(
				params.firstRoundWeekStart,
				jornadaIndex * 7,
			)
			const roundWeekStartDate = isoDateLocal(roundWeekStart)

			for (const m of jornada) {
				const candidates = m.startTime ?? []

				if (candidates.length === 0) {
					const row = await insertMatchRow({
						competitionId: params.competitionId,
						categoryId,
						courtId: null,
						homeTeamId: m.home,
						awayTeamId: m.away,
						round: roundNumber,
						matchday,
						startTime: null,
						endTime: null,
						status: STATUS_PENDING,
						roundWeekStartDate,
					})
					createdMatches.push(matchAdapter(row))
					unscheduled.push({
						categoryId,
						homeTeamId: m.home,
						awayTeamId: m.away,
						round: roundNumber,
						matchday,
						reason: "NO_CANDIDATES",
					})
					continue
				}

				let inserted: MatchesRow | null = null

				// probar cada hora candidata
				for (const startISO of candidates) {
					const startMs = Date.parse(startISO)
					if (Number.isNaN(startMs)) continue

					// probar cada pista en orden respetando su duración/offset
					for (const court of params.courts) {
						const courtId = court.id
						if (!isAlignedToCourtSlot(startMs, court, params.clubHours)) continue
						const endMs = startMs + court.slotDurationMinutes * 60_000
						if (!isCourtFree(busy, courtId, startMs, endMs)) continue

						const endISO = new Date(endMs).toISOString()

						try {
							inserted = await insertMatchRow({
								competitionId: params.competitionId,
								categoryId,
								courtId,
								homeTeamId: m.home,
								awayTeamId: m.away,
								round: roundNumber,
								matchday,
								startTime: startISO,
								endTime: endISO,
								status: STATUS_SCHEDULED,
								roundWeekStartDate,
							})
							busy.push({ courtId, startMs, endMs })
							break
						} catch (e: any) {
							if (isConflictError(e)) {
								busy.push({ courtId, startMs, endMs })
								continue
							}
							throw e
						}
					}

					if (inserted) break // ya encontró hueco
				}

				// sin hueco en ninguna pista ni hora
				if (!inserted) {
					const row = await insertMatchRow({
						competitionId: params.competitionId,
						categoryId,
						courtId: null,
						homeTeamId: m.home,
						awayTeamId: m.away,
						round: roundNumber,
						matchday,
						startTime: null,
						endTime: null,
						status: STATUS_PENDING,
						roundWeekStartDate,
					})
					createdMatches.push(matchAdapter(row))
					unscheduled.push({
						categoryId,
						homeTeamId: m.home,
						awayTeamId: m.away,
						round: roundNumber,
						matchday,
						reason: "NO_SLOT_AVAILABLE",
					})
				} else {
					createdMatches.push(matchAdapter(inserted))
				}
			}
		}
	}

	return { matches: createdMatches, unscheduled }
}

/* ------------------- helpers ------------------- */

async function getMatchesByCourtsAndRange(
	courtIds: string[],
	fromISO: string,
	toISO: string,
) {
	const { data, error } = await supabase
		.from("matches")
		.select("id,court_id,start_time,end_time")
		.in("court_id", courtIds)
		.not("start_time", "is", null)
		.not("end_time", "is", null)
		.gte("start_time", fromISO)
		.lte("start_time", toISO)

	if (error) throw error
	return (data ?? []) as Array<{
		id: string
		court_id: string
		start_time: string | null
		end_time: string | null
	}>
}

function isCourtFree(
	busy: BusyInterval[],
	courtId: string,
	startMs: number,
	endMs: number,
) {
	for (const b of busy) {
		if (b.courtId !== courtId) continue
		if (startMs < b.endMs && b.startMs < endMs) return false // solape
	}
	return true
}

function isAlignedToCourtSlot(
	startMs: number,
	court: { slotDurationMinutes: number; slotStartOffsetMinutes: number },
	clubHours?: BusinessDay[],
) {
	const duration = Math.max(1, court.slotDurationMinutes || 90)
	const offset = Math.max(0, court.slotStartOffsetMinutes || 0)
	const date = new Date(startMs)
	const minuteOfDay = date.getHours() * 60 + date.getMinutes()
	const weekday = getWeekdayIndexMonday(date)
	const dayRanges = getDayOpenRanges(clubHours, weekday)

	// Si no hay configuración de horarios, fallback a la lógica simple.
	if (dayRanges.length === 0) {
		if (minuteOfDay < offset) return false
		return (minuteOfDay - offset) % duration === 0
	}

	for (const range of dayRanges) {
		const anchor = range.startMinutes + offset
		if (minuteOfDay < anchor) continue
		if (minuteOfDay + duration > range.endMinutes) continue
		if ((minuteOfDay - anchor) % duration === 0) return true
	}

	return false
}

function getWeekdayIndexMonday(date: Date) {
	return (date.getDay() + 6) % 7
}

function getDayOpenRanges(clubHours: BusinessDay[] | undefined, weekday: number) {
	if (!clubHours || clubHours.length === 0) return []

	const day = clubHours.find((entry) => weekdayToIndex(entry.weekday) === weekday)
	if (!day || day.closed) return []

	return (day.hours ?? [])
		.map((range) => ({
			startMinutes: timeToMinutes(range.start),
			endMinutes: timeToMinutes(range.end),
		}))
		.filter((range) => range.endMinutes > range.startMinutes)
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

function timeToMinutes(value: string) {
	const [hours, minutes] = value.split(":").map(Number)
	return hours * 60 + minutes
}

async function insertMatchRow(args: {
	competitionId: string
	categoryId: string
	courtId: string | null
	homeTeamId: string
	awayTeamId: string
	round: number
	matchday: number
	startTime: string | null
	endTime: string | null
	status: MatchesInsert["status"]
	roundWeekStartDate: string
}): Promise<MatchesRow> {
	const payload: MatchesInsert = {
		competition_id: args.competitionId,
		category_id: args.categoryId,
		kind: KIND,
		round: args.round,
		playoff_round: null,
		home_team_id: args.homeTeamId,
		away_team_id: args.awayTeamId,
		court_id: args.courtId ?? null,
		start_time: args.startTime,
		end_time: args.endTime,
		status: args.status,
		matchday: args.matchday,
		score_home: null,
		score_away: null,
		winner_team_id: null,
		reported_at: null,
		confirmed_at: null,
		round_week_start_date: args.roundWeekStartDate,
	}

	const { data, error } = await supabase
		.from("matches")
		.insert(payload)
		.select("*")
		.single()

	if (error) throw error
	return data as MatchesRow
}

function isConflictError(e: any) {
	const code = e?.code ?? e?.cause?.code
	return code === "23505" || code === "23P01"
}
