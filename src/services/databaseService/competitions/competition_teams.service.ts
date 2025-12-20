//Tengo que traer los equipos junto con su disponibilidad que esta en la otra tabla
import { supabase } from "@/lib/supabase"
import type { CompetitionTeamWithMemberAndAvailability } from "@/models/competition.model"
import type {
	CompetitionTeamsInsert,
	CompetitionTeamsUpdate,
} from "@/models/dbTypes"
import {
	competitionTeamWithMemberAndAvailabilitiesAdapter,
	competitionTeamWithMemberAndAvailabilityAdapter,
} from "@/services/adapters/competitions.adapter"

const TABLE_NAME = "competition_teams"

export async function getCompetitionTeamById(
	id: string,
): Promise<CompetitionTeamWithMemberAndAvailability> {
	try {
		const { data, error } = await supabase
			.from(TABLE_NAME)
			.select(`*, team_availabilities(*), competition_team_members(*)`)
			.eq("id", id)
			.single()

		if (error) throw error
		return competitionTeamWithMemberAndAvailabilityAdapter(data)
	} catch (error) {
		if (error instanceof Error) {
			console.error("Error getting competition team by id:", error.message)
		} else {
			console.error("Error getting competition team by id:", error)
		}
		throw new Error("No se pudo obtener el equipo de la competición.")
	}
}

export async function getCompetitionTeamsByCompetitionId(
	competitionId: string,
): Promise<CompetitionTeamWithMemberAndAvailability[]> {
	try {
		const { data, error } = await supabase
			.from(TABLE_NAME)
			.select(
				`*, team_availabilities(*), competition_team_members(*, profiles (*))`,
			)
			.eq("competition_id", competitionId)

		console.log("data", data)
		if (error) throw error
		return competitionTeamWithMemberAndAvailabilitiesAdapter(data)
	} catch (error) {
		if (error instanceof Error) {
			console.error(
				"Error getting competition teams by competition id:",
				error.message,
			)
		} else {
			console.error("Error getting competition teams by competition id:", error)
		}
		throw new Error("No se pudieron obtener los equipos de la competición.")
	}
}

export async function getCompetitionTeamsByCategoryId(
	categoryId: string,
): Promise<CompetitionTeamWithMemberAndAvailability[]> {
	try {
		const { data, error } = await supabase
			.from(TABLE_NAME)
			.select(`*, team_availabilities(*), competition_team_members(*)`)
			.eq("category_id", categoryId)

		if (error) throw error
		return competitionTeamWithMemberAndAvailabilitiesAdapter(data)
	} catch (error) {
		if (error instanceof Error) {
			console.error(
				"Error getting competition teams by category id:",
				error.message,
			)
		} else {
			console.error("Error getting competition teams by category id:", error)
		}
		throw new Error("No se pudieron obtener los equipos de la categoría.")
	}
}

export async function createCompetitionTeam(
	teamData: CompetitionTeamsInsert,
): Promise<CompetitionTeamWithMemberAndAvailability> {
	try {
		const { data, error } = await supabase
			.from(TABLE_NAME)
			.insert(teamData)
			.select("*, team_availabilities(*), competition_team_members(*)")
			.single()

		if (error) throw error

		return competitionTeamWithMemberAndAvailabilityAdapter(data)
	} catch (error) {
		if (error instanceof Error) {
			console.error("Error creating competition team:", error.message)
		} else {
			console.error("Error creating competition team:", error)
		}
		throw new Error("No se pudo crear el equipo de la competición.")
	}
}

export async function updateCompetitionTeam(
	teamId: string,
	teamData: CompetitionTeamsUpdate,
): Promise<CompetitionTeamWithMemberAndAvailability> {
	try {
		const { data, error } = await supabase
			.from(TABLE_NAME)
			.update(teamData)
			.eq("id", teamId)
			.select("*, team_availabilities(*), competition_team_members(*)")
			.single()

		if (error) throw error
		return competitionTeamWithMemberAndAvailabilityAdapter(data)
	} catch (error) {
		if (error instanceof Error) {
			console.error("Error updating competition team:", error.message)
		} else {
			console.error("Error updating competition team:", error)
		}
		throw new Error("No se pudo actualizar el equipo de la competición.")
	}
}

export async function deleteCompetitionTeam(id: string): Promise<boolean> {
	try {
		const { error } = await supabase.from(TABLE_NAME).delete().eq("id", id)
		if (error) throw error
		return true
	} catch (error) {
		if (error instanceof Error) {
			console.error("Error deleting competition team:", error.message)
		} else {
			console.error("Error deleting competition team:", error)
		}
		throw new Error("No se pudo eliminar el equipo de la competición.")
	}
}
