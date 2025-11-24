import type {
	CompetitionRoundType,
	CompetitionsStatus,
	CompetitionsType,
	KindMatches,
	PlayoffRound,
	PlayoffType,
	StatusMatches,
	StatusRegistration,
	WeekDay,
} from "./dbTypes"

export interface Competition {
	id: string
	clubId: string
	name: string
	description: string | null
	type: CompetitionsType
	status: CompetitionsStatus
	startDate: string
	endDate: string
	registrationStartsAt: string | null
	registrationEndsAt: string | null
	createdAt: string
	updatedAt: string | null
	rulesId: string | null
	roundType: CompetitionRoundType | null
	pointsWin: number | null
	pointsLoss: number | null
	pointsDraw: number | null
	allowDraws: boolean | null
	hasPlayoff: boolean | null
	playoffTeams: number | null
	playoffType: PlayoffType | null
	maxTeamsPerCategory: number
	minAvailabilityDays: number
	minAvailabilityHoursPerDay: number
}

export interface CompetitionCategory {
	id: string
	competitionId: string
	name: string
	maxTeams: number | null
	createdAt: string
	description: string | null
}

export interface CompetitionRuleTemplate {
	content: string
	createdAt: string
	id: string
	isDefault: boolean
	name: string
	type: CompetitionsType
}

export interface CompetitionRule {
	competitionId: string
	content: string
	createdAt: string
	id: string
	templateId: string | null
	updatedAt: string | null
	version: number
}

export interface TeamAvailability {
	id: string
	teamId: string
	weekday: WeekDay
	startTime: string
	endTime: string
	createdAt: string
}

export interface CompetitionTeam {
	captainUserId: string
	categoryId: string
	competitionId: string
	createdAt: string
	id: string
	name: string
	player1Name: string
	player1Phone: string
	player1UserId: string | null
	player2Name: string
	player2Phone: string
	player2UserId: string
	rulesAcceptedAt: string | null
	status: string
	updatedAt: string | null
}

export interface CompetitionTeamWithAvailability extends CompetitionTeam {
	availabilities: TeamAvailability[]
}

export interface CompetitionParticipant {
	competitionCategoryId: string
	competitionId: string
	createdAt: string
	email: string
	id: string
	name: string
	phone: string | null
	rulesAcceptedAt: string
	status: StatusRegistration
	updatedAt: string | null
	userId: string
}
//Lo pasamos a camelCase cada atributo
export interface Match {
	awayTeamId: string
	categoryId: string
	competitionId: string
	confirmedAt: string | null
	courtId: string
	createdAt: string
	endTime: string
	homeTeamId: string
	id: string
	kind: KindMatches
	playoffRound: PlayoffRound | null
	reportedAt: string | null
	round: number
	scoreAway: number | null
	scoreHome: number | null
	startTime: string
	status: StatusMatches
	updatedAt: string | null
	winnerTeamId: string | null
}
