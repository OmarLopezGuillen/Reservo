import type {
	Enums,
	Tables,
	TablesInsert,
	TablesUpdate,
} from "@/services/types/database.ts"

// ROWS (lectura)
export type BookingsCalendarRow = Tables<"bookings_calendar"> // Tabla de vistas

export type BookingsRow = Tables<"bookings">
export type ClubsRow = Tables<"clubs">
export type ClubHoursRow = Tables<"club_hours">
export type CourtsRow = Tables<"courts">
export type CompetitionsRow = Tables<"competitions">
export type CompetitionCategoriesRow = Tables<"competition_categories">
export type CompetitionRuleTemplatesRow = Tables<"competition_rule_templates">
export type CompetitionRulesRow = Tables<"competition_rules">
export type CompetitionTeamsRow = Tables<"competition_teams">
export type TeamAvailabilitiesRow = Tables<"team_availabilities">
export type CompetitionParticipantsRow = Tables<"competition_participants">
export type MatchesRow = Tables<"matches">

// INSERT (crear)
export type BookingsInsert = TablesInsert<"bookings">
export type ClubsInsert = TablesInsert<"clubs">
export type ClubHoursInsert = TablesInsert<"club_hours">
export type CourtsInsert = TablesInsert<"courts">
export type CompetitionsInsert = TablesInsert<"competitions">
export type CompetitionCategoriesInsert = TablesInsert<"competition_categories">
export type CompetitionRuleTemplatesInsert =
	TablesInsert<"competition_rule_templates">
export type CompetitionRulesInsert = TablesInsert<"competition_rules">
export type CompetitionTeamsInsert = TablesInsert<"competition_teams">
export type TeamAvailabilitiesInsert = TablesInsert<"team_availabilities">
export type CompetitionParticipantsInsert =
	TablesInsert<"competition_participants">
export type MatchesInsert = TablesInsert<"matches">

// UPDATE (parcial)
export type BookingsUpdate = TablesUpdate<"bookings">
export type ClubsUpdate = TablesUpdate<"clubs">
export type ClubHoursUpdate = TablesUpdate<"club_hours">
export type CourtsUpdate = TablesUpdate<"courts">
export type CompetitionsUpdate = TablesUpdate<"competitions">
export type CompetitionCategoriesUpdate = TablesUpdate<"competition_categories">
export type CompetitionRuleTemplatesUpdate =
	TablesUpdate<"competition_rule_templates">
export type CompetitionRulesUpdate = TablesUpdate<"competition_rules">
export type CompetitionTeamsUpdate = TablesUpdate<"competition_teams">
export type TeamAvailabilitiesUpdate = TablesUpdate<"team_availabilities">
export type CompetitionParticipantsUpdate =
	TablesUpdate<"competition_participants">
export type MatchesUpdate = TablesUpdate<"matches">

// Enums útiles
export type AppRole = Enums<"app_role">
export type TypeCourt = Enums<"type_court">
export type StatusBooking = Enums<"status_booking">
export type PaymentStatus = Enums<"payment_status">
export type PaymentMode = Enums<"type_payment_mode">
export type WeekDay = Enums<"weekday">
export type Position = Enums<"position">
export type CompetitionRoundType = Enums<"competition_round_type">
export type CompetitionsStatus = Enums<"competitions_status">
export type CompetitionsType = Enums<"competitions_type">
export type PlayoffType = Enums<"playoff_type">
export type StatusRegistration = Enums<"status_registration">
export type KindMatches = Enums<"kind_matches">
export type PlayoffRound = Enums<"playoff_round">
export type StatusMatches = Enums<"status_matches">

export type BookingWithRelations = BookingsRow & {
	court: CourtsRow
	club: ClubsRow
}

export type CompetitionTeamWithAvailabilityDB = CompetitionTeamsRow & {
	team_availabilities: TeamAvailabilitiesRow[]
}
