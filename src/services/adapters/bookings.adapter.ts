import type { Booking } from "@/models/booking.model"
import type { BookingsRow } from "@/models/dbTypes"

// Función auxiliar para formatear la hora "HH:MM:SS" -> "HH:MM"
const formatTime = (time: string | null): string | null => {
	if (!time) return null
	return time.slice(11, 16) // "2025-11-12T18:00:00+00:00" -> "18:00"
}

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
		endTime: formatTime(bookingDB.end_time)!, // "HH:mm"
		id: bookingDB.id,
		note: bookingDB.note,
		paymentMode: bookingDB.payment_mode,
		paymentStatus: bookingDB.payment_status,
		price: bookingDB.price,
		startTime: formatTime(bookingDB.start_time)!, // "HH:mm"
		status: bookingDB.status,
		updatedAt: bookingDB.updated_at,
		userId: bookingDB.user_id,
	}
}

export const bookingsAdapter = (bookingsDB: BookingsRow[]): Booking[] => {
	return bookingsDB.map((booking) => bookingAdapter(booking))
}
