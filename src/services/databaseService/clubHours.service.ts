import { supabase } from "@/lib/supabase"
import type {
	ClubHoursInsert,
	ClubHoursRow,
	ClubHoursUpdate,
	Position,
	WeekDay,
} from "@/models/dbTypes"
import { clubHoursAdapter } from "@/services/adapters/clubHours.adapter"

export async function getClubHours(clubId: string) {
	try {
		const { data, error } = await supabase
			.from("club_hours")
			.select("*")
			.eq("club_id", clubId)

		if (error) throw error

		return clubHoursAdapter(data)
	} catch (error) {
		if (error instanceof Error) {
			console.error("Error fetching club hours:", error.message)
		} else {
			console.error("Error fetching club hours:", error)
		}
		throw new Error("No se pudieron obtener los horarios del club.")
	}
}

export async function createClubHour(
	clubHourData: ClubHoursInsert,
): Promise<ClubHoursRow> {
	try {
		const { data, error } = await supabase
			.from("club_hours")
			.insert(clubHourData)
			.select()
			.single()

		if (error) throw error

		return data
	} catch (error) {
		if (error instanceof Error) {
			console.error("Error creating club hour:", error.message)
		} else {
			console.error("Error creating club hour:", error)
		}
		throw new Error("No se pudo crear el horario del club.")
	}
}

export async function updateClubHour(
	clubId: string,
	weekday: WeekDay,
	position: Position,
	clubHourData: ClubHoursUpdate,
): Promise<ClubHoursRow> {
	try {
		const { data, error } = await supabase
			.from("club_hours")
			.update(clubHourData)
			.eq("club_id", clubId)
			.eq("weekday", weekday)
			.eq("position", position)
			.select()
			.single()

		if (error) throw error

		return data
	} catch (error) {
		if (error instanceof Error) {
			console.error("Error updating club hour:", error.message)
		} else {
			console.error("Error updating club hour:", error)
		}
		throw new Error("No se pudo actualizar el horario del club.")
	}
}

export async function deleteClubHour(
	clubId: string,
	weekday: WeekDay,
	position: Position,
): Promise<boolean> {
	try {
		const { error } = await supabase
			.from("club_hours")
			.delete()
			.eq("club_id", clubId)
			.eq("weekday", weekday)
			.eq("position", position)

		if (error) throw error
		return true
	} catch (error) {
		if (error instanceof Error) {
			console.error("Error deleting club hour:", error.message)
		} else {
			console.error("Error deleting club hour:", error)
		}
		throw new Error("No se pudo eliminar el horario del club.")
	}
}
