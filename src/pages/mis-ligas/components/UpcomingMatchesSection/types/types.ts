import type { StatusMatches } from "@/models/dbTypes"

export interface UpcomingMatchesSectionProps {
	competitionIds?: string[]
	title?: string
	maxItems?: number
	showCompetitionName?: boolean
}

export type UpcomingMatchItem = {
	id: string
	competitionId: string
	competitionName: string
	homeTeamName: string
	awayTeamName: string
	status: StatusMatches
	startTime: string | null
	round: number
	createdAt: string
	startMs: number | null
}
