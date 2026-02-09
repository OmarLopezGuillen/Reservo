import type {
	ChatThread,
	Competition,
	CompetitionCategory,
	CompetitionParticipant,
	CompetitionRule,
	CompetitionRuleTemplate,
	CompetitionStanding,
	CompetitionTeam,
	CompetitionTeamInvite,
	CompetitionTeamMember,
	CompetitionTeamWithMemberAndAvailability,
	Match,
	Profile,
	TeamAvailability,
} from "@/models/competition.model"
import type {
	ChatThreadsRow,
	CompetitionCategoriesRow,
	CompetitionParticipantsRow,
	CompetitionRulesRow,
	CompetitionRuleTemplatesRow,
	CompetitionStandingsRow,
	CompetitionsRow,
	CompetitionTeamInvitesRow,
	CompetitionTeamMembersRow,
	CompetitionTeamsRow,
	CompetitionTeamWithMembersAndAvailabilityDB,
	MatchesRow,
	ProfilesRow,
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
	weekday: db.weekday as TeamAvailability["weekday"],
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
	categoryId: db.category_id,
	competitionId: db.competition_id,
	createdAt: db.created_at,
	id: db.id,
	name: db.name,
	rulesAcceptedAt: db.rules_accepted_at,
	status: db.status,
	createdBy: db.created_by,
})

export const competitionTeamsAdapter = (
	db: CompetitionTeamsRow[],
): CompetitionTeam[] => db.map(competitionTeamAdapter)

// CompetitionTeamMembers
export const competitionTeamMemberAdapter = (
	db: CompetitionTeamMembersRow & { profiles: ProfilesRow | null },
): CompetitionTeamMember => ({
	id: db.id,
	teamId: db.team_id,
	userId: db.user_id,
	role: db.role,
	joinedAt: db.joined_at,
	profile: db.profiles ? profileAdapter(db.profiles) : null,
})

export const competitionTeamMembersAdapter = (
	db: (CompetitionTeamMembersRow & { profiles: ProfilesRow | null })[],
): CompetitionTeamMember[] => db.map(competitionTeamMemberAdapter)

// Profile
export const profileAdapter = (db: ProfilesRow): Profile => ({
	userId: db.user_id,
	name: db.name,
	email: db.email,
	phone: db.phone,
	createdAt: db.created_at,
})

export const profilesAdapter = (db: ProfilesRow[]): Profile[] =>
	db.map(profileAdapter)

// CompetitionTeamWithMemberAndAvailability
export const competitionTeamWithMemberAndAvailabilityAdapter = (
	db: CompetitionTeamWithMembersAndAvailabilityDB,
): CompetitionTeamWithMemberAndAvailability => ({
	...competitionTeamAdapter(db),
	availabilities: teamAvailabilitiesAdapter(db.team_availabilities),
	members: competitionTeamMembersAdapter(db.competition_team_members ?? []),
})

export const competitionTeamWithMemberAndAvailabilitiesAdapter = (
	db: CompetitionTeamWithMembersAndAvailabilityDB[],
): CompetitionTeamWithMemberAndAvailability[] =>
	db.map(competitionTeamWithMemberAndAvailabilityAdapter)

// CompetitionTeamMembers
export const competitionTeamInviteAdapter = (
	db: CompetitionTeamInvitesRow,
): CompetitionTeamInvite => ({
	id: db.id,
	teamId: db.team_id,
	email: db.email,
	role: db.role,
	token: db.token,
	status: db.status,
	createdAt: db.created_at,
	expiresAt: db.expires_at,
})

export const competitionTeamInvitesAdapter = (
	db: CompetitionTeamInvitesRow[],
): CompetitionTeamInvite[] => db.map(competitionTeamInviteAdapter)

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
	roundWeekStartDate: db.round_week_start_date,
})

export const matchesAdapter = (db: MatchesRow[]): Match[] =>
	db.map(matchAdapter)

const requiredString = (v: string | null | undefined, field: string) => {
	if (!v) throw new Error(`competition_standings: ${field} es null`)
	return v
}

const n0 = (v: number | null | undefined) => v ?? 0

export const competitionStandingAdapter = (
	db: CompetitionStandingsRow,
): CompetitionStanding => ({
	competitionId: requiredString(db.competition_id, "competition_id"),
	categoryId: requiredString(db.category_id, "category_id"),
	teamId: requiredString(db.team_id, "team_id"),
	teamName: requiredString(db.team_name, "team_name"),

	position: n0(db.position),
	played: n0(db.played),
	won: n0(db.won),
	drawn: n0(db.drawn),
	lost: n0(db.lost),

	setsFor: n0(db.sets_for),
	setsAgainst: n0(db.sets_against),
	setsDiff: n0(db.sets_diff),

	points: n0(db.points),
})

export const competitionStandingsAdapter = (
	rows: CompetitionStandingsRow[],
): CompetitionStanding[] => rows.map(competitionStandingAdapter)

export const chatThreadAdapter = (db: ChatThreadsRow): ChatThread => ({
	id: db.id,
	name: db.name,
	matchId: db.match_id,
	clubId: db.club_id,
	createdAt: db.created_at,
	createdBy: db.created_by,
	needsAdminAttention: db.needs_admin_attention,
	needsAdminAttentionAt: db.needs_admin_attention_at,
	needsAdminAttentionMessageId: db.needs_admin_attention_message_id,
	needsAdminAttentionBy: db.needs_admin_attention_by,
})

export const chatThreadsAdapter = (db: ChatThreadsRow[]): ChatThread[] =>
	db.map(chatThreadAdapter)
