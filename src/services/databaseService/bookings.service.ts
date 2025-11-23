import { supabase } from "@/lib/supabase"
import type {
	Booking,
	BookingCalendar,
	BookingManagement,
} from "@/models/booking.model"
import type {
	BookingsCalendarRow,
	BookingsInsert,
	BookingsUpdate,
} from "@/models/dbTypes"
import {
	bookingAdapter,
	bookingManagementAdapter,
	bookingsAdapter,
	bookingsCalendarAdapter,
	bookingsManagementAdapter,
} from "../adapters/bookings.adapter"

export async function getBookings(clubId: string): Promise<Booking[]> {
	try {
		const { data, error } = await supabase
			.from("bookings")
			.select("*")
			.eq("club_id", clubId)

		if (error) throw error

		return bookingsAdapter(data)
	} catch (error) {
		if (error instanceof Error) {
			console.error("Error fetching bookings:", error.message)
		} else {
			console.error("Error fetching bookings:", error)
		}
		throw new Error("No se pudieron obtener las reservas.")
	}
}

export async function getBookingsCalendar(
	clubId: string,
): Promise<BookingCalendar[]> {
	try {
		const { data, error } = await supabase
			.from("bookings_calendar")
			.select("*")
			.eq("club_id", clubId)

		if (error) throw error

		return bookingsCalendarAdapter(data)
	} catch (error) {
		if (error instanceof Error) {
			console.error("Error fetching bookings calendar:", error.message)
		} else {
			console.error("Error fetching bookings calendar:", error)
		}
		throw new Error("No se pudieron obtener las reservas.")
	}
}

export async function getBookingById(id: string): Promise<Booking> {
	try {
		const { data, error } = await supabase
			.from("bookings")
			.select("*")
			.eq("id", id)
			.single()

		if (error) throw error

		return bookingAdapter(data)
	} catch (error) {
		if (error instanceof Error) {
			console.error("Error fetching booking by id:", error.message)
		} else {
			console.error("Error fetching booking by id:", error)
		}
		throw new Error("No se pudo obtener la reserva.")
	}
}

export async function getMyBookingById(id: string): Promise<BookingManagement> {
	try {
		const { data, error } = await supabase
			.from("bookings")
			.select(`*, court:courts (*), club:clubs (*)`)
			.eq("id", id)
			.single()

		if (error) throw error

		// Usamos el adaptador para un solo objeto con relaciones
		return bookingManagementAdapter(data)
	} catch (error) {
		if (error instanceof Error) {
			console.error(
				"Error fetching booking with relations by id:",
				error.message,
			)
		} else {
			console.error("Error fetching booking with relations by id:", error)
		}
		throw new Error("No se pudo obtener la reserva con sus detalles.")
	}
}

export async function getMyBookings(
	userId: string,
): Promise<BookingManagement[]> {
	try {
		const { data, error } = await supabase
			.from("bookings")
			.select(`*, court:courts (*), club:clubs (*)`)
			.eq("user_id", userId)
			.order("date", { ascending: false })
			.order("start_time", { ascending: false })

		if (error) throw error

		return bookingsManagementAdapter(data)
	} catch (error) {
		if (error instanceof Error) {
			console.error("Error fetching user bookings:", error.message)
		} else {
			console.error("Error fetching user bookings:", error)
		}
		throw new Error("No se pudieron obtener las reservas del usuario.")
	}
}

export async function createBooking(
	bookingData: BookingsInsert,
): Promise<Booking> {
	try {
		const { data, error } = await supabase
			.from("bookings")
			.insert(bookingData)
			.select()
			.single()

		if (error) throw error

		return bookingAdapter(data)
	} catch (error) {
		if (error instanceof Error) {
			console.error("Error creating booking:", error.message)
		} else {
			console.error("Error creating booking:", error)
		}
		throw new Error("No se pudo crear la reserva.")
	}
}

export async function updateBooking(
	id: string,
	bookingData: BookingsUpdate,
): Promise<Booking> {
	try {
		const { data, error } = await supabase
			.from("bookings")
			.update(bookingData)
			.eq("id", id)
			.select()
			.single()

		if (error) throw error

		return bookingAdapter(data)
	} catch (error) {
		if (error instanceof Error) {
			console.error("Error updating booking:", error.message)
		} else {
			console.error("Error updating booking:", error)
		}
		throw new Error("No se pudo actualizar la reserva.")
	}
}

export async function deleteBooking(id: string): Promise<boolean> {
	try {
		const { error } = await supabase.from("bookings").delete().eq("id", id)
		if (error) throw error
		return true
	} catch (error) {
		if (error instanceof Error) {
			console.error("Error deleting booking:", error.message)
		} else {
			console.error("Error deleting booking:", error)
		}
		throw new Error("No se pudo eliminar la reserva.")
	}
}
