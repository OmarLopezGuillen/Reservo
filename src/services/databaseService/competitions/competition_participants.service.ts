import { supabase } from "@/lib/supabase"
import type { CompetitionParticipant } from "@/models/competition.model"
import type {
	CompetitionParticipantsInsert,
	CompetitionParticipantsUpdate,
} from "@/models/dbTypes"
import {
	competitionParticipantAdapter,
	competitionParticipantsAdapter,
} from "@/services/adapters/competitions.adapter"

const TABLE_NAME = "competition_participants"

export async function getCompetitionParticipantById(
	id: string,
): Promise<CompetitionParticipant> {
	try {
		const { data, error } = await supabase
			.from(TABLE_NAME)
			.select("*")
			.eq("id", id)
			.single()

		if (error) throw error
		return competitionParticipantAdapter(data)
	} catch (error) {
		if (error instanceof Error) {
			console.error(
				"Error getting competition participant by id:",
				error.message,
			)
		} else {
			console.error("Error getting competition participant by id:", error)
		}
		throw new Error("No se pudo obtener el participante de la competición.")
	}
}

export async function getCompetitionParticipantsByCompetitionId(
	competitionId: string,
): Promise<CompetitionParticipant[]> {
	try {
		const { data, error } = await supabase
			.from(TABLE_NAME)
			.select("*")
			.eq("competition_id", competitionId)

		if (error) throw error
		return competitionParticipantsAdapter(data)
	} catch (error) {
		if (error instanceof Error) {
			console.error(
				"Error getting competition participants by competition id:",
				error.message,
			)
		} else {
			console.error(
				"Error getting competition participants by competition id:",
				error,
			)
		}
		throw new Error(
			"No se pudieron obtener los participantes de la competición.",
		)
	}
}

export async function createCompetitionParticipant(
	participant: CompetitionParticipantsInsert,
): Promise<CompetitionParticipant> {
	try {
		const { data, error } = await supabase
			.from(TABLE_NAME)
			.insert(participant)
			.select()
			.single()

		if (error) throw error
		return competitionParticipantAdapter(data)
	} catch (error) {
		if (error instanceof Error) {
			console.error("Error creating competition participant:", error.message)
		} else {
			console.error("Error creating competition participant:", error)
		}
		throw new Error("No se pudo crear el participante de la competición.")
	}
}

export async function updateCompetitionParticipant(
	id: string,
	participant: CompetitionParticipantsUpdate,
): Promise<CompetitionParticipant> {
	try {
		const { data, error } = await supabase
			.from(TABLE_NAME)
			.update(participant)
			.eq("id", id)
			.select()
			.single()

		if (error) throw error
		return competitionParticipantAdapter(data)
	} catch (error) {
		if (error instanceof Error) {
			console.error("Error updating competition participant:", error.message)
		} else {
			console.error("Error updating competition participant:", error)
		}
		throw new Error("No se pudo actualizar el participante de la competición.")
	}
}

export async function deleteCompetitionParticipant(
	id: string,
): Promise<boolean> {
	try {
		const { error } = await supabase.from(TABLE_NAME).delete().eq("id", id)
		if (error) throw error
		return true
	} catch (error) {
		if (error instanceof Error) {
			console.error("Error deleting competition participant:", error.message)
		} else {
			console.error("Error deleting competition participant:", error)
		}
		throw new Error("No se pudo eliminar el participante de la competición.")
	}
}
