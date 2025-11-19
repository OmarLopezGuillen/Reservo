import type {
	Enums,
	Tables,
	TablesInsert,
	TablesUpdate,
} from "@/services/types/database.ts"

// ROWS (lectura)
export type BookingsRow = Tables<"bookings">
export type ClubsRow = Tables<"clubs">
export type ClubHoursRow = Tables<"club_hours">
export type CourtsRow = Tables<"courts">
export type BookingsCalendarRow = Tables<"bookings_calendar">

// INSERT (crear)
export type BookingsInsert = TablesInsert<"bookings">
export type ClubsInsert = TablesInsert<"clubs">
export type ClubHoursInsert = TablesInsert<"club_hours">
export type CourtsInsert = TablesInsert<"courts">

// UPDATE (parcial)
export type BookingsUpdate = TablesUpdate<"bookings">
export type ClubsUpdate = TablesUpdate<"clubs">
export type ClubHoursUpdate = TablesUpdate<"club_hours">
export type CourtsUpdate = TablesUpdate<"courts">

// Enums útiles
export type AppRole = Enums<"app_role">
export type TypeCourt = Enums<"type_court">
export type StatusBooking = Enums<"status_booking">
export type PaymentStatus = Enums<"payment_status">
export type PaymentMode = Enums<"type_payment_mode">
export type WeekDay = Enums<"weekday">
export type Position = Enums<"position">

export type BookingWithRelations = BookingsRow & {
	court: CourtsRow
	club: ClubsRow
}
