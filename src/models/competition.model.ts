import type {
	CompetitionRoundType,
	CompetitionsStatus,
	CompetitionsType,
	KindMatches,
	MemberTeamRole,
	PlayoffRound,
	PlayoffType,
	StatusMatches,
	StatusRegistration,
	WeekDay,
} from "./dbTypes"
import type { Role } from "./ROLES.model"

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
	id: string
	competitionId: string
	categoryId: string
	name: string
	status: string
	rulesAcceptedAt: string
	createdAt: string
	createdBy: string
}

export interface CompetitionTeamMember {
	id: string
	teamId: string
	userId: string
	role: MemberTeamRole
	joinedAt: string
	profile: Profile | null
}

export type Profile = {
	userId: string
	name: string
	email: string
	phone: string
	createdAt: string
}

export interface CompetitionTeamWithMemberAndAvailability
	extends CompetitionTeam {
	availabilities: TeamAvailability[]
	members: CompetitionTeamMember[]
}

export interface CompetitionTeamInvite {
	id: string
	teamId: string
	email: string
	role: MemberTeamRole
	token: string
	status: "pending" | "accepted" | "expired"
	createdAt: string
	expiresAt: string
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

export interface Match {
	awayTeamId: string
	categoryId: string
	competitionId: string
	confirmedAt: string | null
	courtId: string | null
	createdAt: string
	endTime: string | null
	homeTeamId: string
	id: string
	kind: KindMatches
	playoffRound: PlayoffRound | null
	reportedAt: string | null
	round: number
	scoreAway: JSON
	scoreHome: JSON
	startTime: string | null
	status: StatusMatches
	updatedAt: string | null
	winnerTeamId: string | null
	roundWeekStartDate: string
}

export type MatchResultStatus = "none" | "reported" | "confirmed" | "disputed"

export type ScoreSets = { sets: number[] } | null

export type MatchWithResult = Match & {
	resultStatus: MatchResultStatus
	reportedScoreHome: ScoreSets
	reportedScoreAway: ScoreSets
	reportedByTeamId: string | null
	disputeReason: string | null
}

export interface CompetitionStanding {
	competitionId: string
	categoryId: string
	teamId: string
	teamName: string
	position: number
	played: number
	won: number
	drawn: number
	lost: number
	setsFor: number
	setsAgainst: number
	setsDiff: number
	points: number
}

export interface ChatThread {
	id: string
	name: string
	matchId: string
	clubId: string
	createdAt: string
	createdBy: string
	needsAdminAttention?: boolean
	needsAdminAttentionAt?: string | null
	needsAdminAttentionMessageId?: string | null
	needsAdminAttentionBy?: string | null
	competitionId: string | null
	competitionName: string | null
}

export interface ChatThreadMember {
	threadId: string
	userId: string
	role: Role
	joinedAt: string
}

export interface ChatMessages {
	id: string
	threadId: string
	userId: string
	body: string
	createdAt: string
	editedAt: string | null
}
