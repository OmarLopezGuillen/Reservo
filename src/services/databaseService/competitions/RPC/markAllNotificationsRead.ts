import { supabase } from "@/lib/supabase"

export async function markAllNotificationsRead(): Promise<void> {
	const { error } = await supabase.rpc("mark_all_notifications_read")
	if (error) throw error
}
