import { supabase } from "@/lib/supabase"

export type ChatThread = {
	id: string
	name: string
	matchId: string
	clubId: string
	createdAt: string
}

export type ChatMessage = {
	id: string
	threadId: string
	userId: string
	body: string
	createdAt: string
	senderName: string | null
}

export async function getChatThreadById(threadId: string): Promise<ChatThread> {
	const { data, error } = await supabase
		.from("chat_threads")
		.select("id,name,match_id,club_id,created_at")
		.eq("id", threadId)
		.single()

	if (error) throw error

	return {
		id: data.id,
		name: data.name,
		matchId: data.match_id,
		clubId: data.club_id,
		createdAt: data.created_at,
	}
}

export async function getChatMessages(
	threadId: string,
): Promise<ChatMessage[]> {
	const { data, error } = await supabase
		.from("chat_messages")
		.select("id,thread_id,user_id,body,created_at, profiles(name)")
		.eq("thread_id", threadId)
		.order("created_at", { ascending: true })

	if (error) throw error

	return (data ?? []).map((m) => ({
		id: m.id,
		threadId: m.thread_id,
		userId: m.user_id,
		body: m.body,
		createdAt: m.created_at,
		senderName: m.profiles?.name ?? null,
	}))
}

export async function sendChatMessage(
	threadId: string,
	body: string,
): Promise<ChatMessage> {
	const trimmed = body.trim()
	if (!trimmed) throw new Error("Mensaje vacío")

	const { data: userRes, error: userErr } = await supabase.auth.getUser()
	if (userErr) throw userErr
	const userId = userRes.user?.id
	if (!userId) throw new Error("No autenticado")

	const { data, error } = await supabase
		.from("chat_messages")
		.insert({
			thread_id: threadId,
			user_id: userId,
			body: trimmed,
		})
		.select("id,thread_id,user_id,body,created_at")
		.single()

	if (error) throw error

	return {
		id: data.id,
		threadId: data.thread_id,
		userId: data.user_id,
		body: data.body,
		createdAt: data.created_at,
	}
}
