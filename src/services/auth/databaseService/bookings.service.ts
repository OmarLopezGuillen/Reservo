import { supabase } from "@/lib/supabase"
import type {
	BookingsInsert,
	BookingsRow,
	BookingsUpdate,
} from "@/models/dbTypes"

export async function getBookings(clubId: string): Promise<BookingsRow[]> {
	try {
		const { data, error } = await supabase
			.from("bookings")
			.select("*")
			.eq("club_id", clubId)

		if (error) throw error

		return data
	} catch (error: any) {
		console.error("Error fetching bookings:", error.message)
		throw new Error("No se pudieron obtener las reservas.")
	}
}

export async function getBookingById(id: string): Promise<BookingsRow> {
	try {
		const { data, error } = await supabase
			.from("bookings")
			.select("*")
			.eq("id", id)
			.single()

		if (error) throw error

		return data
	} catch (error: any) {
		console.error("Error fetching booking by id:", error.message)
		throw new Error("No se pudo obtener la reserva.")
	}
}

export async function createBooking(
	bookingData: BookingsInsert,
): Promise<BookingsRow> {
	try {
		const { data, error } = await supabase
			.from("bookings")
			.insert(bookingData)
			.select()
			.single()

		if (error) throw error

		return data
	} catch (error: any) {
		console.error("Error creating booking:", error.message)
		throw new Error("No se pudo crear la reserva.")
	}
}

export async function updateBooking(
	id: string,
	bookingData: BookingsUpdate,
): Promise<BookingsRow> {
	try {
		const { data, error } = await supabase
			.from("bookings")
			.update(bookingData)
			.eq("id", id)
			.select()
			.single()

		if (error) throw error

		return data
	} catch (error: any) {
		console.error("Error updating booking:", error.message)
		throw new Error("No se pudo actualizar la reserva.")
	}
}

export async function deleteBooking(id: string): Promise<boolean> {
	try {
		const { error } = await supabase.from("bookings").delete().eq("id", id)
		if (error) throw error
		return true
	} catch (error: any) {
		console.error("Error deleting booking:", error.message)
		throw new Error("No se pudo eliminar la reserva.")
	}
}
