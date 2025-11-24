import { supabase } from "@/lib/supabase"
import type { Competition } from "@/models/competition.model"
import type { CompetitionsInsert, CompetitionsUpdate } from "@/models/dbTypes"
import {
	competitionAdapter,
	competitionsAdapter,
} from "@/services/adapters/competitions.adapter"

const TABLE_NAME = "competitions"

export async function getCompetitionById(id: string): Promise<Competition> {
	try {
		const { data, error } = await supabase
			.from(TABLE_NAME)
			.select("*")
			.eq("id", id)
			.single()

		if (error) throw error
		return competitionAdapter(data)
	} catch (error) {
		if (error instanceof Error) {
			console.error("Error getting competition by id:", error.message)
		} else {
			console.error("Error getting competition by id:", error)
		}
		throw new Error("No se pudo obtener la competición.")
	}
}

export async function getCompetitionsByClubId(
	clubId: string,
): Promise<Competition[]> {
	try {
		const { data, error } = await supabase
			.from(TABLE_NAME)
			.select("*")
			.eq("club_id", clubId)

		if (error) throw error
		return competitionsAdapter(data)
	} catch (error) {
		if (error instanceof Error) {
			console.error("Error getting competitions by club id:", error.message)
		} else {
			console.error("Error getting competitions by club id:", error)
		}
		throw new Error("No se pudieron obtener las competiciones del club.")
	}
}

export async function createCompetition(
	competition: CompetitionsInsert,
): Promise<Competition> {
	try {
		const { data, error } = await supabase
			.from(TABLE_NAME)
			.insert(competition)
			.select()
			.single()

		if (error) throw error
		return competitionAdapter(data)
	} catch (error) {
		if (error instanceof Error) {
			console.error("Error creating competition:", error.message)
		} else {
			console.error("Error creating competition:", error)
		}
		throw new Error("No se pudo crear la competición.")
	}
}

export async function updateCompetition(
	id: string,
	competition: CompetitionsUpdate,
): Promise<Competition> {
	try {
		const { data, error } = await supabase
			.from(TABLE_NAME)
			.update(competition)
			.eq("id", id)
			.select()
			.single()

		if (error) throw error
		return competitionAdapter(data)
	} catch (error) {
		if (error instanceof Error) {
			console.error("Error updating competition:", error.message)
		} else {
			console.error("Error updating competition:", error)
		}
		throw new Error("No se pudo actualizar la competición.")
	}
}

export async function deleteCompetition(id: string): Promise<boolean> {
	try {
		const { error } = await supabase.from(TABLE_NAME).delete().eq("id", id)

		if (error) throw error
		return true
	} catch (error) {
		if (error instanceof Error) {
			console.error("Error deleting competition:", error.message)
		} else {
			console.error("Error deleting competition:", error)
		}
		throw new Error("No se pudo eliminar la competición.")
	}
}
