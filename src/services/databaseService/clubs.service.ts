import { supabase } from "@/lib/supabase"
import type { ClubsInsert, ClubsRow, ClubsUpdate } from "@/models/dbTypes"
import {
	clubsAdapter,
	clubsAdapterBase,
} from "@/services/adapters/clubs.adapter"

export async function getClubs() {
	try {
		const { data, error } = await supabase.from("clubs").select("*")

		if (error || !data) throw error

		return clubsAdapter(data)
	} catch (error) {
		if (error instanceof Error) {
			console.error("Error fetching clubs:", error.message)
		} else {
			console.error("Error fetching clubs:", error)
		}
		throw new Error("No se pudieron obtener los clubes.")
	}
}
export async function getClubsById(clubId: string) {
	try {
		const { data, error } = await supabase
			.from("clubs")
			.select()
			.eq("id", clubId)
			.single()

		if (error || !data) throw error

		return clubsAdapterBase(data)
	} catch (error) {
		if (error instanceof Error) {
			console.error("Error fetching club by id:", error.message)
		} else {
			console.error("Error fetching club by id:", error)
		}
		throw new Error("No se pudieron obtener los clubes.")
	}
}

export async function createClub(clubData: ClubsInsert): Promise<ClubsRow> {
	try {
		const { data, error } = await supabase
			.from("clubs")
			.insert(clubData)
			.select()
			.single()

		if (error) throw error

		return data
	} catch (error) {
		if (error instanceof Error) {
			console.error("Error creating club:", error.message)
		} else {
			console.error("Error creating club:", error)
		}
		throw new Error("No se pudo crear el club.")
	}
}

export async function updateClub(
	id: string,
	clubData: ClubsUpdate,
): Promise<ClubsRow> {
	try {
		const { data, error } = await supabase
			.from("clubs")
			.update(clubData)
			.eq("id", id)
			.select()
			.single()

		if (error) throw error

		return data
	} catch (error) {
		if (error instanceof Error) {
			console.error("Error updating club:", error.message)
		} else {
			console.error("Error updating club:", error)
		}
		throw new Error("No se pudo actualizar el club.")
	}
}
