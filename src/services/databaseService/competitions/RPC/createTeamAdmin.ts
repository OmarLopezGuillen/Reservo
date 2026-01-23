import { supabase } from "@/lib/supabase"
import type { MemberTeamRole } from "@/models/dbTypes"

export interface CreateTeamAdminParams {
	competitionId: string
	categoryId: string
	teamName: string
	emailPlayer1: string
	emailPlayer2: string
}

export interface CreateTeamAdminResponse {
	team_id: string
	members_created: number
	members: {
		email: string
		role: MemberTeamRole
		user_id: string
	}[]
	invites: {
		email: string
		role: MemberTeamRole
		token: string
	}[]
}

export async function createTeamByAdmin({
	competitionId,
	categoryId,
	teamName,
	emailPlayer1,
	emailPlayer2,
}: CreateTeamAdminParams): Promise<CreateTeamAdminResponse> {
	try {
		const { data, error } = await supabase.rpc(
			"admin_create_team_with_emails",
			{
				p_competition_id: competitionId,
				p_category_id: categoryId,
				p_team_name: teamName,
				p_email_player1: emailPlayer1,
				p_email_player2: emailPlayer2,
			},
		)

		if (error) throw error
		if (!data) {
			throw new Error("La creación del equipo no devolvió los datos esperados.")
		}

		return data as unknown as CreateTeamAdminResponse
	} catch (error) {
		console.error("Error creating team by admin:", error)
		// Re-lanzamos el error original para que el hook pueda acceder a su mensaje.
		throw error
	}
}
