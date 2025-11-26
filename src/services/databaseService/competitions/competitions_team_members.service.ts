import { supabase } from "@/lib/supabase"
import type { CompetitionTeamMember } from "@/models/competition.model"
import type {
	CompetitionTeamMembersInsert,
	CompetitionTeamMembersUpdate,
} from "@/models/dbTypes"
import {
	competitionTeamMemberAdapter,
	competitionTeamMembersAdapter,
} from "@/services/adapters/competitions.adapter"

const TABLE_NAME = "competition_team_members"

export async function getCompetitionTeamMemberById(
	id: string,
): Promise<CompetitionTeamMember> {
	try {
		const { data, error } = await supabase
			.from(TABLE_NAME)
			.select("*")
			.eq("id", id)
			.single()

		if (error) throw error
		return competitionTeamMemberAdapter(data)
	} catch (error) {
		if (error instanceof Error) {
			console.error(
				"Error getting competition team member by id:",
				error.message,
			)
		} else {
			console.error("Error getting competition team member by id:", error)
		}
		throw new Error("No se pudo obtener el miembro del equipo.")
	}
}

export async function getCompetitionTeamMembersByTeamId(
	teamId: string,
): Promise<CompetitionTeamMember[]> {
	try {
		const { data, error } = await supabase
			.from(TABLE_NAME)
			.select("*")
			.eq("team_id", teamId)

		if (error) throw error
		return competitionTeamMembersAdapter(data)
	} catch (error) {
		if (error instanceof Error) {
			console.error(
				"Error getting competition team members by team id:",
				error.message,
			)
		} else {
			console.error("Error getting competition team members by team id:", error)
		}
		throw new Error("No se pudieron obtener los miembros del equipo.")
	}
}

export async function createCompetitionTeamMember(
	member: CompetitionTeamMembersInsert,
): Promise<CompetitionTeamMember> {
	try {
		const { data, error } = await supabase
			.from(TABLE_NAME)
			.insert(member)
			.select()
			.single()

		if (error) throw error
		return competitionTeamMemberAdapter(data)
	} catch (error) {
		if (error instanceof Error) {
			console.error("Error creating competition team member:", error.message)
		} else {
			console.error("Error creating competition team member:", error)
		}
		throw new Error("No se pudo añadir el miembro al equipo.")
	}
}

export async function updateCompetitionTeamMember(
	id: string,
	member: CompetitionTeamMembersUpdate,
): Promise<CompetitionTeamMember> {
	try {
		const { data, error } = await supabase
			.from(TABLE_NAME)
			.update(member)
			.eq("id", id)
			.select()
			.single()

		if (error) throw error
		return competitionTeamMemberAdapter(data)
	} catch (error) {
		if (error instanceof Error) {
			console.error("Error updating competition team member:", error.message)
		} else {
			console.error("Error updating competition team member:", error)
		}
		throw new Error("No se pudo actualizar el miembro del equipo.")
	}
}

export async function deleteCompetitionTeamMember(
	id: string,
): Promise<boolean> {
	try {
		const { error } = await supabase.from(TABLE_NAME).delete().eq("id", id)
		if (error) throw error
		return true
	} catch (error) {
		if (error instanceof Error) {
			console.error("Error deleting competition team member:", error.message)
		} else {
			console.error("Error deleting competition team member:", error)
		}
		throw new Error("No se pudo eliminar el miembro del equipo.")
	}
}
