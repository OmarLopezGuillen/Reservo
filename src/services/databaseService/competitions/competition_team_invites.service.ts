import { supabase } from "@/lib/supabase"
import type { CompetitionTeamInvite } from "@/models/competition.model"
import type {
	CompetitionTeamInvitesInsert,
	CompetitionTeamInvitesUpdate,
} from "@/models/dbTypes"
import {
	competitionTeamInviteAdapter,
	competitionTeamInvitesAdapter,
} from "@/services/adapters/competitions.adapter"

const TABLE_NAME = "competition_team_invites"

export async function getCompetitionTeamInviteById(
	id: string,
): Promise<CompetitionTeamInvite> {
	try {
		const { data, error } = await supabase
			.from(TABLE_NAME)
			.select("*")
			.eq("id", id)
			.single()

		if (error) throw error
		return competitionTeamInviteAdapter(data)
	} catch (error) {
		if (error instanceof Error) {
			console.error(
				"Error getting competition team invite by id:",
				error.message,
			)
		} else {
			console.error("Error getting competition team invite by id:", error)
		}
		throw new Error("No se pudo obtener la invitación al equipo.")
	}
}

export async function getCompetitionTeamInvitesByTeamId(
	teamId: string,
): Promise<CompetitionTeamInvite[]> {
	try {
		const { data, error } = await supabase
			.from(TABLE_NAME)
			.select("*")
			.eq("team_id", teamId)

		if (error) throw error
		return competitionTeamInvitesAdapter(data)
	} catch (error) {
		if (error instanceof Error) {
			console.error(
				"Error getting competition team invites by team id:",
				error.message,
			)
		} else {
			console.error("Error getting competition team invites by team id:", error)
		}
		throw new Error("No se pudieron obtener las invitaciones del equipo.")
	}
}

export async function createCompetitionTeamInvite(
	invite: CompetitionTeamInvitesInsert,
): Promise<CompetitionTeamInvite> {
	try {
		const { data, error } = await supabase
			.from(TABLE_NAME)
			.insert(invite)
			.select()
			.single()

		if (error) throw error
		return competitionTeamInviteAdapter(data)
	} catch (error) {
		if (error instanceof Error) {
			console.error("Error creating competition team invite:", error.message)
		} else {
			console.error("Error creating competition team invite:", error)
		}
		throw new Error("No se pudo crear la invitación al equipo.")
	}
}

export async function updateCompetitionTeamInvite(
	id: string,
	invite: CompetitionTeamInvitesUpdate,
): Promise<CompetitionTeamInvite> {
	try {
		const { data, error } = await supabase
			.from(TABLE_NAME)
			.update(invite)
			.eq("id", id)
			.select()
			.single()

		if (error) throw error
		return competitionTeamInviteAdapter(data)
	} catch (error) {
		if (error instanceof Error) {
			console.error("Error updating competition team invite:", error.message)
		} else {
			console.error("Error updating competition team invite:", error)
		}
		throw new Error("No se pudo actualizar la invitación al equipo.")
	}
}

export async function deleteCompetitionTeamInvite(
	id: string,
): Promise<boolean> {
	try {
		const { error } = await supabase.from(TABLE_NAME).delete().eq("id", id)
		if (error) throw error
		return true
	} catch (error) {
		if (error instanceof Error) {
			console.error("Error deleting competition team invite:", error.message)
		} else {
			console.error("Error deleting competition team invite:", error)
		}
		throw new Error("No se pudo eliminar la invitación al equipo.")
	}
}
