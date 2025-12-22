import { supabase } from "@/lib/supabase"
import type { TeamAvailability } from "@/models/competition.model"
import type {
	TeamAvailabilitiesInsert,
	TeamAvailabilitiesUpdate,
} from "@/models/dbTypes"
import {
	teamAvailabilitiesAdapter,
	teamAvailabilityAdapter,
} from "@/services/adapters/competitions.adapter"

const TABLE_NAME = "team_availabilities"

export async function getTeamAvailabilityById(
	id: string,
): Promise<TeamAvailability> {
	try {
		const { data, error } = await supabase
			.from(TABLE_NAME)
			.select("*")
			.eq("id", id)
			.single()

		if (error) throw error
		return teamAvailabilityAdapter(data)
	} catch (error) {
		if (error instanceof Error) {
			console.error("Error getting team availability by id:", error.message)
		} else {
			console.error("Error getting team availability by id:", error)
		}
		throw new Error("No se pudo obtener la disponibilidad del equipo.")
	}
}

export async function getTeamAvailabilitiesByTeamId(
	teamId: string,
): Promise<TeamAvailability[]> {
	try {
		const { data, error } = await supabase
			.from(TABLE_NAME)
			.select("*")
			.eq("team_id", teamId)

		if (error) throw error
		return teamAvailabilitiesAdapter(data)
	} catch (error) {
		if (error instanceof Error) {
			console.error(
				"Error getting team availabilities by team id:",
				error.message,
			)
		} else {
			console.error("Error getting team availabilities by team id:", error)
		}
		throw new Error("No se pudieron obtener las disponibilidades del equipo.")
	}
}

export async function getTeamsAvailabilitiesByTeamIds(
	teamIds: string[],
): Promise<{ teamId: string; availabilities: TeamAvailability[] }[]> {
	if (teamIds.length === 0) return []

	try {
		const { data, error } = await supabase
			.from(TABLE_NAME)
			.select("*")
			.in("team_id", teamIds)

		if (error) throw error

		const grouped = teamIds.reduce<Map<string, TeamAvailability[]>>(
			(map, id) => map.set(id, []),
			new Map(),
		)

		teamAvailabilitiesAdapter(data ?? []).forEach((availability) => {
			const list = grouped.get(availability.teamId) ?? []
			list.push(availability)
			grouped.set(availability.teamId, list)
		})

		return Array.from(grouped.entries()).map(([teamId, availabilities]) => ({
			teamId,
			availabilities,
		}))
	} catch (error) {
		if (error instanceof Error) {
			console.error(
				"Error getting team availabilities by team ids:",
				error.message,
			)
		} else {
			console.error("Error getting team availabilities by team ids:", error)
		}
		throw new Error(
			"No se pudieron obtener las disponibilidades de los equipos.",
		)
	}
}

export async function createTeamAvailability(
	availability: TeamAvailabilitiesInsert,
): Promise<TeamAvailability> {
	try {
		const { data, error } = await supabase
			.from(TABLE_NAME)
			.insert(availability)
			.select()
			.single()

		if (error) throw error
		return teamAvailabilityAdapter(data)
	} catch (error) {
		if (error instanceof Error) {
			console.error("Error creating team availability:", error.message)
		} else {
			console.error("Error creating team availability:", error)
		}
		throw new Error("No se pudo crear la disponibilidad del equipo.")
	}
}

export async function updateTeamAvailability(
	id: string,
	availability: TeamAvailabilitiesUpdate,
): Promise<TeamAvailability> {
	try {
		const { data, error } = await supabase
			.from(TABLE_NAME)
			.update(availability)
			.eq("id", id)
			.select()
			.single()

		if (error) throw error
		return teamAvailabilityAdapter(data)
	} catch (error) {
		if (error instanceof Error) {
			console.error("Error updating team availability:", error.message)
		} else {
			console.error("Error updating team availability:", error)
		}
		throw new Error("No se pudo actualizar la disponibilidad del equipo.")
	}
}

export async function deleteTeamAvailability(id: string): Promise<boolean> {
	try {
		const { error } = await supabase.from(TABLE_NAME).delete().eq("id", id)
		if (error) throw error
		return true
	} catch (error) {
		if (error instanceof Error) {
			console.error("Error deleting team availability:", error.message)
		} else {
			console.error("Error deleting team availability:", error)
		}
		throw new Error("No se pudo eliminar la disponibilidad del equipo.")
	}
}
