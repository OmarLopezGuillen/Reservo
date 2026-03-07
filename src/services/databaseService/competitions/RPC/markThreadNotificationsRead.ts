import { supabase } from "@/lib/supabase"

export async function markThreadNotificationsRead(
	threadId: string,
): Promise<void> {
	const { error } = await supabase.rpc("mark_thread_notifications_read", {
		p_thread_id: threadId,
	})
	if (error) throw error
}
