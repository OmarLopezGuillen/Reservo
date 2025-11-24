import type {
	Competition,
	CompetitionCategory,
	CompetitionParticipant,
	CompetitionRule,
	CompetitionRuleTemplate,
	CompetitionTeam,
	CompetitionTeamWithAvailability,
	Match,
	TeamAvailability,
} from "@/models/competition.model"
import type {
	CompetitionCategoriesRow,
	CompetitionParticipantsRow,
	CompetitionRulesRow,
	CompetitionRuleTemplatesRow,
	CompetitionsRow,
	CompetitionTeamsRow,
	CompetitionTeamWithAvailabilityDB,
	MatchesRow,
	TeamAvailabilitiesRow,
} from "@/models/dbTypes"

// Competition
export const competitionAdapter = (db: CompetitionsRow): Competition => ({
	allowDraws: db.allow_draws,
	clubId: db.club_id,
	createdAt: db.created_at,
	description: db.description,
	endDate: db.end_date,
	hasPlayoff: db.has_playoff,
	id: db.id,
	maxTeamsPerCategory: db.max_teams_per_category,
	minAvailabilityDays: db.min_availability_days,
	minAvailabilityHoursPerDay: db.min_availability_hours_per_day,
	name: db.name,
	playoffTeams: db.playoff_teams,
	playoffType: db.playoff_type,
	pointsDraw: db.points_draw,
	pointsLoss: db.points_loss,
	pointsWin: db.points_win,
	registrationEndsAt: db.registration_ends_at,
	registrationStartsAt: db.registration_starts_at,
	roundType: db.round_type,
	rulesId: db.rules_id,
	startDate: db.start_date,
	status: db.status,
	type: db.type,
	updatedAt: db.updated_at,
})

export const competitionsAdapter = (db: CompetitionsRow[]): Competition[] =>
	db.map(competitionAdapter)

// CompetitionCategory
export const competitionCategoryAdapter = (
	db: CompetitionCategoriesRow,
): CompetitionCategory => ({
	id: db.id,
	competitionId: db.competition_id,
	name: db.name,
	maxTeams: db.max_teams,
	createdAt: db.created_at,
	description: db.description,
	minLevel: db.min_level,
	maxLevel: db.max_level,
})

export const competitionCategoriesAdapter = (
	db: CompetitionCategoriesRow[],
): CompetitionCategory[] => db.map(competitionCategoryAdapter)

// CompetitionRuleTemplate
export const competitionRuleTemplateAdapter = (
	db: CompetitionRuleTemplatesRow,
): CompetitionRuleTemplate => ({
	content: db.content,
	createdAt: db.created_at,
	id: db.id,
	isDefault: db.is_default,
	name: db.name,
	type: db.type,
})

export const competitionRuleTemplatesAdapter = (
	db: CompetitionRuleTemplatesRow[],
): CompetitionRuleTemplate[] => db.map(competitionRuleTemplateAdapter)

// CompetitionRule
export const competitionRuleAdapter = (
	db: CompetitionRulesRow,
): CompetitionRule => ({
	competitionId: db.competition_id,
	content: db.content,
	createdAt: db.created_at,
	id: db.id,
	templateId: db.template_id,
	updatedAt: db.updated_at,
	version: db.version,
})

export const competitionRulesAdapter = (
	db: CompetitionRulesRow[],
): CompetitionRule[] => db.map(competitionRuleAdapter)

// TeamAvailability
export const teamAvailabilityAdapter = (
	db: TeamAvailabilitiesRow,
): TeamAvailability => ({
	id: db.id,
	teamId: db.team_id,
	weekday: db.weekday,
	startTime: db.start_time,
	endTime: db.end_time,
	createdAt: db.created_at,
})

export const teamAvailabilitiesAdapter = (
	db: TeamAvailabilitiesRow[],
): TeamAvailability[] => db.map(teamAvailabilityAdapter)

// CompetitionTeam
export const competitionTeamAdapter = (
	db: CompetitionTeamsRow,
): CompetitionTeam => ({
	captainUserId: db.captain_user_id,
	categoryId: db.category_id,
	competitionId: db.competition_id,
	createdAt: db.created_at,
	id: db.id,
	name: db.name,
	player1Name: db.player1_name,
	player1Phone: db.player1_phone,
	player1UserId: db.player1_user_id,
	player2Name: db.player2_name,
	player2Phone: db.player2_phone,
	player2UserId: db.player2_user_id,
	rulesAcceptedAt: db.rules_accepted_at,
	status: db.status,
	updatedAt: db.updated_at,
})

export const competitionTeamsAdapter = (
	db: CompetitionTeamsRow[],
): CompetitionTeam[] => db.map(competitionTeamAdapter)

export const competitionTeamWithAvailabilityAdapter = (
	db: CompetitionTeamWithAvailabilityDB,
): CompetitionTeamWithAvailability => ({
	...competitionTeamAdapter(db),
	availabilities: teamAvailabilitiesAdapter(db.team_availabilities),
})

export const competitionTeamsWithAvailabilityAdapter = (
	db: CompetitionTeamWithAvailabilityDB[],
): CompetitionTeamWithAvailability[] =>
	db.map(competitionTeamWithAvailabilityAdapter)

// CompetitionParticipant
export const competitionParticipantAdapter = (
	db: CompetitionParticipantsRow,
): CompetitionParticipant => ({
	competitionCategoryId: db.competition_categories_id,
	competitionId: db.competition_id,
	createdAt: db.created_at,
	email: db.email,
	id: db.id,
	name: db.name,
	phone: db.phone,
	rulesAcceptedAt: db.rules_accepted_at,
	status: db.status,
	updatedAt: db.updated_at,
	userId: db.user_id,
})

export const competitionParticipantsAdapter = (
	db: CompetitionParticipantsRow[],
): CompetitionParticipant[] => db.map(competitionParticipantAdapter)

// Match
export const matchAdapter = (db: MatchesRow): Match => ({
	awayTeamId: db.away_team_id,
	categoryId: db.category_id,
	competitionId: db.competition_id,
	confirmedAt: db.confirmed_at,
	courtId: db.court_id,
	createdAt: db.created_at,
	endTime: db.end_time,
	homeTeamId: db.home_team_id,
	id: db.id,
	kind: db.kind,
	playoffRound: db.playoff_round,
	reportedAt: db.reported_at,
	round: db.round,
	scoreAway: db.score_away,
	scoreHome: db.score_home,
	startTime: db.start_time,
	status: db.status,
	updatedAt: db.updated_at,
	winnerTeamId: db.winner_team_id,
})

export const matchesAdapter = (db: MatchesRow[]): Match[] =>
	db.map(matchAdapter)
