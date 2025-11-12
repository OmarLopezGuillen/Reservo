import { supabase } from "@/lib/supabase"
import type { Court } from "@/models/court.model"
import type { CourtsInsert, CourtsUpdate } from "@/models/dbTypes"
import { courtAdapter, courtsAdapter } from "../adapters/courts.adapter"

export async function getCourts(clubId: string): Promise<Court[]> {
	try {
		const { data, error } = await supabase
			.from("courts")
			.select("*")
			.eq("club_id", clubId)

		if (error) throw error

		return courtsAdapter(data)
	} catch (error: any) {
		console.error("Error fetching courts:", error.message)
		throw new Error("No se pudieron obtener las canchas.")
	}
}

export async function getCourtById(id: string): Promise<Court> {
	try {
		const { data, error } = await supabase
			.from("courts")
			.select("*")
			.eq("id", id)
			.single()

		if (error) throw error

		return courtAdapter(data)
	} catch (error: any) {
		console.error("Error fetching court by id:", error.message)
		throw new Error("No se pudo obtener la cancha.")
	}
}

export async function createCourt(courtData: CourtsInsert): Promise<Court> {
	try {
		const { data, error } = await supabase
			.from("courts")
			.insert(courtData)
			.select()
			.single()

		if (error) throw error

		return courtAdapter(data)
	} catch (error: any) {
		console.error("Error creating court:", error.message)
		throw new Error("No se pudo crear la cancha.")
	}
}

export async function updateCourt(
	id: string,
	courtData: CourtsUpdate,
): Promise<Court> {
	try {
		const { data, error } = await supabase
			.from("courts")
			.update(courtData)
			.eq("id", id)
			.select()
			.single()

		if (error) throw error

		return courtAdapter(data)
	} catch (error: any) {
		console.error("Error updating court:", error.message)
		throw new Error("No se pudo actualizar la cancha.")
	}
}

export async function deleteCourt(id: string): Promise<boolean> {
	try {
		const { error } = await supabase.from("courts").delete().eq("id", id)

		if (error) throw error
		return true
	} catch (error: any) {
		console.error("Error deleting court:", error.message)
		throw new Error("No se pudo eliminar la cancha.")
	}
}
