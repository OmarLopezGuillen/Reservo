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

export async function getAllCompetitions(): Promise<Competition[]> {
	try {
		const { data, error } = await supabase.from(TABLE_NAME).select("*")

		if (error) throw error
		return competitionsAdapter(data)
	} catch (error) {
		if (error instanceof Error) {
			console.error("Error getting competitions:", error.message)
		} else {
			console.error("Error getting competitions:", error)
		}
		throw new Error("No se pudo obtener las competiciónes.")
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

export async function getCompetitionsByUserId(
	userId: string,
): Promise<Competition[]> {
	// Devuelve solo las competiciones en las que el usuario está inscrito:
	// 1) obtiene sus `competition_id` desde `competition_participants`
	// 2) consulta `competitions` por ese conjunto de ids
	try {
		const { data: participantRows, error: participantsError } = await supabase
			.from("competition_participants")
			.select("competition_id")
			.eq("user_id", userId)

		if (participantsError) throw participantsError

		const competitionIds = Array.from(
			new Set((participantRows ?? []).map((row) => row.competition_id)),
		)

		if (competitionIds.length === 0) return []

		const { data, error } = await supabase
			.from(TABLE_NAME)
			.select("*")
			.in("id", competitionIds)

		if (error) throw error
		return competitionsAdapter(data)
	} catch (error) {
		if (error instanceof Error) {
			console.error("Error getting competitions by user id:", error.message)
		} else {
			console.error("Error getting competitions by user id:", error)
		}
		throw new Error("No se pudieron obtener las competiciones del usuario.")
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
