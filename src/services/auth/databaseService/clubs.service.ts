import { supabase } from "@/lib/supabase"
import type { ClubsInsert, ClubsRow, ClubsUpdate } from "@/models/dbTypes"

export async function getClubs(): Promise<ClubsRow[]> {
	try {
		const { data, error } = await supabase.from("clubs").select("*")

		if (error) throw error

		return data
	} catch (error: any) {
		console.error("Error fetching clubs:", error.message)
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
	} catch (error: any) {
		console.error("Error creating club:", error.message)
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
	} catch (error: any) {
		console.error("Error updating club:", error.message)
		throw new Error("No se pudo actualizar el club.")
	}
}
