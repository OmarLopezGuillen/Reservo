import { supabase } from "@/lib/supabase"
import type { MemberTeamRole } from "@/models/dbTypes"

export interface AcceptTeamInviteParams {
	token: string
}

export interface AcceptTeamInviteResponse {
	status: "success"
	team_id: string
	team_name: string
	role: MemberTeamRole
	message: string
}

export async function acceptTeamInvite({
	token,
}: AcceptTeamInviteParams): Promise<AcceptTeamInviteResponse> {
	try {
		const { data, error } = await supabase.rpc("accept_team_invite", {
			p_token: token,
		})

		if (error) {
			// Puedes personalizar los mensajes de error para el frontend
			if (error.message.includes("Invitación inválida")) {
				throw new Error(
					"La invitación no es válida, ha expirado o ya fue utilizada.",
				)
			}
			throw error
		}

		if (!data) {
			throw new Error("La operación no devolvió los datos esperados.")
		}

		return data as unknown as AcceptTeamInviteResponse
	} catch (error) {
		console.error("Error accepting team invite:", error)
		// Re-lanzamos el error para que el hook que lo use pueda manejarlo.
		throw error
	}
}
