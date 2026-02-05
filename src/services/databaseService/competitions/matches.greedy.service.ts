import { supabase } from "@/lib/supabase"
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
	courtIds: string[]
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

const MATCH_DURATION_MINUTES = 90
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
	if (candidateTimesMs.length > 0) {
		const minIso = new Date(Math.min(...candidateTimesMs)).toISOString()
		const maxIso = new Date(Math.max(...candidateTimesMs)).toISOString()
		const existing = await getMatchesByCourtsAndRange(
			params.courtIds,
			minIso,
			maxIso,
		)
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
					const endMs = startMs + MATCH_DURATION_MINUTES * 60_000

					// probar cada pista en orden
					for (const courtId of params.courtIds) {
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
