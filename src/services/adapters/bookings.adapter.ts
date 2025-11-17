import type { Booking, BookingManagement } from "@/models/booking.model"
import type { BookingsRow, BookingWithRelations } from "@/models/dbTypes"
import { clubsAdapterBase } from "./clubs.adapter"
import { courtAdapter } from "./courts.adapter"

export const bookingAdapter = (bookingDB: BookingsRow): Booking => {
	return {
		acceptsMaketing: bookingDB.accepts_maketing,
		acceptsWhatsup: bookingDB.accepts_whatsup,
		checkInCode: bookingDB.check_in_code,
		clubId: bookingDB.club_id,
		courtId: bookingDB.court_id,
		createdAt: bookingDB.created_at,
		date: bookingDB.date, // "yyyy-MM-dd"
		depositPercentage: bookingDB.deposit_percentage,
		endTime: new Date(bookingDB.end_time), // "HH:mm"
		id: bookingDB.id,
		note: bookingDB.note,
		paymentMode: bookingDB.payment_mode,
		paymentStatus: bookingDB.payment_status,
		price: bookingDB.price,
		startTime: new Date(bookingDB.start_time), // "HH:mm"
		status: bookingDB.status,
		updatedAt: bookingDB.updated_at,
		userId: bookingDB.user_id,
	}
}

export const bookingsAdapter = (bookingsDB: BookingsRow[]): Booking[] => {
	return bookingsDB.map((booking) => bookingAdapter(booking))
}

export const bookingManagementAdapter = (
	bookingDB: BookingWithRelations,
): BookingManagement => {
	return {
		acceptsMaketing: bookingDB.accepts_maketing,
		acceptsWhatsup: bookingDB.accepts_whatsup,
		checkInCode: bookingDB.check_in_code,
		clubId: bookingDB.club_id,
		courtId: bookingDB.court_id,
		createdAt: bookingDB.created_at,
		date: bookingDB.date, // "yyyy-MM-dd"
		depositPercentage: bookingDB.deposit_percentage,
		endTime: new Date(bookingDB.end_time), // "HH:mm"
		id: bookingDB.id,
		note: bookingDB.note,
		paymentMode: bookingDB.payment_mode,
		paymentStatus: bookingDB.payment_status,
		price: bookingDB.price,
		startTime: new Date(bookingDB.start_time), // "HH:mm"
		status: bookingDB.status,
		updatedAt: bookingDB.updated_at,
		userId: bookingDB.user_id,
		court: courtAdapter(bookingDB.court),
		club: clubsAdapterBase(bookingDB.club),
	}
}

export const bookingsManagementAdapter = (
	bookingsDB: BookingWithRelations[],
): BookingManagement[] => {
	return bookingsDB.map((booking) => bookingManagementAdapter(booking))
}
