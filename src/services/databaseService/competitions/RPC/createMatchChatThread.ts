import { supabase } from "@/lib/supabase"

export interface CreateMatchChatThreadParams {
	matchId: string
}

export interface CreateMatchChatThreadResponse {
	thread_id: string
}

export async function createMatchChatThread({
	matchId,
}: CreateMatchChatThreadParams): Promise<CreateMatchChatThreadResponse> {
	try {
		const { data, error } = await supabase.rpc("create_match_chat_thread", {
			p_match_id: matchId,
		})

		if (error) throw error

		if (!data) {
			throw new Error("La creación del chat no devolvió los datos esperados.")
		}

		// Si tu RPC devuelve directamente un uuid (string), lo convertimos al shape esperado
		if (typeof data === "string") {
			return { thread_id: data }
		}

		// Si en algún momento cambias el RPC para devolver un objeto, también lo soporta
		if (typeof data === "object" && data && "thread_id" in data) {
			return data as unknown as CreateMatchChatThreadResponse
		}

		throw new Error(
			"Formato de respuesta inesperado al crear el chat del partido.",
		)
	} catch (error) {
		console.error("Error creating match chat thread:", error)
		throw error
	}
}
