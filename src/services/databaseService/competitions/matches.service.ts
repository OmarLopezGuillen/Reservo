import { supabase } from "@/lib/supabase"
import type { Match } from "@/models/competition.model"
import type { MatchesInsert, MatchesUpdate } from "@/models/dbTypes"
import {
	matchAdapter,
	matchesAdapter,
} from "@/services/adapters/competitions.adapter"

const TABLE_NAME = "matches"

export async function getMatchById(id: string): Promise<Match> {
	try {
		const { data, error } = await supabase
			.from(TABLE_NAME)
			.select("*")
			.eq("id", id)
			.single()

		if (error) throw error
		return matchAdapter(data)
	} catch (error) {
		if (error instanceof Error) {
		} else {
			console.error("Error getting match by id:", error)
		}
		throw new Error("No se pudo obtener el partido.")
	}
}

export async function getMatchesByCompetitionId(
	competitionId: string,
): Promise<Match[]> {
	try {
		const { data, error } = await supabase
			.from(TABLE_NAME)
			.select("*")
			.eq("competition_id", competitionId)

		if (error) throw error
		return matchesAdapter(data)
	} catch (error) {
		if (error instanceof Error) {
			console.error("Error getting matches by competition id:", error.message)
		} else {
			console.error("Error getting matches by competition id:", error)
		}
		throw new Error("No se pudieron obtener los partidos de la competición.")
	}
}

export async function getMatchesByCategoryId(
	categoryId: string,
): Promise<Match[]> {
	try {
		const { data, error } = await supabase
			.from(TABLE_NAME)
			.select("*")
			.eq("category_id", categoryId)

		if (error) throw error
		return matchesAdapter(data)
	} catch (error) {
		if (error instanceof Error) {
			console.error("Error getting matches by category id:", error.message)
		} else {
			console.error("Error getting matches by category id:", error)
		}
		throw new Error("No se pudieron obtener los partidos de la categoría.")
	}
}

export async function createMatch(match: MatchesInsert): Promise<Match> {
	try {
		const { data, error } = await supabase
			.from(TABLE_NAME)
			.insert(match)
			.select()
			.single()

		if (error) throw error
		return matchAdapter(data)
	} catch (error) {
		if (error instanceof Error) {
			console.error("Error creating match:", error.message)
		} else {
			console.error("Error creating match:", error)
		}
		throw new Error("No se pudo crear el partido.")
	}
}

export async function updateMatch(
	id: string,
	match: MatchesUpdate,
): Promise<Match> {
	try {
		const { data, error } = await supabase
			.from(TABLE_NAME)
			.update(match)
			.eq("id", id)
			.select()
			.single()

		if (error) throw error
		return matchAdapter(data)
	} catch (error) {
		if (error instanceof Error) {
			console.error("Error updating match:", error.message)
		} else {
			console.error("Error updating match:", error)
		}
		throw new Error("No se pudo actualizar el partido.")
	}
}

export async function deleteMatch(id: string): Promise<boolean> {
	try {
		const { error } = await supabase.from(TABLE_NAME).delete().eq("id", id)
		if (error) throw error
		return true
	} catch (error) {
		if (error instanceof Error) {
			console.error("Error deleting match:", error.message)
		} else {
			console.error("Error deleting match:", error)
		}
		throw new Error("No se pudo eliminar el partido.")
	}
}
