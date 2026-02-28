import { supabase } from "@/lib/supabase"
import type { ChatThread } from "@/models/competition.model"
import type { ChatThreadDbRow, ChatThreadsRow } from "@/models/dbTypes"
import { chatThreadsAdapter } from "@/services/adapters/competitions.adapter"

export async function getChatThreadByMatchId(
	matchId: string,
): Promise<string | null> {
	const { data, error } = await supabase
		.from("chat_threads")
		.select("id")
		.eq("match_id", matchId)
		.maybeSingle()

	if (error) throw error
	return data?.id ?? null
}

export async function getChatThreads(): Promise<ChatThread[]> {
	const { data, error } = await supabase
		.from("chat_threads")
		.select(`
			id,
			name,
			match_id,
			club_id,
			created_at,
			created_by,
			needs_admin_attention,
			needs_admin_attention_at,
			needs_admin_attention_by,
			needs_admin_attention_message_id,
			match:matches (
				id,
				competition_id,
				competition:competitions (
					id,
					name
				)
			)
		`)
		.order("created_at", { ascending: false })

	if (error) throw error

	return chatThreadsAdapter((data ?? []) as ChatThreadDbRow[])
}
