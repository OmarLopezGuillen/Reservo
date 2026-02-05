import { supabase } from "@/lib/supabase"
import type { ChatThreadsRow } from "@/models/dbTypes"
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

export async function getChatThreads() {
	const { data, error } = await supabase
		.from("chat_threads")
		.select("*")
		.order("created_at", { ascending: false })

	if (error) throw error
	return chatThreadsAdapter((data ?? []) as ChatThreadsRow[])
}
